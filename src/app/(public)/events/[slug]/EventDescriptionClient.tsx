"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, Calendar, MapPin, Users, Utensils, 
  Gamepad2, Sparkles, CheckCircle2, ChevronDown, 
  ArrowLeft, ExternalLink 
} from "lucide-react";
import { FLAGSHIP_GAME_JAM, DISCORD_INVITE_URL } from "@/constants";
import EventCountdown from "@/components/events/EventCountdown";
import TeamRegistrationModal from "@/components/events/TeamRegistrationModal";

export default function EventDescriptionClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const event = FLAGSHIP_GAME_JAM;

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen pt-28 pb-32 font-sans overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00b4d8]/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[600px] h-[500px] bg-[#7c3aed]/8 blur-[160px] rounded-full pointer-events-none -z-10" />

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
                Registrations Open · Hybrid Collegiate Jam
              </div>

              <h1 className="font-sans text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight uppercase leading-[1.05] text-white mb-6">
                Game Jam &amp;{" "}
                <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(0,180,216,0.85)" }}>
                  Esports Showdown
                </span>
              </h1>

              <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-6">
                A 7-day hybrid collegiate hackathon and 2-day in-person finale hosted at the vanguard{" "}
                <span className="text-white font-semibold">XR Lab, Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore</span>.
                Featuring game development tracks, full hospitality meals, and bonus 1v1 Valorant &amp; FC 26 tournaments.
              </p>

              {/* Key Highlights Pill Group */}
              <div className="flex flex-wrap gap-4 text-xs font-sans text-zinc-300">
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-lg">
                  <MapPin size={15} className="text-[#00b4d8]" />
                  <span>XR Lab, SIET Coimbatore</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-lg">
                  <Calendar size={15} className="text-[#00b4d8]" />
                  <span>In-Person: Dec 17–18, 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-lg">
                  <Users size={15} className="text-[#00b4d8]" />
                  <span>Team Event: 3–4 Members</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-lg">
                  <Utensils size={15} className="text-[#00b4d8]" />
                  <span>All Meals &amp; Snacks Included</span>
                </div>
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
                  ₹12,000 Jam + ₹4,000 Esports
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 font-sans mb-3">
                  Theme Announcement Drops In
                </p>
                <EventCountdown targetDate="2026-12-11T18:00:00+05:30" />
              </div>

              <div className="w-full space-y-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#00b4d8] to-[#0096c7] hover:from-white hover:to-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-[#00b4d8]/20 flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Register Team (₹800/Head)
                </button>

                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Join Event Discord
                  <ExternalLink size={14} />
                </a>
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
                ₹800 <span className="text-xs text-zinc-500 font-normal">/ person</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Team Registration
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ₹2,400 for a 3-member team or ₹3,200 for a 4-member team. Paid collectively by the team leader via UPI QR with instant screenshot verification.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="text-emerald-400 font-bold text-2xl font-sans mb-1">
                All Meals Free
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Full Hospitality
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Day 1 Lunch &amp; Dinner, Day 2 Breakfast, high-tea snacks, and continuous coffee/tea hydration stations.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="text-[#7c3aed] font-bold text-2xl font-sans mb-1">
                Bonus Esports
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                1v1 Valorant &amp; FC 26
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Free entry for registered jam participants. Play on Lab Gaming PCs and PS5 console for ₹4,000 cash prizes.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="text-cyan-400 font-bold text-2xl font-sans mb-1">
                XR Lab Access
              </div>
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                SIET Coimbatore
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dedicated team bays, high-speed Wi-Fi/LAN, stage presentations, and Meta Quest spatial hardware test pipeline.
              </p>
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

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {event.schedule.map((phase, idx) => (
              <div
                key={phase.phase}
                className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-xl relative flex flex-col justify-between"
              >
                <div>
                  <span className="font-sans text-xs font-bold text-[#00b4d8] block mb-2">
                    0{idx + 1}
                  </span>
                  <h3 className="font-bold text-sm text-white mb-2">
                    {phase.phase.replace(/^Phase \d+: /, "")}
                  </h3>
                  <div className="text-[11px] font-sans text-zinc-400 font-semibold mb-3">
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
              Prize Structure &amp; Categories
            </h2>
          </div>

          {/* Game Jam Awards */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-[#00b4d8]" />
              Game Jam Awards (₹12,000 Team Prizes)
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
                    <div className="text-3xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mb-6">
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

          {/* Bonus Esports Awards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans mb-4 flex items-center gap-2">
              <Gamepad2 size={14} className="text-[#7c3aed]" />
              Day 2 Bonus Esports Showdown (₹4,000 Individual Prizes)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.esportsPrizes?.map((esport) => (
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
              In-Person Run of Show
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Day 1 */}
            <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00b4d8] font-sans">
                  Thursday, December 17, 2026
                </span>
                <h3 className="text-2xl font-bold text-white font-sans">
                  Day 1: Submissions, Showcase &amp; Playtesting
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                {[
                  { time: "09:45 AM – 10:30 AM", act: "Team Check-In & Desk Allocation", notes: "Verify college IDs, distribute ID badges & meal passes at XR Lab entrance." },
                  { time: "10:30 AM – 11:00 AM", act: "Opening Briefing & Safety Address", notes: "Wi-Fi setup, submission rules, presentation format guidelines." },
                  { time: "11:00 AM – 01:00 PM", act: "Final Polish & Packaging Sprint", notes: "Tech team floaters assist teams with build exports and packaging." },
                  { time: "01:00 PM SHARP", act: "HARD SUBMISSION LOCKDOWN", notes: "Submission server locks. Builds verified and uploaded.", highlight: true },
                  { time: "01:00 PM – 02:15 PM", act: "Catered Lunch Service", notes: "Full meal provided. Lab secured during lunch break." },
                  { time: "02:15 PM – 05:00 PM", act: "Live Team Pitches & Demos", notes: "5–7 mins per team (3 min demo + 2 min Q&A on XR Lab stage)." },
                  { time: "05:00 PM – 05:30 PM", act: "High-Tea & Hot Snacks", notes: "Teams transition stations into interactive Arcade Showcase Mode." },
                  { time: "05:30 PM – 08:30 PM", act: "Peer Playtesting & Official Judging", notes: "Participants play and rate 5+ games. Judges conduct deep-dive evaluations." },
                  { time: "08:30 PM – 09:45 PM", act: "Full Dinner Service", notes: "Dinner served; audit judge scorecards & peer rating forms." },
                  { time: "09:45 PM – Late", act: "Lounge & Day 2 Esports Seeding", notes: "Lock 1v1 Valorant & FC 26 tournament brackets." },
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

            {/* Day 2 */}
            <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="border-b border-zinc-800 pb-4 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c3aed] font-sans">
                    Friday, December 18, 2026
                  </span>
                  <h3 className="text-2xl font-bold text-white font-sans">
                    Day 2: Awards &amp; Esports Showdown
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  {[
                    { time: "08:00 AM – 09:00 AM", act: "Morning Breakfast Service", notes: "Hot breakfast, tea & coffee distribution for participants and crew." },
                    { time: "09:00 AM – 10:00 AM", act: "Closing & Game Jam Award Ceremony", notes: "Announcement of Best Art, Best Mechanic, and Overall Winner. Presentation of trophies, cash, and certificates." },
                    { time: "10:00 AM – 12:30 PM", act: "Bonus Esports Tournament Showdowns", notes: "Simultaneous 1v1 brackets: Valorant on Lab Gaming PCs and EA Sports FC 26 on PlayStation 5." },
                    { time: "12:30 PM – 01:00 PM", act: "Esports Awards & Official Sign-Off", notes: "Awarding ₹2,000 to Valorant & FC 26 champions. Event wraps up." },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center justify-between bg-zinc-950/50 border border-zinc-900"
                    >
                      <div className="font-sans text-[#7c3aed] font-bold min-w-[150px]">
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

              {/* Hospitality Summary Banner */}
              <div className="p-5 rounded-lg bg-gradient-to-r from-cyan-950/20 to-purple-950/20 border border-zinc-800 mt-6 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Utensils size={15} className="text-[#00b4d8]" />
                  Hospitality Package Guaranteed
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  All registered members are covered: Day 1 Lunch, Evening High-Tea, Day 1 Dinner, Midnight Snacks, and Day 2 Breakfast.
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
                Evaluation is split between <span className="text-white font-bold">Official Judges (70% weight)</span> and{" "}
                <span className="text-white font-bold">Participant Peer Voting (30% weight)</span> to ensure grassroots gamer endorsement alongside technical scrutiny.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2">
                <span className="text-[#00b4d8] font-bold font-sans text-sm">01. Theme Adherence</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  How creatively and fundamentally does the game mechanic reflect the Dec 11 secret theme?
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
                <span className="text-[#00b4d8] font-bold font-sans text-sm">04. Stage Presentation</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Clarity of the 3-minute pitch demo and technical poise during the 2-minute judge Q&amp;A.
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
              Registrations Close Dec 11 · 18:00 IST
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Forge Your Reality at SIET XR Lab
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              Assemble your squad of 3 or 4 students. Lock in your registration (₹800/head) to secure full meals, lab workstation access, and entry into the Valorant &amp; FC 26 tournament showdowns.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-[#00b4d8] hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                Register Team (₹800/Head)
              </button>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Enter Discord Server
              </a>
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
