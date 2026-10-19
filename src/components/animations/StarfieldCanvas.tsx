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
    const STAR_COUNT = 280;
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

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.25)";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      
      const mousePos = mousePosRef.current;
      // Shift origin towards mouse for parallax effect
      const originX = W / 2 + (mousePos ? (mousePos.x - W / 2) * 0.1 : 0);
      const originY = H / 2 + (mousePos ? (mousePos.y - H / 2) * 0.1 : 0);
      
      ctx.translate(originX, originY);

      for (const star of stars) {
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
        let px = (star.x / star.pz) * W;
        let py = (star.y / star.pz) * H;
        
        // Repel effect based on mouse position
        if (mousePos) {
           const dx = sx - (mousePos.x - originX);
           const dy = sy - (mousePos.y - originY);
           const dist = Math.sqrt(dx * dx + dy * dy);
           const repelRadius = 250;
           
           if (dist < repelRadius) {
              const force = (repelRadius - dist) / repelRadius;
              // Push star away from mouse
              star.x += (dx / dist) * force * 5;
              star.y += (dy / dist) * force * 5;
           }
        }

        const size = Math.max(0.1, (1 - star.z / W) * 2.5);
        const alpha = 1 - star.z / W;

        const colorMix = Math.min(1, (1 - star.z / W) * 3);
        const r = Math.round(255 * (1 - colorMix * 0.4));
        const g = Math.round(255 * (1 - colorMix * 0.1));
        const b = 255;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.85})`;
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
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.7 }}
      />
    </div>
  );
}
