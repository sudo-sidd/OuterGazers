"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { X, Sparkles, Calendar, MapPin, Trophy, Gamepad2, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { FLAGSHIP_GAME_JAM } from "@/constants";
import TeamRegistrationModal from "./TeamRegistrationModal";

// ─── Corner Bracket SVG ─────────────────────────────────────────────────────
function CornerBracket({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M0 12 L0 0 L12 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ─── Floating Particle ──────────────────────────────────────────────────────
function FloatingParticle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: Math.random() > 0.5 ? "rgba(0,180,216,0.6)" : "rgba(124,58,237,0.6)",
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  delay: i * 0.4,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 3,
}));

// ─── Glitch Text ────────────────────────────────────────────────────────────
function GlitchText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span
        className="absolute inset-0 text-[#00b4d8] opacity-50"
        style={{
          clipPath: "inset(40% 0 50% 0)",
          transform: "translate(-2px, 0)",
          animation: "glitch-1 3s infinite linear alternate-reverse",
        }}
        aria-hidden
      >
        {children}
      </span>
      <span
        className="absolute inset-0 text-[#7c3aed] opacity-30"
        style={{
          clipPath: "inset(65% 0 20% 0)",
          transform: "translate(2px, 0)",
          animation: "glitch-2 2.5s infinite linear alternate-reverse",
        }}
        aria-hidden
      >
        {children}
      </span>
      {children}
    </span>
  );
}

