"use client";

import { motion } from "framer-motion";
import { Calendar, Trophy, ChevronRight, Terminal, Sparkles } from "lucide-react";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────
// No placeholder events — populate these when real events are announced.
const GAME_JAMS: {
  id: number;
  title: string;
  status: string;
  date: string;
  theme: string;
  participants: string;
  prize: string;
  color: string;
}[] = [];

const UPDATES: {
  id: number;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
}[] = [];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function EventsPage() {
  return (
    <main className="bg-[#0a0a0a] text-white overflow-hidden font-[family-name:var(--font-anta)]">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 px-6 md:px-12">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00b4d8]/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#7c3aed]/6 blur-[150px] rounded-full pointer-events-none" />

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
              Transmissions & Jams
            </span>
            <div className="w-8 h-px bg-[#00b4d8]" />
          </motion.div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-tech)] text-6xl sm:text-7xl md:text-[9rem] tracking-tight uppercase leading-none mb-0">
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
            className="font-[family-name:var(--font-kode)] text-base md:text-lg font-bold uppercase tracking-[0.4em] text-zinc-400"
          >
            Hackathons · Gamejams · Studio Logs
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          ACTIVE & UPCOMING JAMS
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] py-32 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-4">
              — Gamejams & Hackathons
            </p>
            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-7xl font-bold tracking-tight leading-none">
              Active & Upcoming
            </h2>
          </motion.div>

          {GAME_JAMS.length > 0 ? (
            <div className="space-y-6">
              {GAME_JAMS.map((jam, i) => (
                <motion.div
                  key={jam.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group relative bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${jam.color} group-hover:w-2 transition-all duration-300`} />

                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="w-full md:w-auto flex-shrink-0">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-3
                        ${jam.status === 'Ongoing' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' :
                          jam.status === 'Upcoming' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          'bg-zinc-800 text-zinc-400 border border-zinc-700'}
                      `}>
                        {jam.status === 'Ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />}
                        {jam.status}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                        <Calendar size={14} />
                        <span>{jam.date}</span>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-[#00b4d8] transition-colors">
                        {jam.title}
                      </h3>
                      <p className="text-zinc-400 text-sm">
                        <span className="text-zinc-300 font-semibold">Theme:</span> {jam.theme}
                      </p>
                    </div>

                    <div className="w-full md:w-auto flex-shrink-0 mt-4 md:mt-0">
                      <button className="group/btn relative px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-[0.25em] overflow-hidden transition-all duration-500 flex items-center justify-center gap-2 w-full md:w-auto">
                        <span className="relative z-10">
                          {jam.status === 'Completed' ? 'View Results' : 'Join Jam'}
                        </span>
                        <ChevronRight size={16} className="relative z-10" />
                        <div className="absolute inset-0 bg-[#00b4d8] translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative bg-zinc-900/20 border border-zinc-800 rounded-lg p-16 md:p-24 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#00b4d8]/3 pointer-events-none" />
              <div className="relative z-10">
                <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-6" />
                <h3 className="font-[family-name:var(--font-tech)] text-2xl md:text-3xl font-bold text-zinc-400 mb-4">
                  No Active Jams
                </h3>
                <p className="font-[family-name:var(--font-kode)] text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 max-w-md mx-auto">
                  Our next game jam is being forged. Join our Discord to get notified when submissions open.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LATEST TRANSMISSIONS / LOGS
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] py-32 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-4">
              — Studio Logs
            </p>
            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-7xl font-bold tracking-tight leading-none">
              Latest Transmissions
            </h2>
          </motion.div>

          {UPDATES.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {UPDATES.map((update, i) => (
                <motion.article
                  key={update.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group cursor-pointer bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 p-8 rounded-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#00b4d8]/0 via-[#00b4d8]/40 to-[#00b4d8]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                </motion.article>
              ))}
            </div>
          ) : (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative bg-zinc-900/20 border border-zinc-800 rounded-lg p-16 md:p-24 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#7c3aed]/3 pointer-events-none" />
              <div className="relative z-10">
                <Terminal className="w-12 h-12 text-zinc-700 mx-auto mb-6" />
                <h3 className="font-[family-name:var(--font-tech)] text-2xl md:text-3xl font-bold text-zinc-400 mb-4">
                  No Transmissions Yet
                </h3>
                <p className="font-[family-name:var(--font-kode)] text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 max-w-md mx-auto">
                  Studio logs and development updates will appear here. Stay tuned.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — JOIN THE NETWORK
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] py-36 px-6 md:px-12 overflow-hidden">
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
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[140px] bg-[#00b4d8]/6 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[140px] bg-[#7c3aed]/6 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-8">
              — Join the Network
            </p>
            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-6">
              Never miss a{" "}
              <span
                className="relative inline-block"
                style={{ textShadow: "0 0 60px rgba(0,180,216,0.4)" }}
              >
                transmission.
              </span>
            </h2>
            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-16">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(0,180,216,0.7)" }}
              >
                Join our community.
              </span>
            </h2>

            {/* Accent line */}
            <div
              className="h-px w-32 mx-auto mb-16"
              style={{ background: "linear-gradient(90deg, transparent, #00b4d8, transparent)" }}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="group relative px-10 py-4 overflow-hidden font-bold text-xs uppercase tracking-[0.25em] transition-all duration-500"
                style={{ background: "#00b4d8", color: "#0a0a0a" }}
              >
                <span className="relative z-10">Get in Touch</span>
                <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </Link>
              <button className="group px-10 py-4 bg-[#5865F2] hover:bg-[#4752C4] font-bold text-xs uppercase tracking-[0.25em] text-white transition-all duration-400 flex items-center gap-2">
                <Sparkles size={14} />
                Connect via Discord
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
