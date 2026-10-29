"use client";

import React, { useState, useEffect, useRef } from "react";

// ─── Exact ASCII Plasma Implementation (Interference / Ocean / Classic) ─────
// Based on https://www.asciiart.eu/animations/ascii-plasma
// Settings:
//   Pattern:    Interference
//   Palette:    Ocean (["#000011", "#001133", "#002255", "#003377", "#0055aa", "#0077cc", "#0099ee", "#33bbff", "#66ddff", "#99eeff"])
//   Charset:    Classic (" .:-=+*#%@")
//   Speed:      0.35
//   Scale:      1.10
//   Complexity: 3
//   Distortion: 0.50
//   Contrast:   1.15

const CHARSET = " .:-=+*#%@";

const OCEAN_PALETTE = [
  "#000011",
  "#001133",
  "#002255",
  "#003377",
  "#0055aa",
  "#0077cc",
  "#0099ee",
  "#33bbff",
  "#66ddff",
  "#99eeff",
];

// 4096-entry precomputed sine lookup table for 1:1 mathematical fidelity & peak performance
const SINE_TABLE_SIZE = 4096;
const SINE_TABLE = new Float32Array(SINE_TABLE_SIZE);
for (let i = 0; i < SINE_TABLE_SIZE; i++) {
  SINE_TABLE[i] = Math.sin((i / SINE_TABLE_SIZE) * Math.PI * 2);
}

function S(theta: number): number {
  const norm = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const idx = Math.floor((norm / (2 * Math.PI)) * SINE_TABLE_SIZE);
  return SINE_TABLE[idx % SINE_TABLE_SIZE];
}

export interface AsciiPlasmaProps {
  className?: string;
  speed?: number;
  scale?: number;
  complexity?: number;
  distortion?: number;
  contrast?: number;
}

/**
 * Pure ASCII Plasma Interference animation.
 * Faithfully reproduces the user's exact settings from asciiart.eu:
 * Interference pattern, Ocean palette, Classic charset, Speed 0.35, Scale 1.10,
 * Complexity 3, Distortion 0.50, Contrast 1.15.
 * Zero text, zero badges, zero loading bars.
 */
