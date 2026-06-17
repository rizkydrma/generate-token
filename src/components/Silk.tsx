/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

function hex2rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

const VERT = /* glsl */`#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

/**
 * Silk shader — smooth flowing fabric folds via double domain-warped sine waves.
 * NO fract-based noise (that causes concentric rings).
 * The pattern is entirely smooth sinusoidal waves with domain warping.
 */
const FRAG = /* glsl */`#version 300 es
precision highp float;

in vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform vec2  uResolution;

out vec4 fragColor;

// ── 2-D rotation ─────────────────────────────────────────────────────────────
vec2 rot(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

// ── Smooth flowing silk fold value ────────────────────────────────────────────
// Uses double domain-warp (Quilez 2017 technique) on smooth sine waves.
// Result: 0..1 representing shadow→highlight on the fabric.
float silkFold(vec2 uv, float t) {

  // ── Pass 1 – large-scale warp ─────────────────────────────────────────────
  float wx1 = sin(uv.y * 1.60 + t * 0.70) * 0.30
            + sin(uv.y * 0.80 - t * 0.40) * 0.15;
  float wy1 = cos(uv.x * 1.40 + t * 0.55) * 0.30
            + cos(uv.x * 0.70 - t * 0.35) * 0.15;
  vec2 q = uv + vec2(wx1, wy1);

  // ── Pass 2 – medium-scale warp on already-warped coords ───────────────────
  float wx2 = sin(q.y * 2.50 - t * 0.45) * 0.14
            + sin(q.x * 1.80 + t * 0.30) * 0.08;
  float wy2 = cos(q.x * 2.20 + t * 0.60) * 0.14
            + cos(q.y * 1.60 - t * 0.25) * 0.08;
  vec2 r = q + vec2(wx2, wy2);

  // ── Smooth sinusoidal bands along warped coords ───────────────────────────
  float band1 = sin(r.x * 2.20 + r.y * 1.10 + t * 0.90) * 0.50 + 0.50;
  float band2 = sin(r.x * 1.40 - r.y * 2.60 + t * 1.10) * 0.50 + 0.50;
  float band3 = sin(r.x * 3.10 + r.y * 0.70 - t * 0.70) * 0.50 + 0.50;
  float band4 = sin(r.x * 0.90 + r.y * 3.20 + t * 0.60) * 0.50 + 0.50;

  return band1 * 0.40 + band2 * 0.30 + band3 * 0.20 + band4 * 0.10;
}

void main() {
  // Aspect-correct UV → [0,1] with correct ratio
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  // Apply user rotation around centre
  uv = rot(uv - vec2(uResolution.x / uResolution.y * 0.5, 0.5), uRotation)
     + vec2(uResolution.x / uResolution.y * 0.5, 0.5);

  // Scale (zoom in/out the fold pattern)
  uv *= uScale;

  float t = uTime * uSpeed * 0.12;

  // ── Silk fold value ───────────────────────────────────────────────────────
  float fold = silkFold(uv, t);

  // ── Optional fine micro-texture (thin highlight lines) ───────────────────
  //    Very subtle – just brightens along the fold crests slightly
  float micro = sin(uv.x * 18.0 + uv.y * 14.0 + t * 4.0) * 0.5 + 0.5;
  fold += micro * uNoiseIntensity * 0.04;
  fold = clamp(fold, 0.0, 1.0);

  // ── Colour mapping: deep shadow → base colour → bright highlight ──────────
  vec3 deep    = uColor * 0.20;           // very dark fold trough
  vec3 mid     = uColor;                  // base silk colour
  vec3 bright  = uColor + 0.38;           // bright fold crest (linen sheen)
  bright       = clamp(bright, 0.0, 1.0);

  // Two-stop gradient: shadow→mid in lower half, mid→bright in upper half
  vec3 col;
  if (fold < 0.5) {
    col = mix(deep, mid, fold * 2.0);
  } else {
    col = mix(mid, bright, (fold - 0.5) * 2.0);
  }

  fragColor = vec4(col, 1.0);
}
`;

const Silk: React.FC<SilkProps> = ({
  speed          = 5.0,
  scale          = 1.0,
  color          = '#7B2FBE',
  noiseIntensity = 1.5,
  rotation       = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef({ speed, scale, color, noiseIntensity, rotation });
  liveRef.current = { speed, scale, color, noiseIntensity, rotation };

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const renderer = new Renderer({ alpha: false, antialias: false });
    const gl = renderer.gl;
    gl.canvas.style.display = 'block';

    let program: Program | undefined;

    const resize = () => {
      const w = ctn.offsetWidth;
      const h = ctn.offsetHeight;
      renderer.setSize(w, h);
      if (program) program.uniforms.uResolution.value = [w, h];
    };
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if ((geometry as any).attributes.uv) delete (geometry as any).attributes.uv;

    program = new Program(gl, {
      vertex:   VERT,
      fragment: FRAG,
      uniforms: {
        uTime:           { value: 0 },
        uColor:          { value: hex2rgb(color) },
        uSpeed:          { value: speed },
        uScale:          { value: scale },
        uRotation:       { value: rotation },
        uNoiseIntensity: { value: noiseIntensity },
        uResolution:     { value: [ctn.offsetWidth, ctn.offsetHeight] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);
    resize();

    let rafId = 0;
    const update = (ts: number) => {
      rafId = requestAnimationFrame(update);
      const p = liveRef.current;
      const u = program!.uniforms;
      u.uTime.value           = ts * 0.001;
      u.uColor.value          = hex2rgb(p.color);
      u.uSpeed.value          = p.speed;
      u.uScale.value          = p.scale;
      u.uRotation.value       = p.rotation;
      u.uNoiseIntensity.value = p.noiseIntensity;
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (ctn && gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Silk;
