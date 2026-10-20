"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, ChevronRight, Terminal, Sparkles, MapPin, Users, Utensils, Gamepad2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { FLAGSHIP_GAME_JAM, STUDIO_TRANSMISSIONS, DISCORD_INVITE_URL } from "@/constants";
import EventCountdown from "@/components/events/EventCountdown";
import TeamRegistrationModal from "@/components/events/TeamRegistrationModal";

export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const jam = FLAGSHIP_GAME_JAM;

  return (
    <main className="bg-[#0a0a0a] text-white overflow-hidden font-[family-name:var(--font-anta)]">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[75vh] w-full flex flex-col items-center justify-center overflow-hidden pt-36 pb-20 px-6 md:px-12">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00b4d8]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#7c3aed]/8 blur-[160px] rounded-full pointer-events-none" />

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Scan lines */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 text-center max-w-5xl mx-auto"
        >
          {/* Section tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-[#00b4d8]" />
            <span className="font-[family-name:var(--font-vt)] text-lg font-bold uppercase tracking-[0.4em] text-[#00b4d8]">
              Transmissions &amp; Jams
            </span>
            <div className="w-8 h-px bg-[#00b4d8]" />
          </motion.div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-tech)] text-6xl sm:text-7xl md:text-[8.5rem] tracking-tight uppercase leading-none mb-0">
            <span
              className="relative inline-block"
              style={{
                textShadow: "0 0 80px rgba(0,180,216,0.35), 0 0 160px rgba(0,180,216,0.15)",
              }}
            >
              Studio{" "}
            </span>
            <span
              className="relative inline-block text-transparent"
              style={{ WebkitTextStroke: "1.5px rgba(0,180,216,0.7)" }}
            >
              Events
            </span>
          </h1>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
            className="h-[1px] w-full max-w-lg mx-auto my-8 origin-center"
            style={{ background: "linear-gradient(90deg, transparent, #00b4d8, transparent)" }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="font-[family-name:var(--font-kode)] text-sm md:text-base font-bold uppercase tracking-[0.35em] text-zinc-400"
          >
            Hackathons · Esports Showdowns · Studio Logs
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          ACTIVE & UPCOMING JAMS (FLAGSHIP SIET XR LAB)
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] py-28 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-3">
                — Active Flagship Sector
              </p>
              <h2 className="font-[family-name:var(--font-tech)] text-4xl md:text-6xl font-bold tracking-tight leading-none text-white">
                Active &amp; Upcoming
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-[family-name:var(--font-kode)] text-xs font-bold uppercase tracking-wider text-emerald-400">
                Registrations Live
              </span>
            </div>
          </motion.div>

          {/* Featured Game Jam Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-black border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
          >
            {/* Top Gradient Ribbon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00b4d8] via-[#7c3aed] to-[#00b4d8]" />

            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                
                {/* Left Column: Jam Details */}
                <div className="flex-grow space-y-6 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      {jam.status} · {jam.badgeText}
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      <Trophy size={13} />
                      Prize Pool: {jam.totalPrizePool}
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                      <Users size={13} />
                      3–4 Gazers / Team
                    </div>
                  </div>

                  <div>
                    <h3 className="font-[family-name:var(--font-tech)] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight group-hover:text-[#00b4d8] transition-colors">
                      {jam.title}
                    </h3>
                    <p className="font-[family-name:var(--font-kode)] text-sm md:text-base text-zinc-400 mt-2">
                      {jam.subtitle}
                    </p>
                  </div>

                  <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                    Undergraduate collegiate game jam with 6 days of remote hacking followed by a 2-day in-person showcase at the{" "}
                    <span className="text-white font-semibold">XR Lab, Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore</span>.
                    Includes all meals, continuous refreshments, and free entry into Day 2 1v1 Valorant &amp; FC 26 esports showdowns.
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg flex items-center gap-3 text-xs">
                      <MapPin size={16} className="text-[#00b4d8] shrink-0" />
                      <div>
                        <span className="text-zinc-500 font-bold block text-[10px] uppercase font-[family-name:var(--font-kode)]">VENUE</span>
                        <span className="text-white font-medium">XR Lab, SIET Coimbatore</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg flex items-center gap-3 text-xs">
                      <Calendar size={16} className="text-[#00b4d8] shrink-0" />
                      <div>
                        <span className="text-zinc-500 font-bold block text-[10px] uppercase font-[family-name:var(--font-kode)]">FINALE DATES</span>
                        <span className="text-white font-medium">Dec 17–18, 2026</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg flex items-center gap-3 text-xs">
                      <Utensils size={16} className="text-[#00b4d8] shrink-0" />
                      <div>
                        <span className="text-zinc-500 font-bold block text-[10px] uppercase font-[family-name:var(--font-kode)]">HOSPITALITY</span>
                        <span className="text-white font-medium">All Meals &amp; Snacks Free</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing & Action */}
                <div className="lg:w-72 w-full shrink-0 flex flex-col justify-between p-6 sm:p-8 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-6 text-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00b4d8] font-[family-name:var(--font-kode)] block mb-1">
                      Registration Rate
                    </span>
                    <div className="text-3xl font-bold font-[family-name:var(--font-tech)] text-white">
                      ₹{jam.pricePerPerson} <span className="text-xs text-zinc-500 font-normal">/ person</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-[family-name:var(--font-kode)] mt-1">
                      ₹2,400 (3 Gazers) · ₹3,200 (4 Gazers)
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-[family-name:var(--font-kode)] block mb-2">
                      Theme Drop Countdown
                    </span>
                    <EventCountdown targetDate="2026-12-11T18:00:00+05:30" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-3.5 px-6 bg-[#00b4d8] hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#00b4d8]/20"
                    >
                      <Sparkles size={15} />
                      Register Team
                    </button>

                    <Link
                      href={`/events/${jam.slug}`}
                      className="w-full py-3 px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>View Full Brief &amp; Guide</span>
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LATEST TRANSMISSIONS / LOGS
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] py-28 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mb-14"
          >
            <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-3">
              — Studio Logs
            </p>
            <h2 className="font-[family-name:var(--font-tech)] text-4xl md:text-6xl font-bold tracking-tight leading-none text-white">
              Latest Transmissions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDIO_TRANSMISSIONS.map((update, i) => (
              <motion.article
                key={update.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group cursor-pointer bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 p-8 rounded-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#00b4d8]/0 via-[#00b4d8]/50 to-[#00b4d8]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div>
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <span className="font-[family-name:var(--font-kode)] text-[10px] font-bold tracking-[0.3em] uppercase text-[#00b4d8]">
                      {update.tag}
                    </span>
                    <span className="text-zinc-700">•</span>
                    <span className="font-[family-name:var(--font-kode)] text-[10px] font-bold tracking-[0.2em] text-zinc-500">
                      {update.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-3 group-hover:text-white transition-colors">
                    {update.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                    {update.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800/60 flex items-center justify-between text-xs font-[family-name:var(--font-kode)] text-zinc-500">
                  <span>{update.readTime}</span>
                  <span className="text-[#00b4d8] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read log <ChevronRight size={13} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — JOIN THE NETWORK
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] py-36 px-6 md:px-12 overflow-hidden border-t border-zinc-900">
        {/* Background watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span className="font-[family-name:var(--font-tech)] text-[15vw] font-bold tracking-tight text-white/[0.025] whitespace-nowrap">
            OUTERGAZERS
          </span>
        </div>

        {/* Glow blobs */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[140px] bg-[#00b4d8]/8 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[140px] bg-[#7c3aed]/8 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-8">
              — Connect Your Terminal
            </p>
            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-4">
              Never miss a{" "}
              <span
                className="relative inline-block"
                style={{ textShadow: "0 0 60px rgba(0,180,216,0.4)" }}
              >
                transmission.
              </span>
            </h2>
            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-12">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(0,180,216,0.7)" }}
              >
                Join our Discord community.
              </span>
            </h2>

            {/* Accent line */}
            <div
              className="h-px w-32 mx-auto mb-12"
              style={{ background: "linear-gradient(90deg, transparent, #00b4d8, transparent)" }}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-10 py-4 bg-[#5865F2] hover:bg-[#4752C4] font-bold text-xs uppercase tracking-[0.25em] text-white transition-all duration-300 flex items-center justify-center gap-2 rounded shadow-lg shadow-[#5865F2]/25"
              >
                <Sparkles size={15} />
                Connect via Discord (discord.gg/N4w7gGfdq)
              </a>

              <Link
                href="/#contact"
                className="group relative px-10 py-4 overflow-hidden font-bold text-xs uppercase tracking-[0.25em] transition-all duration-500 rounded border border-zinc-700 hover:border-white text-white"
              >
                <span className="relative z-10">Get in Touch</span>
                <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out text-black" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Registration Modal */}
      <TeamRegistrationModal
        event={jam}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
