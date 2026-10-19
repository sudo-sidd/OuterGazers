"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Work {
  id: string;
  title: string;
  slug: string;
  description: string;
  sector: "AR" | "VR_QUEST" | "PC" | "ANDROID";
  coverImageUrl: string | null;
  videoUrl: string | null;
}

interface ProjectCardProps {
  work: Work;
}

export default function ProjectCard({ work }: ProjectCardProps) {
  // Format the sector string for display (e.g., "VR_QUEST" -> "VR QUEST")
  const formatSector = (sector: string) => {
    return sector.replace("_", " ");
  };

  return (
    <Link href={`/works/${work.slug}`} className="block group cursor-pointer">
      <div className="relative bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden transition-colors duration-500 group-hover:border-zinc-700">
        
        {/* Aspect Ratio Container for Media */}
        <div className="relative aspect-video overflow-hidden bg-black">
          {work.coverImageUrl ? (
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105 z-0"
              style={{ backgroundImage: `url(${work.coverImageUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-0">
              <span className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest">
                Asset Missing
              </span>
            </div>
          )}

          {/* Cinematic Overlay - Darkens slightly on hover to make any overlay text pop if added later */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />

          {/* Sector Badge floating over the image */}
          <div className="absolute top-4 right-4 z-20">
            <span className="bg-black/80 backdrop-blur-md border border-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
              {formatSector(work.sector)}
            </span>
          </div>

          {/* Video Indicator - Shows if the project contains video assets */}
          {work.videoUrl && (
            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
              <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                ▶ Trailer
              </span>
            </div>
          )}
        </div>

        {/* Text Details Section */}
        <div className="p-6 relative z-20 bg-zinc-950 transition-colors duration-500 group-hover:bg-zinc-900/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-extrabold uppercase tracking-wider text-white group-hover:text-white transition-colors">
              {work.title}
            </h3>
            {/* Animated Arrow that pushes right on hover */}
            <span className="text-zinc-500 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300">
              ➔
            </span>
          </div>
          
          <p className="text-zinc-500 text-sm font-light leading-relaxed line-clamp-2 group-hover:text-zinc-400 transition-colors">
            {work.description}
          </p>
        </div>

        {/* Animated Progress Line at the bottom */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-700 ease-out z-30" />
      </div>
    </Link>
  );
}