"use client";

import { ReactNode, useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkTouch = () => {
      const touch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
        window.innerWidth < 768;
      setIsTouchDevice(touch);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // On mobile/touch devices, bypass Lenis JS scroll interception entirely.
  // This restores native 120Hz hardware momentum scrolling on iOS and Android with zero lag.
  if (mounted && isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.08, 
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}