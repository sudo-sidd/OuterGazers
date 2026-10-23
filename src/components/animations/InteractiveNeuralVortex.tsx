"use client";

import React, { useEffect, useRef } from "react";

export interface InteractiveNeuralVortexProps {
  /**
   * Number of visual layers rendered in the vortex (1, 2, or 3).
   * Default is 3 for full cosmic depth.
   */
  layers?: 1 | 2 | 3;
  /**
   * Subtle master opacity multiplier for the canvas (0.0 to 1.0).
   * Default is 0.55 to keep it atmospheric and not too loud.
   */
  opacity?: number;
  /**
   * Overall animation speed multiplier.
   * Default is 1.0.
   */
  speed?: number;
  /**
   * Optional custom CSS class name for the wrapper.
   */
  className?: string;
}

export default function InteractiveNeuralVortex({
  layers = 3,
  opacity = 0.55,
  speed = 1.0,
  className = "",
}: InteractiveNeuralVortexProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    tX: 0,
    tY: 0,
    hasInteracted: false,
  });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize pointer to center of viewport
    const initialCenterX = window.innerWidth * 0.5;
    const initialCenterY = window.innerHeight * 0.5;
    pointerRef.current = {
      x: initialCenterX,
      y: initialCenterY,
      tX: initialCenterX,
      tY: initialCenterY,
      hasInteracted: false,
    };

    // Initialize WebGL context
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("WebGL not supported for Neural Vortex");
      return;
    }

    // Vertex shader
    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Multi-layer Fragment shader tailored to OuterGazers cosmic cyber aesthetic
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;
      uniform float u_active_layers;
      uniform float u_intensity;

      // 2D Rotation matrix
      vec2 rotate(vec2 uv, float th) {
        float c = cos(th);
        float s = sin(th);
        return mat2(c, s, -s, c) * uv;
      }

      // Harmonic fractal neural synthesis layer
      float neuro_layer(vec2 uv, float t, float p, float baseScale, float angle) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = baseScale;

        // 9 iterations yields intricate cosmic filament networks with 60fps performance
        for (int j = 0; j < 9; j++) {
          uv = rotate(uv, angle);
          sine_acc = rotate(sine_acc, angle);
          vec2 layer = uv * scale + float(j) * 1.18 + sine_acc - t;
          sine_acc += sin(layer) + 2.2 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.22;
        }
        return res.x + res.y;
      }

      void main() {
        // Center coordinates and aspect ratio correction
        vec2 uv = (vUv - 0.5);
        uv.x *= u_ratio;

        // Pointer distance and force
        vec2 pointer = (vUv - u_pointer_position);
        pointer.x *= u_ratio;
        float pDist = clamp(length(pointer), 0.0, 1.0);
        float pForce = 0.5 * pow(1.0 - pDist, 2.0);

        // Slow cinematic time
        float t = 0.0009 * u_time;

        // Vignette falloff to prevent harsh screen borders and maintain subtlety
        float vignette = 1.0 - smoothstep(0.35, 0.95, length(vUv - 0.5));

        // ── LAYER 1: Deep Nebula Abyss (Cosmic Void & Deep Violet #2e1065 / #1e1b4b) ──
        vec2 uv1 = uv * 0.72;
        float shape1 = neuro_layer(uv1, t * 0.35, pForce * 0.35, 4.2, 0.82);
        float n1 = smoothstep(0.18, 0.85, shape1);
        n1 = 0.85 * pow(n1, 2.2);

        vec3 colVoid = vec3(0.05, 0.02, 0.15); // Deep midnight abyss
        vec3 colIndigo = vec3(0.15, 0.04, 0.32); // Luminous cosmic violet
        vec3 col1 = mix(colVoid, colIndigo, 0.5 + 0.5 * sin(t * 0.3 + u_scroll_progress * 1.5));
        vec4 layer1 = vec4(col1 * n1, n1 * 0.38);

        // ── LAYER 2: Primary Neural Matrix (OuterGazers Electric Cyan #00b4d8 to Azure #0077b6) ──
        vec2 uv2 = uv * 1.0;
        float shape2 = neuro_layer(uv2, t * 0.65, pForce * 0.95, 7.5, 1.0);
        float n2 = max(0.0, shape2 - 0.22);
        n2 = 1.05 * pow(n2, 2.6);
        n2 += 0.22 * pow(n2, 5.0); // Gentle synaptic glow, not blinding

        vec3 cyan = vec3(0.0, 0.706, 0.847); // #00b4d8 - OuterGazers Studio Cyan
        vec3 oceanBlue = vec3(0.0, 0.467, 0.714); // #0077b6 - Deep Accent Blue
        float scrollCyanShift = 0.45 + 0.35 * sin(2.0 * u_scroll_progress + 1.2);
        vec3 col2 = mix(oceanBlue, cyan, scrollCyanShift);
        vec4 layer2 = vec4(col2 * n2, n2 * 0.48);

        // ── LAYER 3: Ethereal Filament Veil (Cyber Purple #7c3aed & Aqua Teal #06b6d4) ──
        vec2 uv3 = uv * 1.35;
        float shape3 = neuro_layer(uv3, t * 0.52 + 1.4, pForce * 0.55, 11.2, 1.18);
        float n3 = max(0.0, shape3 - 0.30);
        n3 = 0.95 * pow(n3, 3.0);
        n3 += 0.20 * pow(n3, 6.0);

        vec3 cyberPurple = vec3(0.486, 0.227, 0.929); // #7c3aed - Neon Violet
        vec3 aquaTeal = vec3(0.024, 0.714, 0.831); // #06b6d4 - Aqua Accent
        float scrollPurpleShift = 0.5 + 0.5 * cos(1.8 * u_scroll_progress + t * 0.3);
        vec3 col3 = mix(cyberPurple, aquaTeal, scrollPurpleShift);
        vec4 layer3 = vec4(col3 * n3, n3 * 0.32);

        // ── Multi-Layer Composition (Max 3 layers, blended smoothly) ──
        vec3 finalColor = vec3(0.0);
        float finalAlpha = 0.0;

        // Layer 1 is foundational
        finalColor += layer1.rgb * 0.45;
        finalAlpha += layer1.a * 0.40;

        // Layer 2 addition (if u_active_layers >= 2.0)
        if (u_active_layers > 1.5) {
          finalColor += layer2.rgb * 0.55;
          finalAlpha += layer2.a * 0.48;
        }

        // Layer 3 addition (if u_active_layers >= 2.5)
        if (u_active_layers > 2.5) {
          finalColor += layer3.rgb * 0.40;
          finalAlpha += layer3.a * 0.35;
        }

        // Edge vignette integration
        finalColor *= vignette;
        finalAlpha *= vignette;

        // Subtlety calibration to keep ambient background serene and text readable
        finalAlpha = clamp(finalAlpha * u_intensity, 0.0, 0.60);
        finalColor = finalColor * u_intensity;

        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `;

    // Shader compilation utility
    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Neural Vortex Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
      return;
    }

    // Program linking
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Neural Vortex Program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad buffer
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime = gl.getUniformLocation(program, "u_time");
    const uRatio = gl.getUniformLocation(program, "u_ratio");
    const uPointerPosition = gl.getUniformLocation(program, "u_pointer_position");
    const uScrollProgress = gl.getUniformLocation(program, "u_scroll_progress");
    const uActiveLayers = gl.getUniformLocation(program, "u_active_layers");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");

    // Static uniform values
    gl.uniform1f(uActiveLayers, Math.min(3, Math.max(1, layers)));
    gl.uniform1f(uIntensity, 1.0);

    // Resize handler with devicePixelRatio clamp to preserve high framerates
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uRatio, width / Math.max(height, 1));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pointer events
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      pointerRef.current.tX = e.clientX;
      pointerRef.current.tY = e.clientY;
      pointerRef.current.hasInteracted = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        pointerRef.current.tX = e.touches[0].clientX;
        pointerRef.current.tY = e.touches[0].clientY;
        pointerRef.current.hasInteracted = true;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Render loop
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      const currentTime = performance.now() * speed;

      // Gentle ambient drift if user has not yet interacted with pointer
      if (!pointerRef.current.hasInteracted) {
        const cx = window.innerWidth * 0.5;
        const cy = window.innerHeight * 0.5;
        const driftX = Math.sin(currentTime * 0.0006) * (window.innerWidth * 0.12);
        const driftY = Math.cos(currentTime * 0.0008) * (window.innerHeight * 0.08);
        pointerRef.current.tX = cx + driftX;
        pointerRef.current.tY = cy + driftY;
      }

      // Smooth pointer lerp
      pointerRef.current.x += (pointerRef.current.tX - pointerRef.current.x) * 0.08;
      pointerRef.current.y += (pointerRef.current.tY - pointerRef.current.y) * 0.08;

      gl.uniform1f(uTime, currentTime);
      gl.uniform2f(
        uPointerPosition,
        pointerRef.current.x / Math.max(window.innerWidth, 1),
        1.0 - pointerRef.current.y / Math.max(window.innerHeight, 1)
      );

      // Smooth scroll progress tracking
      const scrollPos = window.scrollY || window.pageYOffset || 0;
      gl.uniform1f(uScrollProgress, scrollPos * 0.0008);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Cleanup resources
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      gl.deleteBuffer(vertexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [layers, speed]);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        id="neural-vortex-canvas"
        className="absolute inset-0 w-full h-full"
        style={{
          opacity,
          transition: "opacity 0.6s ease-in-out",
        }}
      />
    </div>
  );
}