// ─── Stat Badge ─────────────────────────────────────────────────────────────
function StatBadge({ icon: Icon, label, value, accent = "#00b4d8" }: { icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className="relative p-3 bg-black/60 border border-zinc-800 rounded overflow-hidden group cursor-default"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at center, ${accent}10, transparent 70%)` }}
      />
      <div className="relative flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
        >
          <Icon size={13} style={{ color: accent }} />
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 leading-none mb-0.5">{label}</p>
          <p className="text-xs font-bold text-white leading-none">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function EventAnnouncementPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [scanlineOffset, setScanlineOffset] = useState(0);
  const event = FLAGSHIP_GAME_JAM;

  // Trigger after random 3–5 seconds
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("og_event_ad_dismissed");
      if (dismissed === "true") return;
    }
    const delay = 3000 + Math.random() * 2000;
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, []);

  // Animate scanline sweep
  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    let offset = 0;
    const animate = () => {
      offset = (offset + 0.5) % 100;
      setScanlineOffset(offset);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible]);

  // Lock body scroll
  useEffect(() => {
    if (!isVisible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("og_event_ad_dismissed", "true");
    }
  };

  const handleOpenRegister = () => {
    setIsVisible(false);
    setIsRegisterOpen(true);
  };

  return (
    <>
      {/* Global glitch keyframes */}
      <style jsx global>{`
        @keyframes glitch-1 {
          0%, 90% { transform: translate(-2px, 0); }
          95% { transform: translate(2px, -1px); }
          100% { transform: translate(-2px, 0); }
        }
        @keyframes glitch-2 {
          0%, 85% { transform: translate(2px, 0); }
          90% { transform: translate(-2px, 1px); }
          100% { transform: translate(2px, 0); }
        }
        @keyframes scan-line {
          0% { top: -100%; }
          100% { top: 200%; }
        }
        @keyframes border-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,180,216,0.2), 0 0 60px rgba(0,180,216,0.05), inset 0 0 20px rgba(0,180,216,0.02); }
          50% { box-shadow: 0 0 40px rgba(0,180,216,0.35), 0 0 100px rgba(0,180,216,0.12), inset 0 0 30px rgba(0,180,216,0.05); }
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleDismiss}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="relative w-full max-w-[520px] max-h-[92vh] flex flex-col bg-[#080808] rounded-none overflow-hidden z-10"
              style={{
                border: "1px solid rgba(0,180,216,0.35)",
                animation: "border-glow-pulse 3s ease-in-out infinite",
              }}
            >

              {/* ── Scanline overlay ── */}
              <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden opacity-[0.04]">
                <div
                  className="absolute left-0 right-0 h-[3px] bg-[#00b4d8]"
                  style={{
                    top: `${scanlineOffset}%`,
                    transition: "top 0.016s linear",
                    boxShadow: "0 0 12px rgba(0,180,216,0.8)",
                  }}
                />
              </div>

              {/* ── Grid texture ── */}
              <div
                className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* ── Corner brackets ── */}
              <span className="absolute top-0 left-0 text-[#00b4d8] z-20 pointer-events-none"><CornerBracket /></span>
              <span className="absolute top-0 right-0 text-[#00b4d8] z-20 pointer-events-none rotate-90"><CornerBracket /></span>
              <span className="absolute bottom-0 left-0 text-[#00b4d8] z-20 pointer-events-none -rotate-90"><CornerBracket /></span>
              <span className="absolute bottom-0 right-0 text-[#00b4d8] z-20 pointer-events-none rotate-180"><CornerBracket /></span>

              {/* ── Floating particles ── */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {PARTICLES.map((p) => (
                  <FloatingParticle key={p.id} {...p} />
                ))}
              </div>

              {/* ── Ambient glow blobs ── */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8]/8 blur-[80px] rounded-full pointer-events-none z-0" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7c3aed]/8 blur-[70px] rounded-full pointer-events-none z-0" />

              {/* ── Top accent stripe ── */}
              <div className="relative shrink-0 h-[2px] w-full z-10">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent" />
                <motion.div
                  className="absolute inset-0 h-full"
                  style={{ background: "linear-gradient(90deg, transparent, #00b4d8, #7c3aed, #00b4d8, transparent)" }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
              </div>

              {/* ── Header bar ── */}
              <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-zinc-900 shrink-0">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#00b4d8]"
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#00b4d8]"
                    style={{ fontFamily: "var(--font-kode)" }}
                  >
                    Incoming Transmission · Live Event
                  </span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="relative group w-7 h-7 flex items-center justify-center border border-zinc-800 hover:border-[#00b4d8]/50 text-zinc-500 hover:text-white transition-all duration-200 rounded-none"
                  aria-label="Close"
                >
                  <X size={13} />
                  <span className="absolute inset-0 bg-[#00b4d8]/0 group-hover:bg-[#00b4d8]/5 transition-all" />
                </button>
              </div>

              {/* ── Scrollable body ── */}
              <div
                className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7 py-6"
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
              >

                {/* ── Status badge ── */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 mb-5"
                >
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] border"
                    style={{
                      color: "#00b4d8",
                      borderColor: "rgba(0,180,216,0.3)",
                      background: "rgba(0,180,216,0.06)",
                    }}
                  >
                    <Zap size={10} />
                    Registrations Open
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] border"
                    style={{
                      color: "#7c3aed",
                      borderColor: "rgba(124,58,237,0.3)",
                      background: "rgba(124,58,237,0.06)",
                    }}
                  >
                    <Trophy size={10} />
                    {event.totalPrizePool} Pool
                  </span>
                </motion.div>

                {/* ── Main title ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-4"
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 mb-2"
                    style={{ fontFamily: "var(--font-kode)" }}
                  >
                    — OuterGazers Studio Presents
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-none"
                    style={{ fontFamily: "var(--font-tech)", textShadow: "0 0 40px rgba(0,180,216,0.25)" }}
                  >
                    <GlitchText>{event.title}</GlitchText>
                  </h2>
                  <div
                    className="h-px w-full mt-4 mb-4 origin-left"
                    style={{ background: "linear-gradient(90deg, #00b4d8, rgba(124,58,237,0.5), transparent)" }}
                  />
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Coimbatore&apos;s premier collegiate <span className="text-white font-semibold">72H hybrid game jam</span> &amp; esports showdown hosted at{" "}
                    <span className="text-[#00b4d8] font-semibold">XR Lab, SIET</span>.
                  </p>
                </motion.div>

                {/* ── Stats grid ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="grid grid-cols-2 gap-2.5 mb-5"
                >
                  <StatBadge icon={Calendar} label="In-Person Finale" value="Dec 17–18, 2026" accent="#00b4d8" />
                  <StatBadge icon={MapPin} label="Venue" value="XR Lab, SIET CBE" accent="#00b4d8" />
                  <StatBadge icon={Gamepad2} label="Esports" value="Valorant · FC 26" accent="#7c3aed" />
                  <StatBadge icon={Trophy} label="Prize Pool" value={event.totalPrizePool} accent="#7c3aed" />
                </motion.div>

                {/* ── Pricing bar ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-6 relative overflow-hidden"
                  style={{
                    border: "1px solid rgba(0,180,216,0.2)",
                    background: "linear-gradient(135deg, rgba(0,180,216,0.05) 0%, rgba(124,58,237,0.05) 100%)",
                  }}
                >
                  <div className="px-4 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-1" style={{ fontFamily: "var(--font-kode)" }}>
                        Team Entry Fee
                      </p>
                      <p className="text-xl font-extrabold text-white" style={{ fontFamily: "var(--font-tech)" }}>
                        ₹{event.pricePerPerson}
                        <span className="text-xs text-zinc-500 font-normal ml-1">/ member</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">Squad Size</p>
                      <p className="text-sm font-bold text-[#00b4d8]">3 – 4 Gazers</p>
                    </div>
                  </div>
                  {/* Sweeping shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(0,180,216,0.08), transparent)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* ── CTA Buttons ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 mb-5"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenRegister}
                    className="flex-1 relative group py-3.5 px-5 bg-[#00b4d8] text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 overflow-hidden transition-colors duration-300 hover:bg-white"
                  >
                    <Sparkles size={14} />
                    Register Squad
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                  </motion.button>

                  <Link
                    href={`/news/${event.slug}`}
                    onClick={handleDismiss}
                    className="flex-1 group py-3.5 px-5 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 transition-all duration-300"
                  >
                    View Details
                    <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                {/* ── Dismiss link ── */}
                <div className="text-center pb-1">
                  <button
                    onClick={handleDismiss}
                    className="text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-[0.2em] transition-colors"
                    style={{ fontFamily: "var(--font-kode)" }}
                  >
                    Dismiss Transmission
                  </button>
                </div>
              </div>

              {/* ── Bottom accent stripe ── */}
              <div className="relative shrink-0 h-[1px] w-full z-10">
                <div
                  className="h-full w-full"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)" }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <TeamRegistrationModal
        event={event}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  );
}
