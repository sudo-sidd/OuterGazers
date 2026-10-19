"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt?: string;
  className?: string;
  speed?: number; // Adjusts how extreme the parallax effect is
  overlay?: boolean; // Adds a subtle dark overlay for text readability
}

export default function ParallaxImage({
  src,
  alt = "Parallax Asset",
  className = "h-96 w-full",
  speed = 15, // Default movement percentage
  overlay = false,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll position of this specific container when it enters the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform the scroll progress (0 to 1) into a Y-axis pixel/percentage shift
  // E.g., moves the image from -15% to +15% as you scroll past
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* 
        The image container must be taller than the parent div to prevent 
        the image from tearing or showing blank space at the edges during the shift.
      */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full"
        // Make the height 100% + (speed * 2)% to account for the shift up and down
        // If speed is 15%, height needs to be 130% and offset by -15% at the top
      >
        <div
          className="absolute w-full h-[130%] -top-[15%] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
          style={{ backgroundImage: `url(${src})` }}
          aria-label={alt}
        />
      </motion.div>

      {/* Optional cinematic darkening overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
      )}
    </div>
  );
}