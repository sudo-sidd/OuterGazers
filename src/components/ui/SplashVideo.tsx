"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { finishSplash } from "@/hooks/useSplashState";

export default function SplashVideo() {
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    // Disabled per request
    setShowSplash(false); 
    finishSplash();
  }, []);

  useEffect(() => {
    if (showSplash && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(console.error);
    }
  }, [showSplash]);

  const handleFinish = () => {
    setShowSplash(false);
    finishSplash();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-[9999999] bg-[#0a0a0a] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <video
            ref={videoRef}
            src="/videos/openingVid.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleFinish}
            onError={handleFinish}
            className="w-full h-full object-contain"
          />
          <button
            onClick={handleFinish}
            className="absolute bottom-10 right-10 z-10 px-6 py-2 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white transition-colors uppercase tracking-widest text-xs font-bold"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
