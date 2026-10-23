"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export interface CursorDrivenParticleTypographyProps {
  /** Additional CSS classes */
  className?: string;
  /** The text to render */
  text: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Size of each particle */
  particleSize?: number;
  /** Density of particles (lower number = more particles, minimum 1) */
  particleDensity?: number;
  /** How strongly the cursor pushes particles away */
  dispersionStrength?: number;
  /** Speed at which particles return to origin */
  returnSpeed?: number;
  /** Custom color for particles. Overrides inherited text color if set. */
  color?: string;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  dispersion: number;
  returnSpd: number;

  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    dispersion: number,
    returnSpd: number
  ) {
    this.x = x + (Math.random() - 0.5) * 12; // Start with slight initial jitter
    this.y = y + (Math.random() - 0.5) * 12;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Physics interaction radius
    const interactionRadius = 180;

    if (distance < interactionRadius && mouseX !== -1000 && mouseY !== -1000 && distance > 0.1) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;

      const force = (interactionRadius - distance) / interactionRadius;

      // Calculate repulsion
      const repulsionX = forceDirectionX * force * this.dispersion;
      const repulsionY = forceDirectionY * force * this.dispersion;

      this.vx -= repulsionX;
      this.vy -= repulsionY;
    }

    // Return to origin (spring physics)
    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;

    // Friction / damping
    this.vx *= 0.86;
    this.vy *= 0.86;

    // Subtle micro-settle jitter when resting close to home
    const distToOrigin = Math.sqrt(
      Math.pow(this.x - this.originX, 2) + Math.pow(this.y - this.originY, 2)
    );
    if (distToOrigin < 1 && Math.random() > 0.96) {
      this.vx += (Math.random() - 0.5) * 0.2;
      this.vy += (Math.random() - 0.5) * 0.2;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export interface CursorDrivenParticleTypographyProps {
  /** Additional CSS classes */
  className?: string;
  /** The text to render */
  text: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Size of each particle */
  particleSize?: number;
  /** Density of particles (lower number = more particles, minimum 1) */
  particleDensity?: number;
  /** How strongly the cursor pushes particles away */
  dispersionStrength?: number;
  /** Speed at which particles return to origin */
  returnSpeed?: number;
  /** Custom color for main text particles. Overrides inherited text color if set. */
  color?: string;
  /** Custom color for Gazer segment (defaults to #00B4D8) */
  gazerColor?: string;
}

export function CursorDrivenParticleTypography({
  className,
  text,
  fontSize = 240,
  fontFamily = "Orbitron, Anta, 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
  particleSize = 2.2,
  particleDensity = 5.5,
  dispersionStrength = 26,
  returnSpeed = 0.08,
  color = "#ffffff",
  gazerColor = "#00B4D8",
}: CursorDrivenParticleTypographyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    let mouseX = -1000;
    let mouseY = -1000;

    let containerWidth = 0;
    let containerHeight = 0;

    const init = () => {
      const container = containerRef.current;
      if (!container) return;

      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Measure reference width at 100px font size
      ctx.font = `900 100px ${fontFamily}`;
      const referenceWidth = ctx.measureText(text).width || 850;

      // Target filling ~94% of the container width to maximize grand scale
      const targetWidth = containerWidth * 0.94;
      let calculatedFontSize = (targetWidth / referenceWidth) * 100;

      // Allow vertical scaling up to containerHeight * 1.15 (Orbitron cap-height is ~0.7 of font size)
      const maxAllowedByHeight = containerHeight * 1.15;
      if (calculatedFontSize > maxAllowedByHeight) {
        calculatedFontSize = maxAllowedByHeight;
      }

      const effectiveFontSize = Math.max(36, Math.floor(calculatedFontSize));

      ctx.font = `900 ${effectiveFontSize}px ${fontFamily}`;
      ctx.textBaseline = "middle";

      const upper = text.toUpperCase();
      const hasOuterGazers = upper.startsWith("OUTER") && (upper.includes("GAZER") || upper.includes("GAZERS"));

      // Draw text to sample pixels with distinct colors for OUTER and GAZER
      if (hasOuterGazers) {
        const outerText = "OUTER";
        const gazerText = text.slice(5); // "GAZERS" or "GAZER"

        const outerWidth = ctx.measureText(outerText).width;
        const gazerWidth = ctx.measureText(gazerText).width;
        const totalW = outerWidth + gazerWidth;
        const startX = (containerWidth - totalW) / 2;
        const centerY = containerHeight / 2;

        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.fillText(outerText, startX, centerY);

        ctx.fillStyle = gazerColor;
        ctx.fillText(gazerText, startX + outerWidth, centerY);
      } else {
        ctx.textAlign = "center";
        ctx.fillStyle = color;
        ctx.fillText(text, containerWidth / 2, containerHeight / 2);
      }

      // Get pixel data
      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, containerWidth, containerHeight);
      particles = [];

      // Create particles from text pixels
      const step = Math.max(1, Math.floor(particleDensity * dpr));
      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3] || 0;

          if (alpha > 120) {
            const r = textCoordinates.data[index];
            const g = textCoordinates.data[index + 1];
            const b = textCoordinates.data[index + 2];

            // If pixel is cyan-tinted (Gazer), color particle #00B4D8; else white
            const isCyan = (r < 120 && g > 110 && b > 140);
            const particleClr = isCyan ? gazerColor : color;

            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                particleClr,
                dispersionStrength,
                returnSpeed
              )
            );
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouseX, mouseY);
        particles[i].draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left - 160 &&
        e.clientX <= rect.right + 160 &&
        e.clientY >= rect.top - 160 &&
        e.clientY <= rect.bottom + 160
      ) {
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      } else {
        mouseX = -1000;
        mouseY = -1000;
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvas || !e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    };

    const handleTouchEnd = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      init();
    };

    // Initialize after layout and fonts are ready
    const timeoutId = setTimeout(() => {
      init();
      animate();
    }, 60);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        init();
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const themeObserver = new MutationObserver(() => {
      init();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchMove, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, fontSize, fontFamily, particleSize, particleDensity, dispersionStrength, returnSpeed, color, gazerColor]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full min-h-[300px] flex items-center justify-center relative touch-none select-none", className)}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
