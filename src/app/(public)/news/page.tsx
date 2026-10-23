"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Diamond, Trophy, MapPin, Calendar, Users,
  Sparkles, ChevronRight, Utensils, Clock,
} from "lucide-react";
import Link from "next/link";
import { FLAGSHIP_GAME_JAM } from "@/constants";
import EventCountdown from "@/components/events/EventCountdown";
import TeamRegistrationModal from "@/components/events/TeamRegistrationModal";

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER = [
  "GAME JAM", "ESPORTS SHOWDOWN", "₹16,000 PRIZE POOL", "XR LAB · SIET",
  "REGISTRATIONS OPEN", "DEC 17–18, 2026", "72H HYBRID FORMAT",
  "ALL MEALS INCLUDED", "COLLEGIATE TEAMS",
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function NewsHero() {
  return (
    <section className="relative min-h-[55vh] w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-radial-hero pointer-events-none z-10" />
      <div
        className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00b4d8]/8 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#7c3aed]/6 blur-[160px] rounded-full pointer-events-none z-0" />

      <div className="relative z-20 text-center w-full max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 mb-10"
        >
          <div className="w-8 h-px bg-[#00b4d8]" />
          <span className="font-[family-name:var(--font-vt)] text-xl font-bold uppercase tracking-[0.4em] text-[#00b4d8]">
            News &amp; Events
          </span>
          <div className="w-8 h-px bg-[#00b4d8]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-tech)] text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] tracking-tighter uppercase leading-none"
        >
          <span className="block" style={{ textShadow: "0 0 80px rgba(0,180,216,0.3)" }}>
            Studio
          </span>
          <span
            className="block text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(0,180,216,0.65)" }}
          >
            Events
          </span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
          className="h-[1px] w-full max-w-lg mx-auto my-8 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, #00b4d8, transparent)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center justify-center gap-3"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-2.5 h-2.5 rounded-full bg-emerald-400"
          />
          <span className="font-[family-name:var(--font-kode)] text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
            Registrations Live · Dec 17–18, 2026
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="font-[family-name:var(--font-kode)] text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-600">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="w-px h-14"
          style={{ background: "linear-gradient(to bottom, #00b4d8, transparent)" }}
        />
      </motion.div>
    </section>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
