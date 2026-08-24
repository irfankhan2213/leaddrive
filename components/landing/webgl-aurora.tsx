'use client';

import { useEffect, useRef } from 'react';

/**
 * Zero-dependency WebGL aurora background.
 * Raw WebGL1 fragment shader — no three.js, so the landing page keeps its
 * <3s mobile load budget. Renders one static frame under
 * prefers-reduced-motion, pauses when off-screen or tab hidden, clamps DPR,
 * and falls back to the parent's CSS gradient if WebGL is unavailable.
 */
export function WebglAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    });
    if (!gl) return;

    const VERT = `
      attribute vec2 a_pos;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const FRAG = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = p * 2.03 + vec2(1.7, 4.1);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);
        float t = u_time * 0.05;

        // Domain-warped fbm flow
        vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t * 0.8));
        vec2 r = vec2(
          fbm(p * 2.1 + q * 1.4 + vec2(1.7, 9.2) + t * 0.9),
          fbm(p * 2.1 + q * 1.4 + vec2(8.3, 2.8) - t * 0.6)
        );
        float f = fbm(p * 2.0 + r * 1.8);

        // Deep navy base + indigo/cyan/violet aurora
        vec3 col = vec3(0.016, 0.024, 0.055);
        col = mix(col, vec3(0.22, 0.27, 0.93), smoothstep(0.28, 0.88, f) * 0.85);
        col = mix(col, vec3(0.05, 0.70, 0.83), smoothstep(0.48, 0.97, fbm(p * 1.2 - r + t * 0.5)) * 0.42);
        col = mix(col, vec3(0.55, 0.32, 0.94), smoothstep(0.52, 1.02, q.y) * 0.38);

        // Vignette + darker bottom half for headline contrast
        float vig = smoothstep(1.3, 0.3, length(p));
        col *= 0.5 + 0.62 * vig;
        col *= 1.0 - uv.y * uv.y * 0.42;

        // Film grain
        float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
        col += (g - 0.5) * 0.035;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let raf = 0;
    let running = true;
    let visible = true;
    let lastFrame = 0;

    function compile(type: number, src: string): WebGLShader | null {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('shader compile failed:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas!.clientWidth * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(uRes, w, h);
      }
    }

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      // ~30fps cap — plenty for a slow-moving aurora, halves GPU/battery.
      if (now - lastFrame < 33) return;
      lastFrame = now;
      resize();
      gl!.uniform1f(uTime, now / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();

    if (reduceMotion) {
      // Single static frame — still beautiful, zero ongoing cost.
      gl.uniform1f(uTime, 42);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      observer.observe(canvas);

      const onVisibility = () => {
        running = !document.hidden;
      };
      document.addEventListener('visibilitychange', onVisibility);

      const loop = (now: number) => {
        if (running && visible) draw(now);
        else raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        cancelAnimationFrame(raf);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
