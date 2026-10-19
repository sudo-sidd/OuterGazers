"use client";

import { motion } from "framer-motion";

interface SectorFilterProps {
  activeSector: string;
  setActiveSector: (sector: string) => void;
}

const SECTORS = [
  { id: "ALL", label: "All Archives" },
  { id: "PC", label: "PC Gaming" },
  { id: "VR_QUEST", label: "Meta Quest VR" },
  { id: "AR", label: "Augmented Reality" },
  { id: "ANDROID", label: "Android Mobile" },
];

export default function SectorFilter({ activeSector, setActiveSector }: SectorFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4">
      {SECTORS.map((sector) => {
        const isActive = activeSector === sector.id;

        return (
          <button
            key={sector.id}
            onClick={() => setActiveSector(sector.id)}
            className={`relative px-5 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 focus:outline-none ${
              isActive ? "text-black" : "text-zinc-500 hover:text-white"
            }`}
          >
            {/* The gliding background pill */}
            {isActive && (
              <motion.div
                layoutId="active-sector-indicator"
                className="absolute inset-0 bg-white rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.2)] z-0"
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30 
                }}
              />
            )}
            
            {/* The Text (z-10 ensures it stays above the gliding background) */}
            <span className="relative z-10">{sector.label}</span>
          </button>
        );
      })}
    </div>
  );
}