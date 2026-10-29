"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AsciiMedia } from "@/components/ui/AsciiMediaLoader";

interface ArtworkItem {
  imageUrl?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  title?: string;
  tag?: string;
}

interface ArtworkPinBoardProps {
  items: ArtworkItem[];
  className?: string;
}

export default function ArtworkPinBoard({ items, className = "" }: ArtworkPinBoardProps) {
  const [selectedItem, setSelectedItem] = useState<ArtworkItem | null>(null);

  // Close modal on escape key safely within useEffect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Pause background canvas when artwork modal is open
  useEffect(() => {
    if (!selectedItem) return;
    document.body.classList.add("modal-open");
    window.dispatchEvent(new CustomEvent("outergazers:modal-open", { detail: { open: true } }));
    return () => {
      document.body.classList.remove("modal-open");
      window.dispatchEvent(new CustomEvent("outergazers:modal-open", { detail: { open: false } }));
    };
  }, [selectedItem]);

  return (
    <div className={`relative w-full min-h-screen py-20 px-4 md:px-8 bg-[#0d0d0d] ${className}`}>
      {/* Background radial glow */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] bg-[#00b4d8]/5 z-0 pointer-events-none" />

      {/* Grid of items - Masonry layout */}
      <div className="relative z-10 max-w-[1600px] mx-auto columns-1 md:columns-2 gap-8 space-y-8">
        {items.map((item, i) => (
          <motion.div
            key={i}
            layoutId={`artwork-${i}`}
            onClick={() => setSelectedItem(item)}
            className="break-inside-avoid relative rounded-xl overflow-hidden group cursor-pointer shadow-xl border border-white/5 bg-zinc-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Media with ASCII Loading Animation */}
            <div className="relative w-full min-h-[220px]">
              <AsciiMedia
                mediaType={item.mediaType || "image"}
                src={item.mediaUrl || item.imageUrl || ""}
                alt={item.title || "Artwork"}
                subLabel={item.title}
                label={item.mediaType === "video" ? "DECODING VIDEO" : "TEXTURE BUFFER"}
                className="w-full h-auto object-cover transition-all duration-500"
              />
            </div>

            {/* Hover overlay text */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
            >
              {item.tag && (
                <span className="font-[family-name:var(--font-kode)] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#00b4d8] mb-1">
                  {item.tag}
                </span>
              )}
              {item.title && (
                <h4 className="font-[family-name:var(--font-tech)] text-base sm:text-lg lg:text-xl font-bold uppercase text-white">
                  {item.title}
                </h4>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Focused View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-12 overflow-hidden"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/95 md:bg-black/85 md:backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden bg-[#111] shadow-2xl border border-white/10 flex flex-col z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media Container with ASCII Loader */}
              <div className="relative w-full flex-1 min-h-[300px] flex items-center justify-center bg-black/50 overflow-hidden p-2">
                <AsciiMedia
                  mediaType={selectedItem.mediaType || "image"}
                  src={selectedItem.mediaUrl || selectedItem.imageUrl || ""}
                  alt={selectedItem.title || "Artwork focused view"}
                  subLabel={selectedItem.title}
                  objectFit="contain"
                  className="max-w-full max-h-[75vh] w-auto h-auto rounded-lg"
                />
              </div>

              {/* Info Bar */}
              {(selectedItem.title || selectedItem.tag) && (
                <div className="p-6 bg-gradient-to-t from-black to-[#111] border-t border-white/5">
                  {selectedItem.tag && (
                    <span className="font-[family-name:var(--font-kode)] text-xs font-bold uppercase tracking-[0.2em] text-[#00b4d8] mb-2 block">
                      {selectedItem.tag}
                    </span>
                  )}
                  {selectedItem.title && (
                    <h3 className="font-[family-name:var(--font-tech)] text-xl sm:text-2xl font-bold uppercase text-white">
                      {selectedItem.title}
                    </h3>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
