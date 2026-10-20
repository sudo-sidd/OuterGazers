"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Calendar,
  MapPin,
  Trophy,
  Utensils,
  Gamepad2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { FLAGSHIP_GAME_JAM } from "@/constants";
import TeamRegistrationModal from "./TeamRegistrationModal";

export default function EventAnnouncementPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const event = FLAGSHIP_GAME_JAM;

  useEffect(() => {
    // Check if dismissed during the current session
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("og_event_ad_dismissed");
      if (dismissed === "true") {
        return;
      }
    }

    // Trigger after exactly 3 seconds on site load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Dimmed backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleDismiss}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Popup Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#0c0c0c] border border-[#00b4d8]/40 rounded-2xl shadow-[0_0_60px_rgba(0,180,216,0.25)] overflow-hidden z-10 font-[family-name:var(--font-anta)]"
            >
              {/* Animated Glowing Top Stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#00b4d8] via-[#7c3aed] to-[#00b4d8] animate-pulse" />

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white p-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
                aria-label="Close event announcement"
              >
                <X size={16} />
              </button>

              {/* Body */}
              <div className="p-6 sm:p-8 relative">
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#00b4d8]/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7c3aed]/10 blur-[80px] rounded-full pointer-events-none" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/30 text-[#00b4d8] text-[10px] font-bold uppercase tracking-widest mb-3 font-[family-name:var(--font-kode)]">
                  <span className="w-2 h-2 rounded-full bg-[#00b4d8] animate-ping" />
                  Upcoming Hosted Event · Registrations Live
                </div>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-tech)] text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-tight mb-2">
                  {event.title}
                </h3>

                <p className="font-[family-name:var(--font-kode)] text-xs text-zinc-400 mb-5 leading-relaxed">
                  Coimbatore&apos;s premier 72H hybrid game jam &amp; collegiate esports showdown at Sri Shakthi Institute of Engineering and Technology (SIET).
                </p>

                {/* Key Highlights Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs font-[family-name:var(--font-kode)]">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center gap-2">
                    <Trophy size={14} className="text-[#00b4d8] shrink-0" />
                    <span className="text-zinc-200 font-bold">{event.totalPrizePool} Prize Pool</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center gap-2">
                    <Utensils size={14} className="text-[#00b4d8] shrink-0" />
                    <span className="text-zinc-200">Full Meals &amp; Snacks</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center gap-2">
                    <Gamepad2 size={14} className="text-[#7c3aed] shrink-0" />
                    <span className="text-zinc-200">Valorant &amp; FC 26</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center gap-2">
                    <MapPin size={14} className="text-[#7c3aed] shrink-0" />
                    <span className="text-zinc-200">XR Lab, SIET</span>
                  </div>
                </div>

                {/* Pricing Ribbon */}
                <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-[#00b4d8]/10 via-[#7c3aed]/10 to-transparent border border-[#00b4d8]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-[family-name:var(--font-kode)] uppercase tracking-wider block">
                      Team Entry Fee
                    </span>
                    <span className="text-sm font-bold text-white">₹800 per Gazers</span>
                  </div>
                  <span className="text-[11px] font-[family-name:var(--font-kode)] text-[#00b4d8] font-bold">
                    3–4 Members Squad
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleOpenRegister}
                    className="flex-1 py-3 px-4 rounded-lg bg-[#00b4d8] hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-[#00b4d8]/20"
                  >
                    <Sparkles size={14} />
                    Register Squad
                  </button>

                  <Link
                    href={`/news/${event.slug}`}
                    onClick={handleDismiss}
                    className="flex-1 py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                  >
                    View Details
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Dismiss subtext */}
                <div className="text-center mt-4">
                  <button
                    onClick={handleDismiss}
                    className="text-[11px] text-zinc-500 hover:text-zinc-400 font-[family-name:var(--font-kode)] transition-colors"
                  >
                    Dismiss notification
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Registration Modal triggered by Register button */}
      <TeamRegistrationModal
        event={event}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  );
}