function NewsTicker() {
  return (
    <div className="relative z-20 bg-[#0a0a0a] border-y border-zinc-800 py-4 overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex whitespace-nowrap gap-0"
      >
        {[...TICKER, ...TICKER].map((item, i) => (
          <span
            key={i}
            className="font-[family-name:var(--font-vt)] inline-flex items-center gap-5 px-6 text-xl font-bold uppercase tracking-[0.3em] text-zinc-500"
          >
            {item}
            <Diamond className="w-3 h-3 text-[#00b4d8]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ onRegister }: { onRegister: () => void }) {
  const jam = FLAGSHIP_GAME_JAM;

  return (
    <section className="relative z-20 bg-[#0a0a0a] py-28 px-6 md:px-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-3">
            — Active Flagship Event
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-[family-name:var(--font-tech)] text-4xl md:text-6xl font-bold tracking-tight leading-none text-white">
              Active &amp; Upcoming
            </h2>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-emerald-400"
              />
              <span className="font-[family-name:var(--font-kode)] text-xs font-bold uppercase tracking-wider text-emerald-400">
                Registrations Live
              </span>
            </div>
          </div>
        </motion.div>

        {/* Big card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#070707] border border-zinc-800 overflow-hidden"
          style={{ boxShadow: "0 0 80px rgba(0,180,216,0.06)" }}
        >
          {/* Top ribbon */}
          <div className="relative h-[2px] w-full">
            <div className="h-full w-full bg-gradient-to-r from-[#00b4d8] via-[#7c3aed] to-[#00b4d8]" />
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00b4d8]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7c3aed]/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="flex flex-col xl:flex-row xl:items-start gap-12">

              {/* Left */}
              <div className="flex-1 space-y-7">

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00b4d8] border border-[#00b4d8]/30 bg-[#00b4d8]/05">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]"
                    />
                    {jam.status} · {jam.badgeText}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7c3aed] border border-[#7c3aed]/30 bg-[#7c3aed]/05">
                    <Trophy size={11} />
                    Prize Pool: {jam.totalPrizePool}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-800">
                    <Users size={11} />
                    {jam.minTeamSize}–{jam.maxTeamSize} Gazers / Team
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3
                    className="font-[family-name:var(--font-tech)] text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-none"
                    style={{ textShadow: "0 0 40px rgba(0,180,216,0.15)" }}
                  >
                    {jam.title}
                  </h3>
                  <p className="font-[family-name:var(--font-kode)] text-sm text-[#00b4d8] mt-3 tracking-widest uppercase">
                    {jam.subtitle}
                  </p>
                </div>

                <div
                  className="h-px w-full max-w-sm"
                  style={{ background: "linear-gradient(90deg, #00b4d8, rgba(124,58,237,0.4), transparent)" }}
                />

                <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl">
                  Undergraduate collegiate game jam with{" "}
                  <span className="text-white font-semibold">6 days of remote hacking</span>{" "}
                  followed by a{" "}
                  <span className="text-[#00b4d8] font-semibold">2-day in-person showcase</span>{" "}
                  at the{" "}
                  <span className="text-white font-semibold">
                    XR Lab, Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore
                  </span>
                  . Includes all meals, refreshments, and free entry into Valorant &amp; FC 26 esports tournaments.
                </p>

                {/* Info chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: MapPin,    label: "Venue",         value: "XR Lab, SIET CBE",  accent: "#00b4d8" },
                    { icon: Calendar,  label: "Finale Dates",  value: "Dec 17–18, 2026",   accent: "#00b4d8" },
                    { icon: Utensils,  label: "Hospitality",   value: "All Meals & Snacks", accent: "#7c3aed" },
                  ].map(({ icon: Icon, label, value, accent }) => (
                    <motion.div
                      key={label}
                      whileHover={{ y: -2, borderColor: accent }}
                      className="p-4 bg-black/40 border border-zinc-800/80 flex items-center gap-3 text-xs transition-colors duration-300"
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center shrink-0"
                        style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                      >
                        <Icon size={15} style={{ color: accent }} />
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold block text-[9px] uppercase tracking-[0.2em] font-[family-name:var(--font-kode)]">
                          {label}
                        </span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: pricing + countdown + CTAs */}
              <div className="xl:w-72 w-full shrink-0 border border-zinc-800 bg-black/60 p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(0,180,216,0.04) 0%, transparent 50%, rgba(124,58,237,0.04) 100%)" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Price */}
                <div className="relative text-center">
                  <p className="font-[family-name:var(--font-kode)] text-[9px] font-bold uppercase tracking-[0.35em] text-[#00b4d8] mb-2">
                    Registration Rate
                  </p>
                  <div
                    className="font-[family-name:var(--font-tech)] text-4xl font-bold text-white"
                    style={{ textShadow: "0 0 30px rgba(0,180,216,0.3)" }}
                  >
                    ₹{jam.pricePerPerson}
                    <span className="text-base text-zinc-600 font-normal ml-1">/ person</span>
                  </div>
                  <p className="font-[family-name:var(--font-kode)] text-[10px] text-zinc-500 mt-1">
                    ₹2,400 (3 Gazers) · ₹3,200 (4 Gazers)
                  </p>
                </div>

                <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(0,180,216,0.3), transparent)" }} />

                {/* Countdown */}
                <div className="relative text-center">
                  <p className="font-[family-name:var(--font-kode)] text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">
                    Theme Drop Countdown
                  </p>
                  <EventCountdown targetDate="2026-12-11T18:00:00+05:30" />
                </div>

                <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)" }} />

                {/* CTAs */}
                <div className="relative space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRegister}
                    className="w-full py-4 px-6 bg-[#00b4d8] hover:bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    <Sparkles size={14} />
                    Register Team
                  </motion.button>

                  <Link
                    href={`/events/${jam.slug}`}
                    className="w-full group py-3 px-6 border border-zinc-800 hover:border-[#00b4d8]/50 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    View Full Brief
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const jam = FLAGSHIP_GAME_JAM;

  return (
    <main className="bg-[#0a0a0a] text-white overflow-hidden font-[family-name:var(--font-anta)]">
      <NewsHero />
      <NewsTicker />
      <EventCard onRegister={() => setIsModalOpen(true)} />

      <TeamRegistrationModal
        event={jam}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
