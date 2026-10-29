"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const isMobile =
      window.innerWidth < 768 ||
      ("ontouchstart" in window) ||
      (navigator.maxTouchPoints > 0) ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

    // 45 stars on mobile vs 200 on desktop ensures 0% CPU overhead
    const STAR_COUNT = isMobile ? 45 : 200;
    const stars: Star[] = [];
    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * W - W / 2,
          y: Math.random() * H - H / 2,
          z: Math.random() * W,
          pz: 0,
        });
      }
    };

    let isTabVisible = true;
    let isModalOpen = false;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleModalToggle = (e: Event) => {
      const customEvt = e as CustomEvent<{ open: boolean }>;
      isModalOpen = !!customEvt.detail?.open || document.body.classList.contains("modal-open");
    };
    window.addEventListener("outergazers:modal-open", handleModalToggle);

    const draw = () => {
      // Pause completely if tab is not visible or modal is open
      if (!isTabVisible || isModalOpen || document.body.classList.contains("modal-open")) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.save();

      const mousePos = mousePosRef.current;
      const originX = W / 2 + (mousePos ? (mousePos.x - W / 2) * 0.1 : 0);
      const originY = H / 2 + (mousePos ? (mousePos.y - H / 2) * 0.1 : 0);

      ctx.translate(originX, originY);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.pz = star.z;
        star.z -= 1.8;

        if (star.z <= 0) {
          star.x = Math.random() * W - W / 2;
          star.y = Math.random() * H - H / 2;
          star.z = W;
          star.pz = star.z;
        }

        const sx = (star.x / star.z) * W;
        const sy = (star.y / star.z) * H;
        const px = (star.x / star.pz) * W;
        const py = (star.y / star.pz) * H;

        // Repel effect based on mouse position (desktop only)
        if (mousePos && !isMobile) {
          const dx = sx - (mousePos.x - originX);
          const dy = sy - (mousePos.y - originY);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 130;

          if (dist < repelRadius) {
            const force = (repelRadius - dist) / repelRadius;
            star.x += (dx / dist) * force * 5;
            star.y += (dy / dist) * force * 5;
          }
        }

        const size = Math.max(0.1, (1 - star.z / W) * 2.2);
        const alpha = 1 - star.z / W;

        const colorMix = Math.min(1, (1 - star.z / W) * 3);
        const r = Math.round(255 * (1 - colorMix * 0.4));
        const g = Math.round(255 * (1 - colorMix * 0.1));
        const b = 255;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`;
        ctx.lineWidth = size;
        ctx.stroke();
      }

      ctx.restore();
      animationId = requestAnimationFrame(draw);
    };

    resize();
    initStars();
    draw();

    const handleResize = () => {
      resize();
      initStars();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("outergazers:modal-open", handleModalToggle);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8 }}
      />
    </div>
  );
}
