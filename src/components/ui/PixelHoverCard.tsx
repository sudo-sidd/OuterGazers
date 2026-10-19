"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface PixelHoverCardProps {
  name: string;
  role: string;
  domain?: string;
  imageUrl?: string | null;
  className?: string;
}

/**
 * PixelHoverCard — Grayscale-to-color profile card with pixel-dissolve hover.
 *
 * PERF FIX: Replaced 120 `backdrop-grayscale` divs per card with a dual-layer
 * approach. Color image at z-0, grayscale copy at z-10 with CSS `filter:
 * grayscale(1)`. A grid of simple opacity-transitioning divs at z-15 sits
 * between the grayscale layer and the text. On hover, the grayscale layer
 * opacity transitions to 0 with a CSS transition, while the grid tiles add
 * staggered "pixel noise" to the reveal by briefly flashing. This creates a
 * similar pixel-dissolve aesthetic without any backdrop-filter, reducing GPU
 * compositing layers from 120 to 2 per card.
 */
export default function PixelHoverCard({
  name,
  role,
  domain,
  imageUrl,
  className = "",
}: PixelHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const columns = 8;
  const rows = 10;
  const totalTiles = columns * rows;

  // Stable randomized delays for staggered reveal
  const tileDelays = useMemo(
    () => Array.from({ length: totalTiles }, () => Math.random() * 0.4),
    [totalTiles]
  );

  return (
    <div
      className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Layer 0: Full-color image — always present beneath */}
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            loading="eager"
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 uppercase tracking-widest text-xs font-bold p-6 text-center">
            Awaiting Visual Asset
          </div>
        )}
      </div>

      {/* Layer 1: Grayscale image overlay — single element, CSS filter.
          On hover, opacity transitions to 0, revealing color beneath. */}
      <div
        className="absolute inset-0 z-[11] pointer-events-none grayscale will-change-[opacity]"
        style={{
          opacity: isHovered ? 0 : 1,
          transition: "opacity 0.45s ease-out",
          transitionDelay: isHovered ? "0.15s" : "0s",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            loading="eager"
            aria-hidden
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Layer 2: Pixel dissolve grid — lightweight opacity-only tiles.
          No backdrop-filter. These create brief bright "pixel pop" flashes
          as they transition, giving the reveal a digital/pixelated character.
          Each tile transitions from a slight tint to transparent at staggered
          intervals. */}
      <div
        className="absolute inset-0 z-[12] pointer-events-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {tileDelays.map((delay, i) => (
          <div
            key={i}
            className=""
            style={{
              backgroundColor: isHovered
                ? "rgba(0, 180, 216, 0.15)"
                : "transparent",
              opacity: isHovered ? 0 : 1,
              transition: "opacity 0.2s ease-out, background-color 0.1s ease-out",
              transitionDelay: isHovered ? `${delay}s` : "0s",
            }}
          />
        ))}
      </div>

      {/* Layer 3: Text overlay + gradient */}
      <div
        className="absolute inset-0 z-30 flex flex-col justify-end p-6 transition-all duration-500"
        style={{
          background: isHovered
            ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
        }}
      >
        {/* Glow border on hover */}
        <div
          className={`absolute inset-0 border-2 rounded-xl transition-all duration-500 pointer-events-none ${
            isHovered ? "border-[#00b4d8]/50 shadow-[inset_0_0_20px_rgba(0,180,216,0.2)]" : "border-white/10"
          }`}
        />

        <motion.div
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10"
        >
          {domain && (
            <span
              className={`block font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 transition-colors duration-500 ${
                isHovered ? "text-[#00b4d8]" : "text-zinc-400"
              }`}
            >
              {domain}
            </span>
          )}
          <h3
            className={`font-[family-name:var(--font-tech)] text-3xl md:text-4xl font-extrabold uppercase tracking-tighter leading-none mb-1 transition-colors duration-500 ${
              isHovered ? "text-white" : "text-zinc-200"
            }`}
          >
            {name}
          </h3>
          <p
            className={`font-bold text-xs uppercase tracking-widest transition-colors duration-500 ${
              isHovered ? "text-zinc-300" : "text-zinc-500"
            }`}
          >
            {role}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
