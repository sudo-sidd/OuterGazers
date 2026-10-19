"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ArtworkItem {
  imageUrl: string;
  title?: string;
  tag?: string;
  aspectRatio?: number;
}

interface ArcCarouselProps {
  items: ArtworkItem[];
  className?: string;
}

export default function ArcCarousel({ items, className = "" }: ArcCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));

  // Handle navigation
  const next = () => setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
  const prev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className={`relative w-full h-[600px] flex flex-col items-center justify-center overflow-hidden ${className}`}>
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] bg-[#00b4d8]/5 z-0 pointer-events-none" />

      {/* Carousel Container */}
      <div className="relative w-full h-[400px] flex items-center justify-center z-10">
        {items.map((item, index) => {
          const offset = index - activeIndex;
          
          // Calculate properties based on offset from center
          const isCenter = offset === 0;
          const rotate = offset * 15; // 15 degrees per step
          const x = offset * 160; // 160px spread per step
          const y = Math.abs(offset) * 40; // Arc curve downwards
          const scale = isCenter ? 1 : Math.max(0.6, 1 - Math.abs(offset) * 0.15);
          const zIndex = 100 - Math.abs(offset);
          const opacity = Math.abs(offset) > 3 ? 0 : 1; // Hide items too far away

          const itemAspectRatio = item.aspectRatio || (320 / 400);
          const itemHeight = isCenter ? 400 : 350;
          const itemWidth = itemHeight * itemAspectRatio;

          return (
            <motion.div
              key={index}
              className="absolute cursor-pointer shadow-2xl rounded-2xl overflow-hidden bg-zinc-900 border border-white/10"
              style={{
                width: itemWidth,
                height: itemHeight,
                zIndex,
              }}
              animate={{
                x,
                y,
                rotate,
                scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              onClick={() => setActiveIndex(index)}
              whileHover={!isCenter ? { scale: scale * 1.05 } : {}}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title || "Artwork"}
                  fill
                  className="object-cover"
                />
                
                {/* Darken non-center items */}
                <motion.div 
                  className="absolute inset-0 bg-black/50"
                  animate={{ opacity: isCenter ? 0 : 0.6 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Title & Tag Overlay (Only fully visible on center) */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6"
                animate={{ opacity: isCenter ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.tag && (
                  <span className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.3em] text-[#00b4d8] mb-2">
                    {item.tag}
                  </span>
                )}
                {item.title && (
                  <h4 className="font-[family-name:var(--font-tech)] text-2xl font-bold uppercase text-white">
                    {item.title}
                  </h4>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls & Title Display below the arc */}
      <div className="mt-12 flex flex-col items-center z-20">
        <div className="flex items-center gap-8 mb-6">
          <button 
            onClick={prev}
            disabled={activeIndex === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:text-[#00b4d8] hover:border-[#00b4d8] disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400 transition-colors"
          >
            ←
          </button>
          
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-[#00b4d8] w-6" : "bg-zinc-700 hover:bg-zinc-500"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={next}
            disabled={activeIndex === items.length - 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:text-[#00b4d8] hover:border-[#00b4d8] disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400 transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
