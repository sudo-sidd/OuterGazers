"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AsciiMedia } from "@/components/ui/AsciiMediaLoader";

export interface CarouselProjectCardProps {
  type: "project" | "artwork";
  title?: string;
  description?: string;
  tag?: string;
  link?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}

export default function CarouselProjectCard({
  type,
  title,
  description,
  tag,
  link,
  mediaUrl,
  mediaType,
}: CarouselProjectCardProps) {
  return (
    <div className="w-[85vw] max-w-[800px] h-[55vh] md:h-[65vh] rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#0d0d0d] border border-zinc-800 shadow-2xl relative group">
      {/* Media Background with ASCII Loading Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AsciiMedia
          mediaType={mediaType}
          src={mediaUrl}
          alt={title || "Project"}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Gradient Overlay for Project Cards */}
        {type === "project" && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
        )}
      </div>

      {/* Content for Project Cards */}
      {type === "project" && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12 pointer-events-none">
          {tag && (
            <span className="font-[family-name:var(--font-kode)] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#00b4d8] mb-3 md:mb-4 inline-block drop-shadow-md">
              {tag}
            </span>
          )}
          <h3 className="font-[family-name:var(--font-tech)] text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-3 md:mb-4 drop-shadow-lg">
            {title}
          </h3>
          {description && (
            <p className="text-zinc-300 text-sm md:text-base max-w-xl font-medium leading-relaxed mb-6 md:mb-8 drop-shadow-md">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
