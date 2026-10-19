"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useAnimation } from "framer-motion";
import Link from "next/link";

export default function EyeFollowButton({ href, text }: { href: string; text: string }) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  
  // Smooth tracking for pupils
  const springConfig = { stiffness: 150, damping: 20 };
  const leftX = useSpring(0, springConfig);
  const leftY = useSpring(0, springConfig);
  const rightX = useSpring(0, springConfig);
  const rightY = useSpring(0, springConfig);

  // Blinking controls
  const blinkControls = useAnimation();

  useEffect(() => {
    // 1. Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const maxDistance = 7;
      
      const calculatePupil = (offsetX: number) => {
        const dx = mouseX - offsetX;
        const dy = mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const clamped = Math.min(distance, maxDistance);
        const angle = Math.atan2(dy, dx);
        return {
          x: Math.cos(angle) * clamped,
          y: Math.sin(angle) * clamped
        };
      };

      const left = calculatePupil(-10);
      const right = calculatePupil(10);
      
      leftX.set(left.x);
      leftY.set(left.y);
      rightX.set(right.x);
      rightY.set(right.y);
    };
    
    window.addEventListener("mousemove", handleMouseMove);

    // 2. Random Blinking
    const blinkInterval = setInterval(() => {
      blinkControls.start({
        scaleY: [1, 0.1, 1],
        transition: { duration: 0.15, ease: "easeInOut" }
      });
    }, 3000 + Math.random() * 2000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, [leftX, leftY, rightX, rightY, blinkControls]);

  return (
    <Link 
      href={href}
      ref={containerRef}
      className="group relative inline-flex items-center justify-between gap-6 px-6 py-3 bg-[#0a0a0a] border border-zinc-700 hover:border-[#00b4d8] overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,180,216,0.25)]"
    >
      <span className="font-[family-name:var(--font-tech)] font-bold text-white text-xs uppercase tracking-[0.2em] pl-2">
        {text}
      </span>
      
      {/* Eyes Container */}
      <div className="flex gap-1">
        {/* Left Eye */}
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <motion.div 
            animate={blinkControls}
            className="w-full h-full flex items-center justify-center origin-center"
          >
            <motion.div 
              className="w-4 h-4 bg-black rounded-full"
              style={{ x: leftX, y: leftY }}
            />
          </motion.div>
        </div>
        
        {/* Right Eye */}
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <motion.div 
            animate={blinkControls}
            className="w-full h-full flex items-center justify-center origin-center"
          >
            <motion.div 
              className="w-4 h-4 bg-black rounded-full"
              style={{ x: rightX, y: rightY }}
            />
          </motion.div>
        </div>
      </div>
    </Link>
  );
}
