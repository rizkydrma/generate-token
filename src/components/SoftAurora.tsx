/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SoftAuroraProps {
  speed?: number;
  scale?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  noiseFrequency?: number;
  noiseAmplitude?: number;
  bandHeight?: number;
  bandSpread?: number;
  octaveDecay?: number;
  layerOffset?: number;
  colorSpeed?: number;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function hex2rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// ─── Shaders ─────────────────────────────────────────────────────────────────
const VERT = /* glsl */`#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

/**
 * Produces a HORIZONTAL band of soft aurora light that:
 *   - Spans the full width of the viewport
 *   - Undulates vertically using layered Perlin noise (fbm)
 *   - Blends color1 (left) → color2 (right) with animated colorSpeed
 *   - Has a tight bright core + wide outer glow
 *   - Reacts to mouse position when enableMouseInteraction is true
 */
const FRAG = /* glsl */`#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform float uNoiseFrequency;
uniform float uNoiseAmplitude;
uniform float uBandHeight;
uniform float uBandSpread;
uniform float uOctaveDecay;
uniform float uLayerOffset;
uniform float uColorSpeed;
uniform float uMouseInfluence;

out vec4 fragColor;

// ── Simplex 2-D noise (Ashima Arts) ──────────────────────────────────────────
vec3 p3(vec3 x){ return mod(((x*34.)+1.)*x,289.); }
float snoise(vec2 v){
  const vec4 C=vec4(.211324865,.366025404,-.577350269,.024390244);
  vec2 i=floor(v+dot(v,C.yy)), x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod(i,289.);
  vec3 p=p3(p3(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m; m=m*m;
  vec3 x=2.*fract(p*C.www)-1., h=abs(x)-.5, ox=floor(x+.5), a0=x-ox;
  m*=1.79284291-.85373472*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}

// Low-detail fbm – only 2 octaves so it's smooth, not spiky
float fbm2(vec2 p){
  float v = snoise(p) * 0.65 + snoise(p * 1.9 + vec2(5.2, 1.3)) * 0.35;
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;

  float t = uTime * uSpeed;

  // ── very gentle, slow warp of the band centre ─────────────────────────────
  //    We deliberately keep the spatial frequency LOW and amplitude TINY
  //    so the band bends like a lazy wave, not a lightning bolt.
  float freq   = uNoiseFrequency * 0.25 * uScale;   // ÷4 from raw prop
  float warpY  = fbm2(vec2(uv.x * freq + t * 0.18, t * 0.08 + uLayerOffset));
  // Maximum displacement ≈ 4 % of viewport — gentle S-curve
  float disp   = warpY * uNoiseAmplitude * 0.04;

  // Mouse nudges the whole band up/down
  float mouseY = (uMouse.y - 0.5) * uMouseInfluence * 0.12;

  float bandCentre = uBandHeight + disp + mouseY;
  float dy = uv.y - bandCentre;

  // ── wide soft Gaussian glow (the "aurora fog") ────────────────────────────
  //    sigma = 22 % of viewport height by default (bandSpread=1)
  float sigma = uBandSpread * 0.22 + 0.03;

  float outerGlow = exp(-(dy*dy) / (sigma * sigma));          // wide fog
  float midGlow   = exp(-(dy*dy) / (sigma * sigma * 0.22));   // medium bloom
  float coreGlow  = exp(-(dy*dy) / (sigma * sigma * 0.045));  // soft core

  // ── horizontal color gradient (color1=left → color2=right) ───────────────
  //    Animate hue position very slowly with colorSpeed
  float cx = uv.x;
  // tiny noise ripple along the colour axis — keeps it alive without jagging
  cx += fbm2(vec2(uv.y * 1.2 + t * uColorSpeed * 0.15, t * 0.05)) * 0.04;
  cx  = clamp(cx, 0.0, 1.0);

  vec3 bandColor = mix(uColor1, uColor2, cx);

  // Add a cool blue tint on the left edge to match the reference image look
  // (even if color1 is near-white, the left side appears blue)
  vec3 coolLeft = vec3(0.35, 0.55, 1.0);
  bandColor = mix(coolLeft * bandColor, bandColor, smoothstep(0.0, 0.55, cx));

  // ── compose: outer fog + mid bloom + soft bright core ────────────────────
  vec3 col  = bandColor * outerGlow * 0.50;
       col += bandColor * midGlow   * 0.65;
       col += (bandColor + 0.35)    * coreGlow * 0.70;  // brightened, not pure white
  col *= uBrightness;

  // Use outerGlow for alpha so the whole fog region is visible
  float a = outerGlow * uBrightness;
  a = clamp(a, 0.0, 1.0);

  fragColor = vec4(col * a, a);
}
`;


// ─── Component ───────────────────────────────────────────────────────────────
const SoftAurora: React.FC<SoftAuroraProps> = (props) => {
  const {
    speed           = 0.6,
    scale           = 1.5,
    brightness      = 1.0,
    color1          = '#f7f7f7',
    color2          = '#e100ff',
    noiseFrequency  = 2.5,
    noiseAmplitude  = 1.0,
    bandHeight      = 0.5,
    bandSpread      = 1.0,
    octaveDecay     = 0.1,
    layerOffset     = 0,
    colorSpeed      = 1.0,
    mouseInfluence  = 0.25,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  // Keep a live ref so the RAF loop always reads the latest props
  const liveProps = useRef(props);
  liveProps.current = props;

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    // ── OGL renderer ─────────────────────────────────────────────────────────
    const renderer = new Renderer({ alpha: true, antialias: true, premultipliedAlpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';
    gl.canvas.style.display = 'block';

    let program: Program | undefined;

    const resize = () => {
      const w = ctn.offsetWidth;
      const h = ctn.offsetHeight;
      renderer.setSize(w, h);
      program?.uniforms.uResolution && (program.uniforms.uResolution.value = [w, h]);
    };
    window.addEventListener('resize', resize);

    // ── Mouse tracking ───────────────────────────────────────────────────────
    const mouse = [0.5, 0.5];
    const onMove = (e: MouseEvent) => {
      if (!liveProps.current.enableMouseInteraction) return;
      mouse[0] = e.clientX / window.innerWidth;
      mouse[1] = 1.0 - e.clientY / window.innerHeight; // flip Y for GL
    };
    window.addEventListener('mousemove', onMove);

    // ── Geometry & Program ───────────────────────────────────────────────────
    const geometry = new Triangle(gl);
    if ((geometry as any).attributes.uv) delete (geometry as any).attributes.uv;

    program = new Program(gl, {
      vertex:   VERT,
      fragment: FRAG,
      uniforms: {
        uTime:           { value: 0 },
        uResolution:     { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uMouse:          { value: mouse },
        uSpeed:          { value: speed },
        uScale:          { value: scale },
        uBrightness:     { value: brightness },
        uColor1:         { value: hex2rgb(color1) },
        uColor2:         { value: hex2rgb(color2) },
        uNoiseFrequency: { value: noiseFrequency },
        uNoiseAmplitude: { value: noiseAmplitude },
        uBandHeight:     { value: bandHeight },
        uBandSpread:     { value: bandSpread },
        uOctaveDecay:    { value: octaveDecay },
        uLayerOffset:    { value: layerOffset },
        uColorSpeed:     { value: colorSpeed },
        uMouseInfluence: { value: mouseInfluence },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    // ── Render loop ──────────────────────────────────────────────────────────
    let rafId = 0;
    const update = (ts: number) => {
      rafId = requestAnimationFrame(update);
      const p = liveProps.current;
      const u = program!.uniforms;

      u.uTime.value           = ts * 0.001;
      u.uSpeed.value          = p.speed          ?? speed;
      u.uScale.value          = p.scale          ?? scale;
      u.uBrightness.value     = p.brightness     ?? brightness;
      u.uColor1.value         = hex2rgb(p.color1 ?? color1);
      u.uColor2.value         = hex2rgb(p.color2 ?? color2);
      u.uNoiseFrequency.value = p.noiseFrequency ?? noiseFrequency;
      u.uNoiseAmplitude.value = p.noiseAmplitude ?? noiseAmplitude;
      u.uBandHeight.value     = p.bandHeight     ?? bandHeight;
      u.uBandSpread.value     = p.bandSpread     ?? bandSpread;
      u.uOctaveDecay.value    = p.octaveDecay    ?? octaveDecay;
      u.uLayerOffset.value    = p.layerOffset    ?? layerOffset;
      u.uColorSpeed.value     = p.colorSpeed     ?? colorSpeed;
      u.uMouse.value          = mouse;
      u.uMouseInfluence.value = p.mouseInfluence ?? mouseInfluence;

      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);
    resize();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
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

export default SoftAurora;
