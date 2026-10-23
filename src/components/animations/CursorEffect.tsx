"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export interface CursorEffectProps {
  onMouseMove?: (x: number, y: number) => void;
}

export default function CursorEffect({ onMouseMove }: CursorEffectProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // High-response spring for smooth yet zero-latency cursor tracking
  const springConfig = { stiffness: 2200, damping: 100, mass: 0.04 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  // Subtle trailing accent dot
  const trailConfig = { stiffness: 600, damping: 45, mass: 0.1 };
  const trailX = useSpring(-100, trailConfig);
  const trailY = useSpring(-100, trailConfig);

  const isMouseDown = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDevice = () => {
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      const isMobile = window.innerWidth < 1024;
      const isMobileUserAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      setIsVisible(!(isTouch || isMobile || isMobileUserAgent));
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);

      onMouseMove?.(e.clientX, e.clientY);

      const target = e.target as HTMLElement | null;
      if (target) {
        const hoverable = target.closest(
          "a, button, [role='button'], input, textarea, select, .cursor-pointer"
        );
        setIsHovered(!!hoverable);
      }
    },
    [cursorX, cursorY, trailX, trailY, onMouseMove]
  );

  const handleMouseDown = useCallback(() => {
    isMouseDown.current = true;
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    isMouseDown.current = false;
    setIsPressed(false);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      document.body.style.cursor = "auto";
      return;
    }

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVisible, handleMouseMove, handleMouseDown, handleMouseUp]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Trailing cyan ambient pulse ring */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[999998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isHovered ? 1.8 : isPressed ? 0.7 : 1,
            opacity: isHovered ? 0.6 : 0.25,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="w-7 h-7 rounded-full border border-[#00B4D8] bg-[#00B4D8]/10 blur-[1px]"
        />
      </motion.div>

      {/* Primary White Cursor with Cyan Outline */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[999999]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          animate={{
            scale: isPressed ? 0.88 : isHovered ? 1.18 : 1,
          }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          style={{
            transformOrigin: "3px 3px",
            transform: "translate(-3px, -3px)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: "drop-shadow(0 0 5px rgba(0, 180, 216, 0.7))",
            }}
          >
            <path
              d="M3 3L10.5 22.5L14.2 14.2L22.5 10.5L3 3Z"
              fill="#FFFFFF"
              stroke="#00B4D8"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </>
  );
}
