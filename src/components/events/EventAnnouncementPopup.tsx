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

  // Lock body scroll when popup is visible
  useEffect(() => {
    if (!isVisible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
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
      <AnimatePresence>
        {isVisible && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
            onWheel={(e) => e.stopPropagation()}
          >
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
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0c0c0c] border border-[#00b4d8]/40 rounded-2xl shadow-[0_0_60px_rgba(0,180,216,0.25)] overflow-hidden z-10 font-sans"
            >
              {/* Animated Glowing Top Stripe */}
              <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#00b4d8] via-[#7c3aed] to-[#00b4d8] animate-pulse" />

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white p-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
                aria-label="Close event announcement"
              >
                <X size={16} />
              </button>

              {/* Body */}
              <div 
                className="p-6 sm:p-8 relative flex-1 overflow-y-auto overscroll-contain font-sans"
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
              >
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#00b4d8]/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7c3aed]/10 blur-[80px] rounded-full pointer-events-none" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/30 text-[#00b4d8] text-[11px] font-semibold tracking-wide mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#00b4d8] animate-ping" />
                  Upcoming Hosted Event · Registrations Live
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-tight mb-2.5">
                  {event.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 mb-5 leading-relaxed font-normal">
                  Coimbatore&apos;s premier 72H hybrid game jam &amp; collegiate esports showdown at Sri Shakthi Institute of Engineering and Technology (SIET).
                </p>

                {/* Key Highlights Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-2.5">
                    <Trophy size={15} className="text-[#00b4d8] shrink-0" />
                    <span className="text-zinc-200 font-semibold">{event.totalPrizePool} Prize Pool</span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-2.5">
                    <Utensils size={15} className="text-[#00b4d8] shrink-0" />
                    <span className="text-zinc-200 font-medium">Full Meals &amp; Snacks</span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-2.5">
                    <Gamepad2 size={15} className="text-[#7c3aed] shrink-0" />
                    <span className="text-zinc-200 font-medium">Valorant &amp; FC 26</span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-2.5">
                    <MapPin size={15} className="text-[#7c3aed] shrink-0" />
                    <span className="text-zinc-200 font-medium">XR Lab, SIET</span>
                  </div>
                </div>

                {/* Pricing Ribbon */}
                <div className="mb-6 p-3.5 rounded-lg bg-gradient-to-r from-[#00b4d8]/10 via-[#7c3aed]/10 to-transparent border border-[#00b4d8]/25 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block mb-0.5">
                      Team Entry Fee
                    </span>
                    <span className="text-base font-bold text-white">₹800 <span className="text-xs text-zinc-400 font-normal">/ member</span></span>
                  </div>
                  <span className="text-xs text-[#00b4d8] font-semibold bg-[#00b4d8]/10 border border-[#00b4d8]/30 px-2.5 py-1 rounded">
                    3–4 Members Squad
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleOpenRegister}
                    className="flex-1 py-3.5 px-5 rounded-lg bg-gradient-to-r from-[#00b4d8] to-[#0096c7] hover:from-white hover:to-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#00b4d8]/20 hover:shadow-[#00b4d8]/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Sparkles size={15} />
                    Register Squad
                  </button>

                  <Link
                    href={`/news/${event.slug}`}
                    onClick={handleDismiss}
                    className="flex-1 py-3.5 px-5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    View Details
                    <ChevronRight size={15} />
                  </Link>
                </div>

                {/* Dismiss subtext */}
                <div className="text-center mt-4">
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
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
