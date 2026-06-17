import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
}

const fragmentShader = `
uniform float uTime;
uniform float uSpeed;
uniform float uHueShift;
uniform float uNoiseIntensity;
uniform float uScanlineIntensity;
uniform float uScanlineFrequency;
uniform float uWarpAmount;
uniform vec2 uResolution;
varying vec2 vUv;

// Helper to convert HSL to RGB
vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  vec2 uv = vUv;
  float t = uTime * uSpeed;
  
  // Domain warping
  vec2 warp = vec2(
    sin(uv.y * 3.5 + t) * uWarpAmount * 0.12,
    cos(uv.x * 3.5 + t) * uWarpAmount * 0.12
  );
  vec2 p = uv + warp;
  
  // Veil wave patterns
  float wave1 = sin(p.x * 2.8 + t * 0.4) * cos(p.y * 2.4 + t * 0.25);
  float wave2 = cos(p.x * 4.2 - t * 0.3) * sin(p.y * 3.6 + t * 0.45);
  float waveIntensity = clamp((wave1 + wave2) * 0.5 + 0.5, 0.0, 1.0);
  
  // Deep dark space background base
  vec3 baseColor = vec3(0.03, 0.02, 0.05);
  
  // HSL shift (default: purple hues mod 0.74)
  float baseHue = mod(0.74 + uHueShift / 360.0 + waveIntensity * 0.15, 1.0);
  vec3 veilColor = hsl2rgb(vec3(baseHue, 0.65, 0.15 + waveIntensity * 0.1));
  
  // Blend colors
  vec3 finalColor = mix(baseColor, veilColor, waveIntensity * 0.7);
  
  // Scanlines
  if (uScanlineIntensity > 0.001) {
    float freq = (uScanlineFrequency > 0.001) ? uScanlineFrequency : 2.5;
    float scanline = sin(vUv.y * uResolution.y * freq * 0.2) * 0.5 + 0.5;
    finalColor = mix(finalColor, finalColor * scanline, uScanlineIntensity * 0.3);
  }
  
  // Grain Noise
  if (uNoiseIntensity > 0.001) {
    float noise = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    finalColor += (noise - 0.5) * uNoiseIntensity * 0.06;
    finalColor = clamp(finalColor, 0.0, 1.0);
  }
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const DarkVeil: React.FC<DarkVeilProps> = ({
  hueShift = 0,
  noiseIntensity = 0.05,
  scanlineIntensity = 0.1,
  speed = 0.5,
  scanlineFrequency = 2.0,
  warpAmount = 0.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uHueShift: { value: hueShift },
      uNoiseIntensity: { value: noiseIntensity },
      uScanlineIntensity: { value: scanlineIntensity },
      uScanlineFrequency: { value: scanlineFrequency },
      uWarpAmount: { value: warpAmount },
      uResolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
};

export default DarkVeil;
