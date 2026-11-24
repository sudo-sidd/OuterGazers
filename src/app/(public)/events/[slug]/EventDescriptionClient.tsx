"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, Calendar, MapPin, Users, Utensils, 
  Gamepad2, Sparkles, CheckCircle2, ChevronDown, 
  ArrowLeft, ExternalLink, Monitor, Globe, Smartphone,
  FolderArchive, FileText, UploadCloud, Minimize2, Repeat, Shuffle
} from "lucide-react";
import { FLAGSHIP_GAME_JAM, type EventItem } from "@/constants";
import EventCountdown from "@/components/events/EventCountdown";
import TeamRegistrationModal from "@/components/events/TeamRegistrationModal";
import InterCollegeEventDescription from "./InterCollegeEventDescription";

export default function EventDescriptionClient({
  event = FLAGSHIP_GAME_JAM,
}: {
  event?: EventItem;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (event.id === "intercollege-gamejam-2026") {
    return <InterCollegeEventDescription event={event} />;
  }

  const isExternal = event.registrationType === "external" && !!event.registrationUrl;

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen pt-28 pb-32 font-sans overflow-hidden">
      
      {/* Background Ambient Glows (Rendered on larger screens to avoid mobile GPU compositor stalls) */}
      <div className="hidden sm:block fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00b4d8]/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="hidden sm:block fixed bottom-10 right-10 w-[600px] h-[500px] bg-[#7c3aed]/8 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Grid texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Back Link & Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-zinc-400 hover:text-[#00b4d8] transition-colors"
          >
            <ArrowLeft size={14} /> Back to News &amp; Events
          </Link>

          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00b4d8] font-sans border border-[#00b4d8]/30 px-3 py-1 rounded-full bg-[#00b4d8]/5">
            Official Master Guide
          </span>
        </div>

        {/* ═══════════════════════════════════════════
            HERO TRANSMISSION
        ═══════════════════════════════════════════ */}
        <section className="relative rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/40 via-zinc-950/60 to-black/80 p-8 md:p-14 overflow-hidden mb-16 backdrop-blur-md">
          {/* Cyan Corner Accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00b4d8]/15 blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00b4d8] via-[#7c3aed] to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 font-sans">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {event.badgeText || "Registrations Open"} · {event.format || "Collegiate Jam"}
              </div>

              <h1 className="font-sans text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight uppercase leading-[1.05] text-white mb-6">
                {event.title}
              </h1>

              <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-6">
                {event.subtitle || event.themeDescription}
              </p>

              {/* Key Highlights Pill Group */}
              <div className="flex flex-wrap gap-4 text-xs font-sans text-zinc-300">
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-lg">
                  <MapPin size={15} className="text-[#00b4d8]" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-lg">
                  <Calendar size={15} className="text-[#00b4d8]" />
                  <span>{event.inPersonDates || event.dates}</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-lg">
                  <Users size={15} className="text-[#00b4d8]" />
                  <span>Team Event: {event.minTeamSize}–{event.maxTeamSize} Members</span>
                </div>
                {event.inclusions && event.inclusions[0] && (
                  <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-lg">
                    <Utensils size={15} className="text-[#00b4d8]" />
                    <span>{event.inclusions[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Countdown & Action Card */}
            <div className="lg:w-80 w-full shrink-0 flex flex-col items-center justify-center p-6 sm:p-8 bg-zinc-950/90 border border-zinc-800 rounded-xl text-center space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00b4d8] font-sans mb-2">
                  Total Prize Pool
                </p>
                <div className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  {event.totalPrizePool}
                </div>
                <p className="text-[11px] text-zinc-500 font-mono mt-1">
                  {event.duration}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 font-sans mb-3">
                  {event.countdownLabel || "Registrations & Submissions Close In"}
                </p>
                <EventCountdown targetDate={event.countdownTarget || "2026-11-29T23:59:59+05:30"} />
              </div>

              <div className="w-full space-y-3 pt-2">
                {isExternal ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#00b4d8] to-[#0096c7] hover:from-white hover:to-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-[#00b4d8]/20 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    Register Now ({event.pricePerPerson > 0 ? `₹${event.pricePerPerson}/Head` : "Free"})
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#00b4d8] to-[#0096c7] hover:from-white hover:to-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-[#00b4d8]/20 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    Register Team ({event.pricePerPerson > 0 ? `₹${event.pricePerPerson}/Head` : "Free"})
                  </button>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            KEY SPECS & INCLUSIONS GRID
        ═══════════════════════════════════════════ */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="text-[#00b4d8] font-bold text-2xl font-sans mb-1">
                {event.pricePerPerson > 0 ? `₹${event.pricePerPerson}` : "Free"}{" "}
                <span className="text-xs text-zinc-500 font-normal">/ person</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Team Registration
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {event.pricePerPerson > 0
                  ? `₹${event.pricePerPerson * event.minTeamSize} for a ${event.minTeamSize}-member team or ₹${event.pricePerPerson * event.maxTeamSize} for a ${event.maxTeamSize}-member team. Paid collectively via UPI QR.`
                  : `Free entry for collegiate teams of ${event.minTeamSize} to ${event.maxTeamSize} members.`}
              </p>
            </div>

            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="text-emerald-400 font-bold text-2xl font-sans mb-1">
                Included
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                XR Lab &amp; Mentoring
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Full access to SIET XR Lab facilities, high-performance testing hardware, and 1-on-1 development mentorship from OuterGazers leads.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="text-[#7c3aed] font-bold text-2xl font-sans mb-1">
                Inter-College Quals
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                December Jam Passes
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Top team wins 100% Free Entry into the flagship December Inter-College Game Jam; runner-up teams receive exclusive entry discounts!
              </p>
            </div>

            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="text-cyan-400 font-bold text-2xl font-sans mb-1">
                Venue Access
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                {event.format || "Online + XR Lab"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {event.venue || "Dedicated team workstations, high-speed Wi-Fi, stage pitches, and hardware test pipeline."}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            OFFICIAL JAM THEMES (MANDATORY)
        ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 via-zinc-950/80 to-black/90 p-8 md:p-12 overflow-hidden shadow-2xl shadow-black/80">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00b4d8]/10 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#7c3aed]/10 blur-[130px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-zinc-800/80 pb-6">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-2">
                    — Official Jam Themes (Mandatory)
                  </p>
                  <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                    Official Game Jam Themes
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/30 text-[#00b4d8] text-xs font-bold uppercase tracking-wider self-start md:self-auto font-sans">
                  <span className="w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse" />
                  Mandatory Theme Requirement · Pick Either or Combine Both
                </div>
              </div>

              {/* Dual Themes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Theme 1: Limited Space */}
                <div className="relative p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#00b4d8]/10 via-zinc-900/60 to-zinc-950 border border-[#00b4d8]/30 group hover:border-[#00b4d8]/60 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00b4d8]/10 blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00b4d8] font-mono border border-[#00b4d8]/40 px-2.5 py-0.5 rounded bg-[#00b4d8]/10">
                      Theme 01
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[#00b4d8]/15 border border-[#00b4d8]/30 flex items-center justify-center text-[#00b4d8] group-hover:scale-110 transition-transform">
                      <Minimize2 size={20} />
                    </div>
                  </div>

                  <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mb-3">
                    LIMITED SPACE
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                    Explore boundaries and confinement. Constrain the world, the player, the interface, or the resources to evoke intense ingenuity.
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                      <span>Single-screen puzzles, tight elevators, micro-mazes, or shrinking rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                      <span>Severe inventory constraints, minimal screen resolution, or limited memory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                      <span>Claustrophobic space capsules, micro-ecosystems, or tiny arenas</span>
                    </div>
                  </div>
                </div>

                {/* Theme 2: Loops */}
                <div className="relative p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#7c3aed]/10 via-zinc-900/60 to-zinc-950 border border-[#7c3aed]/30 group hover:border-[#7c3aed]/60 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/10 blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d946ef] font-mono border border-[#7c3aed]/40 px-2.5 py-0.5 rounded bg-[#7c3aed]/10">
                      Theme 02
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/15 border border-[#7c3aed]/30 flex items-center justify-center text-[#d946ef] group-hover:scale-110 transition-transform">
                      <Repeat size={20} />
                    </div>
                  </div>

                  <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mb-3">
                    LOOPS
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                    Turn repetition and recursion into core gameplay mechanics. Time loops, geometric loops, feedback cycles, or reality resets where each iteration reveals new truths.
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
                      <span>Time loops, reset cycles, temporal echoes, or recording player ghosts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
                      <span>Infinite recursive puzzles, non-Euclidean geometry, or circular corridors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
                      <span>Systemic automation loops, feedback cycles, or escalating rogue-lite repetitions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandatory Policy Banner */}
              <div className="p-6 rounded-xl bg-zinc-900/40 border border-[#00b4d8]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center text-[#00b4d8] shrink-0 mt-0.5">
                    <Shuffle size={20} />
                  </div>
                  <div>
                    <h4 className="font-sans text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      Themes Are Mandatory · Pick Theme 1, Theme 2, or Combine Both
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed max-w-4xl">
                      Themes are <span className="text-[#00b4d8] font-bold">not optional</span>. Every participating squad must construct their game around <span className="text-[#00b4d8] font-semibold">Theme 01 (LIMITED SPACE)</span>, <span className="text-[#d946ef] font-semibold">Theme 02 (LOOPS)</span>, or a <span className="text-white font-semibold">hybrid fusion</span> of both mechanics (e.g. looping time cycles within a shrinking room). <span className="text-white font-bold">Theme adherence is required</span> for judging, scoring, and awards!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SUPPORTED PLATFORMS & SUBMISSION PROTOCOL
        ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="mb-10">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-2">
              — Unified Category · No Separate Tracks
            </p>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight">
              Supported Platforms &amp; Submission Protocol
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-3xl leading-relaxed">
              This game jam is open and unified: there are no separate tracks or divisions. Squads can craft games targeting Windows, Web, or Android. All submissions will be evaluated collectively on innovation, creative gameplay, technical execution, and polish.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: 3 Supported Platforms */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-sans block mb-3">
                  01 · Supported Build Targets (Any Engine)
                </span>
                <div className="space-y-3">
                  <div className="p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-lg flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center shrink-0 text-[#00b4d8]">
                      <Monitor size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Windows PC</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        Standalone executable build (<code className="text-[#00b4d8] font-mono text-[11px]">.exe</code>). Built in Unity, Unreal Engine, Godot, or custom frameworks.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-lg flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[#7c3aed]/10 border border-[#7c3aed]/30 flex items-center justify-center shrink-0 text-[#7c3aed]">
                      <Globe size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Web / Browser</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        HTML5 / WebGL playable build package ready for instant play in standard modern desktop browsers.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-lg flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Android Mobile</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        Installable standalone Android package (<code className="text-emerald-400 font-mono text-[11px]">.apk</code>) optimized for mobile touch controls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Submission Requirements (.ZIP & Google Drive) */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-7 bg-zinc-950/60 border border-[#00b4d8]/30 rounded-xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8]/5 blur-[70px] pointer-events-none rounded-full" />

                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00b4d8] font-sans block mb-1">
                      02 · Official Submission Pipeline
                    </span>
                    <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                      <FolderArchive size={20} className="text-[#00b4d8]" />
                      Packaged .ZIP &amp; Google Drive Upload
                    </h3>
                  </div>
                  <span className="text-[11px] bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/30 px-2.5 py-1 rounded font-bold font-sans">
                    Last Week Release
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider font-sans">
                      <FileText size={15} className="text-emerald-400" />
                      1. Readme / Documentation
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Include a <code className="text-zinc-200 font-mono text-[11px]">README.txt</code>, <code className="text-zinc-200 font-mono text-[11px]">.doc</code>, or <code className="text-zinc-200 font-mono text-[11px]">.pdf</code> containing:
                    </p>
                    <ul className="text-[11px] text-zinc-300 space-y-1.5 list-disc list-inside">
                      <li>Game Title &amp; Core Concept</li>
                      <li>Squad Members &amp; SIET Roll Numbers</li>
                      <li>Controls &amp; How to Play guide</li>
                      <li><span className="text-[#00b4d8] font-semibold">AI Disclosure:</span> Mention what AI was used for coding, art, music, SFX, etc. (if any)</li>
                      <li><span className="text-emerald-400 font-semibold">Asset Credits:</span> Credit any pre-made assets &amp; note scripts/assets reused from previous projects</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider font-sans">
                      <FolderArchive size={15} className="text-[#00b4d8]" />
                      2. Playable Game Build
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Include the complete playable build:
                    </p>
                    <ul className="text-[11px] text-zinc-300 space-y-1.5 list-disc list-inside">
                      <li>Windows: Standalone executable (.exe)</li>
                      <li>Web: HTML5 / WebGL build folder</li>
                      <li>Android: Installable APK package</li>
                      <li>Pre-made assets &amp; previous project scripts are fully allowed</li>
                      <li>Bundle build + readme together in one <span className="text-white font-bold">.ZIP</span></li>
                    </ul>
                  </div>
                </div>

                {/* Google Drive Upload Announcement Box */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-[#00b4d8]/10 via-[#7c3aed]/10 to-transparent border border-[#00b4d8]/30 flex items-start gap-3">
                  <UploadCloud size={20} className="text-[#00b4d8] shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-white block">
                      Google Drive Submission Link (Last Week Release)
                    </span>
                    <p className="text-zinc-300 leading-relaxed font-sans">
                      The official Google Drive submission folder link will be shared directly with all registered squads via WhatsApp during the <span className="text-[#00b4d8] font-bold">final week of the jam</span>. Upload your squad&apos;s .ZIP archive before <span className="text-white font-bold">November 29, 2026 · 11:59 PM IST</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PHASE BREAKDOWN
        ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="mb-12">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-2">
              — Roadmap &amp; Milestones
            </p>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight">
              Event Phases &amp; Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {event.schedule.map((phase, idx) => (
              <div
                key={phase.phase}
                className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-xl relative flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <span className="font-sans text-xs font-bold text-[#00b4d8] block mb-2">
                    Phase 0{idx + 1}
                  </span>
                  <h3 className="font-bold text-sm text-white mb-2">
                    {phase.phase.replace(/^Phase \d+: /, "")}
                  </h3>
                  <div className="text-[11px] font-sans text-emerald-400 font-semibold mb-3">
                    {phase.time}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PRIZE POOL & AWARDS
        ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="mb-12">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-2">
              — Bounty Allocation
            </p>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight">
              Prizes &amp; Inter-College Qualification
            </h2>
          </div>

          {/* Game Jam Awards */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-[#00b4d8]" />
              Game Jam Honors &amp; Inter-College Passes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {event.prizes.map((prize) => (
                <div
                  key={prize.place}
                  className="p-8 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00b4d8] font-sans block mb-2">
                      Award Category
                    </span>
                    <h4 className="text-xl font-bold text-white mb-3">
                      {prize.place}
                    </h4>
                    <div className="text-2xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-white mb-6">
                      {prize.reward}
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400">
                      {prize.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-[#00b4d8] shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus Esports Awards (Rendered only if defined) */}
          {event.esportsPrizes && event.esportsPrizes.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans mb-4 flex items-center gap-2">
                <Gamepad2 size={14} className="text-[#7c3aed]" />
                Day 2 Bonus Esports Showdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.esportsPrizes.map((esport) => (
                  <div
                    key={esport.game}
                    className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#7c3aed] uppercase font-sans mb-1">
                        <span>{esport.platform}</span>
                        <span>•</span>
                        <span>1v1 Tournament</span>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-1">
                        {esport.game}
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-sm">
                        {esport.format}
                      </p>
                    </div>
                    <div className="text-right sm:shrink-0">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Winner Takes All</span>
                      <span className="text-2xl font-bold font-sans text-[#00b4d8]">
                        {esport.prize}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════
            RUN OF SHOW (MINUTE-BY-MINUTE)
        ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="mb-12">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-2">
              — Operational Playbook
            </p>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight">
              Jam Timeline &amp; Key Phases
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Timeline Breakdown */}
            <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00b4d8] font-sans">
                  October 29 – November 29, 2026
                </span>
                <h3 className="text-2xl font-bold text-white font-sans">
                  Phase-by-Phase Execution
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                {[
                  { time: "Oct 29 – Nov 29, 2026", act: "Registration & Student ID Verification", notes: "Online registration open for all SIET students. Free entry; registrations close Nov 29 (11:59 PM IST)." },
                  { time: "October 29, 2026", act: "Official Theme Announcement", notes: "The mandatory jam themes are live. Teams begin conceptualization and prototyping." },
                  { time: "Oct 29 – Nov 29, 2026", act: "Remote Jamming & Mentor Check-Ins", notes: "Teams build their games remotely with technical guidance and optional testing at the SIET XR Lab." },
                  { time: "Nov 29, 2026 · 11:59 PM", act: "HARD SUBMISSION & REGISTRATION LOCKDOWN", notes: "Final .zip package (executable build + readme) and squad registrations strictly close at 11:59 PM IST.", highlight: true },
                  { time: "Nov 30, 2026 · ~12:00 PM", act: "Result Announcement & Inter-College Briefing", notes: "Gather at XR Lab, SIET for rankings release, winner felicitations, and entry instructions for the December Inter-College event." },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center justify-between ${
                      item.highlight
                        ? "bg-red-500/10 border border-red-500/30 text-red-200"
                        : "bg-zinc-950/50 border border-zinc-900"
                    }`}
                  >
                    <div className="font-sans text-[#00b4d8] font-bold min-w-[150px]">
                      {item.time}
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-white">{item.act}</div>
                      <div className="text-[11px] text-zinc-400">{item.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks & Advancement Card */}
            <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="border-b border-zinc-800 pb-4 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-sans">
                    Advancement &amp; Mentorship
                  </span>
                  <h3 className="text-2xl font-bold text-white font-sans">
                    Path to December Inter-College Jam
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  {[
                    { time: "1st Place Winner", act: "100% Free Direct Entry", notes: "Top team receives free entry into the December Inter-College Game Jam with priority XR Lab workstation access." },
                    { time: "Top Finalists (Ranked)", act: "Rank-Based Ticket Discounts", notes: "Runner-up teams earn tiered discounts for the December event based on their final ranking." },
                    { time: "XR Lab Facilities", act: "Hardware & Playtesting Pipeline", notes: "Access cutting-edge VR headsets, high-performance PCs, and passthrough devices at SIET." },
                    { time: "Packaging & Showcase", act: "1-on-1 Build Mentorship", notes: "OuterGazers mentors guide squads through compiling clean builds, preparing readme docs, and public game showcasing." },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center justify-between bg-zinc-950/50 border border-zinc-900"
                    >
                      <div className="font-sans text-emerald-400 font-bold min-w-[150px]">
                        {item.time}
                      </div>
                      <div className="flex-grow">
                        <div className="font-bold text-white">{item.act}</div>
                        <div className="text-[11px] text-zinc-400">{item.notes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentorship Summary Banner */}
              <div className="p-5 rounded-lg bg-gradient-to-r from-cyan-950/20 to-emerald-950/20 border border-zinc-800 mt-6 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={15} className="text-emerald-400" />
                  SIET Exclusive Benefits
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  No entry fee required. All participating teams earn official OuterGazers Studio certificates, project portfolio showcases, and direct studio mentorship.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            JUDGING & EVALUATION FRAMEWORK
        ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="p-8 md:p-12 bg-zinc-900/20 border border-zinc-800 rounded-2xl">
            <div className="max-w-3xl mb-8">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-2">
                — Fair Play &amp; Transparent Scoring
              </p>
              <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                Judging &amp; Rating Framework
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Evaluation is conducted entirely by <span className="text-white font-bold">Official Judges (100% weight)</span> to ensure fair, impartial assessment alongside technical and creative scrutiny.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2">
                <span className="text-[#00b4d8] font-bold font-sans text-sm">01. Innovation &amp; Creativity</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Novelty of gameplay mechanics, originality of concept, and creative execution of fresh, out-of-the-box ideas.
                </p>
              </div>

              <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2">
                <span className="text-[#00b4d8] font-bold font-sans text-sm">02. Core Mechanic &amp; Tech</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Control responsiveness, physics feel, clean execution, and complete lack of game-breaking crashes.
                </p>
              </div>

              <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2">
                <span className="text-[#00b4d8] font-bold font-sans text-sm">03. Visuals, Audio &amp; Polish</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Artistic identity, shader quality, lighting balance, UI cohesiveness, and immersive audio cues.
                </p>
              </div>

              <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2">
                <span className="text-[#00b4d8] font-bold font-sans text-sm">04. Demo Showcase</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Clarity of readme documentation, playability, and polish of the submitted executable build.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            RULES & FAQ ACCORDION
        ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Rules */}
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-2">
                — Regulations
              </p>
              <h2 className="font-sans text-3xl font-bold tracking-tight text-white mb-6">
                Official Ruleset
              </h2>

              <ul className="space-y-3 text-xs text-zinc-300">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-zinc-900/30 border border-zinc-800/70 rounded-lg">
                    <span className="font-sans font-bold text-[#00b4d8] shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-2">
                — Clarifications
              </p>
              <h2 className="font-sans text-3xl font-bold tracking-tight text-white mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {event.faqs.map((faq, i) => {
                  const isOpen = activeFaq === i;
                  return (
                    <div
                      key={i}
                      className="border border-zinc-800 bg-zinc-900/30 rounded-lg overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : i)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-bold text-white uppercase tracking-wider"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          size={16}
                          className={`text-[#00b4d8] shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 font-sans">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BOTTOM CALL TO ACTION
        ═══════════════════════════════════════════ */}
        <section className="relative rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[#00b4d8]/5 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.4em] text-[#00b4d8]">
              {event.status} · {event.inPersonDates || event.dates}
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Forge Your Reality at {event.venue ? event.venue.split(",")[0] : "OuterGazers Jam"}
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              Assemble your squad of {event.minTeamSize} to {event.maxTeamSize} members. Lock in your registration ({event.pricePerPerson > 0 ? `₹${event.pricePerPerson}/head` : "Free"}) to secure mentoring, XR Lab access, and qualify for December&apos;s Inter-College Game Jam.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isExternal ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-[#00b4d8] hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Register Now ({event.pricePerPerson > 0 ? `₹${event.pricePerPerson}/Head` : "Free"})
                  <ExternalLink size={14} />
                </a>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-[#00b4d8] hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Register Team ({event.pricePerPerson > 0 ? `₹${event.pricePerPerson}/Head` : "Free"})
                </button>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* Interactive Registration Modal */}
      <TeamRegistrationModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
