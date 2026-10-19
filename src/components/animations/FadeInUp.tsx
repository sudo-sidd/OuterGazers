"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  once?: boolean;
}

export default function FadeInUp({
  children,
  delay = 0,
  duration = 0.8,
  yOffset = 50,
  className = "",
  once = true,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration: duration,
        delay: delay,
        // Custom cinematic easing curve: fast entry, slow heavily weighted settle
        ease: [0.16, 1, 0.3, 1], 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}