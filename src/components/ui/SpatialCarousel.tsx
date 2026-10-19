"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ───────────────────────────────────────────────────────
   Expanded Card — Accordion-style expanding flex cards
   Hover/click a collapsed strip to expand it,
   others collapse into thin slivers with a number badge.
   ─────────────────────────────────────────────────────── */

export interface ExpandedCardItem {
  type: "project" | "artwork";
  title?: string;
  description?: string;
  tag?: string;
  link?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}

interface ExpandedCardSectionProps {
  items: ExpandedCardItem[];
  className?: string;
}

export default function ExpandedCardSection({
  items,
  className = "",
}: ExpandedCardSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop: horizontal expanding cards */}
      <div className="hidden md:flex w-full gap-3 items-stretch" style={{ height: "70vh", maxHeight: "700px" }}>
        <LayoutGroup>
          {items.map((item, i) => (
            <ExpandingCard
              key={i}
              item={item}
              index={i}
              isActive={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
              total={items.length}
            />
          ))}
        </LayoutGroup>
      </div>

      {/* Mobile: vertical stacked cards */}
      <div className="flex md:hidden flex-col gap-3 w-full px-4">
        {items.map((item, i) => (
          <MobileCard
            key={i}
            item={item}
            index={i}
            isActive={activeIndex === i}
            onActivate={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Desktop — Expanding horizontal card
   ═══════════════════════════════════════════ */
interface ExpandingCardProps {
  item: ExpandedCardItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  total: number;
}

function ExpandingCard({ item, index, isActive, onActivate, total }: ExpandingCardProps) {
  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        flex: isActive ? 6 : 1,
        minWidth: isActive ? 0 : 60,
        transition: "flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={onActivate}
      onMouseEnter={onActivate}
    >
      {/* Background media */}
      <div className="absolute inset-0 z-0">
        {item.mediaType === "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src={item.mediaUrl}
          />
        ) : (
          <Image
            src={item.mediaUrl}
            alt={item.title || "Project"}
            fill
            className="object-cover transition-transform duration-700 ease-out"
            style={{
              transform: isActive ? "scale(1.05)" : "scale(1.15)",
            }}
          />
        )}
      </div>

      {/* Dark overlay — heavier when collapsed */}
      <div
        className="absolute inset-0 z-[1] transition-all duration-700"
        style={{
          background: isActive
            ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)"
            : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Collapsed state: Number + vertical title */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-between py-8"
          >
            {/* Index number */}
            <span
              className="font-[family-name:var(--font-kode)] text-[11px] font-bold tracking-[0.3em] text-[#00b4d8]/80"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Vertical title */}
            {item.title && (
              <div
                className="flex-1 flex items-center justify-center"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                <span className="font-[family-name:var(--font-tech)] text-sm font-bold uppercase tracking-[0.2em] text-white/60 whitespace-nowrap">
                  {item.title}
                </span>
              </div>
            )}

            {/* Bottom accent line */}
            <div className="w-[2px] h-8 bg-gradient-to-b from-[#00b4d8]/40 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded state: Full content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="absolute inset-0 z-10 flex flex-col justify-end p-8 lg:p-12"
          >
            {/* Tag */}
            {item.tag && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="font-[family-name:var(--font-kode)] text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#00b4d8] mb-3 inline-block"
              >
                {item.tag}
              </motion.span>
            )}

            {/* Title */}
            {item.title && (
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="font-[family-name:var(--font-tech)] text-4xl lg:text-6xl font-bold uppercase tracking-tight text-white mb-3 leading-[0.95]"
              >
                {item.title}
              </motion.h3>
            )}

            {/* Description */}
            {item.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-zinc-300 text-sm lg:text-base max-w-lg font-medium leading-relaxed mb-6"
              >
                {item.description}
              </motion.p>
            )}



            {/* Index badge — bottom right */}
            <div className="absolute top-8 right-8 lg:top-12 lg:right-12">
              <span className="font-[family-name:var(--font-kode)] text-[10px] font-bold tracking-[0.3em] text-white/30">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge glow when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 z-[2] pointer-events-none rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            boxShadow: "inset 0 0 80px rgba(0, 180, 216, 0.06), 0 0 40px rgba(0, 180, 216, 0.08)",
            border: "1px solid rgba(0, 180, 216, 0.12)",
          }}
        />
      )}

      {/* Collapsed border */}
      {!isActive && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none rounded-2xl"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        />
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Mobile — Vertical stacked accordion cards
   ═══════════════════════════════════════════ */
interface MobileCardProps {
  item: ExpandedCardItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}

function MobileCard({ item, index, isActive, onActivate }: MobileCardProps) {
  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-xl cursor-pointer"
      style={{
        height: isActive ? 400 : 80,
        transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={onActivate}
    >
      {/* Background media */}
      <div className="absolute inset-0 z-0">
        {item.mediaType === "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src={item.mediaUrl}
          />
        ) : (
          <Image
            src={item.mediaUrl}
            alt={item.title || "Project"}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1] transition-all duration-500"
        style={{
          background: isActive
            ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
            : "rgba(0,0,0,0.7)",
        }}
      />

      {/* Collapsed: horizontal title */}
      {!isActive && (
        <div className="absolute inset-0 z-10 flex items-center px-5 gap-4">
          <span className="font-[family-name:var(--font-kode)] text-[11px] font-bold tracking-[0.3em] text-[#00b4d8]/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          {item.title && (
            <span className="font-[family-name:var(--font-tech)] text-base font-bold uppercase tracking-wider text-white/60">
              {item.title}
            </span>
          )}
        </div>
      )}

      {/* Expanded content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute inset-0 z-10 flex flex-col justify-end p-6"
          >
            {item.tag && (
              <span className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#00b4d8] mb-2">
                {item.tag}
              </span>
            )}
            {item.title && (
              <h3 className="font-[family-name:var(--font-tech)] text-3xl font-bold uppercase tracking-tight text-white mb-2">
                {item.title}
              </h3>
            )}
            {item.description && (
              <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-4 line-clamp-3">
                {item.description}
              </p>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