export function AsciiPlasmaAnimation({
  className = "",
  speed = 0.35,
  scale = 1.1,
  complexity = 3,
  distortion = 0.5,
  contrast = 1.15,
}: AsciiPlasmaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const CELL_W = 9;
    const CELL_H = 15;

    let cols = 52;
    let rows = 32;

    const updateGridSize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || canvas.parentElement?.clientWidth || 400;
      const h = rect.height || canvas.parentElement?.clientHeight || 280;

      cols = Math.max(28, Math.min(74, Math.round(w / CELL_W)));
      rows = Math.max(16, Math.min(46, Math.round(h / CELL_H)));

      canvas.width = cols * CELL_W;
      canvas.height = rows * CELL_H;
    };

    updateGridSize();

    let animId: number;
    let isTabVisible = !document.hidden;
    let isModalOpen = false;

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    const handleModalToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen?: boolean }>;
      isModalOpen = Boolean(customEvent.detail?.isOpen);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("outergazers:modal-open", handleModalToggle);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateGridSize();
      });
      resizeObserver.observe(canvas);
    }

    let lastDraw = 0;
    let timeAccum = 0;
    const targetFpsInterval = 1000 / 30; // Smooth 30 FPS cap

    // Interference pattern formula from asciiart.eu
    const renderFrame = (timestamp: number) => {
      if (!isTabVisible || isModalOpen) {
        animId = requestAnimationFrame(renderFrame);
        return;
      }

      if (lastDraw === 0) lastDraw = timestamp;
      const elapsed = timestamp - lastDraw;

      if (elapsed >= targetFpsInterval) {
        let delta = elapsed / 1000;
        lastDraw = timestamp - (elapsed % targetFpsInterval);

        if (delta > 0.1) delta = 0.1;
        timeAccum += delta * speed;

        const a = timeAccum;
        const l = 0.5 * cols;
        const f = 0.5 * rows;

        // Wave centers moving through space with distortion
        const c_cx = l + S(0.3 * a) * cols * 0.3 * distortion;
        const M_cy = f + S(0.4 * a) * rows * 0.3 * distortion;
        const y_cx = l + S(0.5 * a + 2) * cols * 0.3 * distortion;
        const b_cy = f + S(0.6 * a + 2) * rows * 0.3 * distortion;

        let s_cx = 0;
        let c_cy = 0;
        if (complexity >= 2) {
          s_cx = l + S(0.7 * a + 4) * cols * 0.25 * distortion;
          c_cy = f + S(0.8 * a + 4) * rows * 0.25 * distortion;
        }

        const v = 3 + 0.6 * (complexity - 1);

        // Fill background with darkest Ocean abyss #000011
        ctx.fillStyle = OCEAN_PALETTE[0];
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 12px "Courier New", Courier, monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Group character render positions by color bucket (1..9)
        // This eliminates canvas context switching and gives near-instant GPU drawing
        const buckets: { char: string; px: number; py: number }[][] = [
          [], [], [], [], [], [], [], [], [], []
        ];

        for (let r = 0; r < rows; r++) {
          const py = (r + 0.5) * CELL_H;
          const dy_M = r - M_cy;
          const dy_b = r - b_cy;
          const dy_c = complexity >= 2 ? r - c_cy : 0;

          for (let col = 0; col < cols; col++) {
            const dx_c = col - c_cx;
            const dx_y = col - y_cx;

            const x_dist = Math.sqrt(dx_c * dx_c + dy_M * dy_M) * scale * 0.15;
            const k_dist = Math.sqrt(dx_y * dx_y + dy_b * dy_b) * scale * 0.15;

            let h = S(x_dist - 2 * a) + S(k_dist - 2 * a) + 0.5 * S(x_dist + k_dist - a);

            if (complexity >= 2) {
              const dx_s = col - s_cx;
              const dist3 = Math.sqrt(dx_s * dx_s + dy_c * dy_c) * scale * 0.15;
              h += 0.7 * S(dist3 - 1.5 * a);
            }

            if (complexity >= 3) {
              h += 0.4 * S(2 * x_dist + a);
            }

            let val = (h / v) * contrast;
            let norm = 0.5 * (val + 1);
            if (norm < 0) norm = 0;
            if (norm > 1) norm = 1;

            const paletteIndex = Math.min(9, Math.max(0, Math.floor(norm * 9 + 0.5)));

            // Space character (' ') on background doesn't need drawing
            if (paletteIndex > 0) {
              const char = CHARSET[paletteIndex];
              const px = (col + 0.5) * CELL_W;
              buckets[paletteIndex].push({ char, px, py });
            }
          }
        }

        // Draw batched characters by color (only 9 fillStyle changes per frame!)
        for (let p = 1; p < 10; p++) {
          const list = buckets[p];
          if (list.length === 0) continue;
          ctx.fillStyle = OCEAN_PALETTE[p];
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            ctx.fillText(item.char, item.px, item.py);
          }
        }
      }

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("outergazers:modal-open", handleModalToggle);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [speed, scale, complexity, distortion, contrast]);

  return (
    <div
      className={`relative inset-0 w-full h-full flex items-center justify-center bg-[#000011] select-none overflow-hidden ${className}`}
      aria-label="Loading animation"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

// ─── Reusable Backward-Compatible Aliases ──────────────────────────────────
export const AsciiPlasmaLoader = AsciiPlasmaAnimation;
export const AsciiMediaLoader = AsciiPlasmaAnimation;
export const DitherAnimation = AsciiPlasmaAnimation;

// ─── Reusable AsciiMedia Wrapper Component ──────────────────────────────────
// Automatically manages loading state, displays pure stylish ASCII Plasma
// animation until media is buffered, and gracefully crossfades to media.
export interface AsciiMediaProps {
  mediaType: "video" | "image";
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  objectFit?: "cover" | "contain";
  label?: string;
  subLabel?: string;
  priority?: boolean;
}

export function AsciiMedia({
  mediaType,
  src,
  alt = "Media",
  className = "",
  containerClassName = "",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  objectFit = "cover",
}: AsciiMediaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Check immediately if image or video is already cached/ready on mount
  useEffect(() => {
    if (!src) {
      setIsLoaded(true);
      setShowAnimation(false);
      return;
    }

    // Check if image is already cached in browser
    if (mediaType === "image" && imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
        setShowAnimation(false);
        return;
      }
    }

    // Check if video is already ready
    if (mediaType === "video" && videoRef.current) {
      if (videoRef.current.readyState >= 1) {
        setIsLoaded(true);
        setShowAnimation(false);
        return;
      }
    }

    // Safety timeout: NEVER get stuck in infinite loading!
    // Shows the gorgeous ASCII plasma burst, then automatically reveals the media cleanly.
    const safetyTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 750);

    return () => clearTimeout(safetyTimer);
  }, [mediaType, src]);

  const handleMediaReady = () => {
    setIsLoaded(true);
  };

  // Keep animation mounted during the 500ms fade-out, then unmount canvas to save 100% CPU
  useEffect(() => {
    if (isLoaded) {
      const fadeTimer = setTimeout(() => {
        setShowAnimation(false);
      }, 500);
      return () => clearTimeout(fadeTimer);
    } else {
      setShowAnimation(true);
    }
  }, [isLoaded]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#000011] ${containerClassName}`}>
      {/* Pure Stylish ASCII Plasma Loading Placeholder */}
      {showAnimation && (
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        >
          <AsciiPlasmaAnimation />
        </div>
      )}

      {mediaType === "video" ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload="auto"
          onLoadedData={handleMediaReady}
          onCanPlay={handleMediaReady}
          onCanPlayThrough={handleMediaReady}
          onLoadedMetadata={handleMediaReady}
          onPlaying={handleMediaReady}
          onError={handleMediaReady}
          className={`w-full h-full object-${objectFit} transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleMediaReady}
          onError={handleMediaReady}
          className={`w-full h-full object-${objectFit} transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}

export default AsciiPlasmaAnimation;
