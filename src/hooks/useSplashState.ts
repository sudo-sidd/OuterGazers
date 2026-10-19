"use client";

import { useState, useEffect } from "react";

// Global module state
let isSplashFinished = false;

export function useSplashState() {
  const [finished, setFinished] = useState(isSplashFinished);

  useEffect(() => {
    if (isSplashFinished) {
      setFinished(true);
      return;
    }

    const handleSplashFinished = () => {
      isSplashFinished = true;
      setFinished(true);
    };

    window.addEventListener("splashFinished", handleSplashFinished);
    return () => window.removeEventListener("splashFinished", handleSplashFinished);
  }, []);

  return finished;
}

export function finishSplash() {
  isSplashFinished = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("splashFinished"));
  }
}
