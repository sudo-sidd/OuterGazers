"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { EventItem } from "@/data/events";
import EventCountdown from "@/components/events/EventCountdown";
import TeamRegistrationModal from "@/components/events/TeamRegistrationModal";

export default function InterCollegeEventDescription({ event }: { event: EventItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0a0a] pb-24 pt-28 text-white">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 transition-colors hover:text-[#00b4d8]"
        >
          <ArrowLeft size={14} /> Back to News &amp; Events
        </Link>

        <section className="relative mb-12 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-black p-8 md:p-14">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#00b4d8] via-[#7c3aed] to-transparent" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <span className="mb-5 inline-flex rounded-full border border-[#00b4d8]/30 bg-[#00b4d8]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00b4d8]">
                {event.badgeText}
              </span>
              <h1 className="mb-5 text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl md:text-7xl">
                {event.title}
              </h1>
              <p className="mb-7 max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
                {event.subtitle}. Build a small game onsite in 24 hours, with five
                themes revealed at the Day 1 kickoff.
              </p>
              <div className="grid gap-3 text-xs text-zinc-300 sm:grid-cols-2">
                <div className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-black/40 p-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[#00b4d8]" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-black/40 p-3">
                  <Calendar size={16} className="mt-0.5 shrink-0 text-[#00b4d8]" />
                  <span>{event.inPersonDates}</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-black/40 p-3">
                  <Users size={16} className="mt-0.5 shrink-0 text-[#00b4d8]" />
                  <span>Undergraduate students · Teams of {event.minTeamSize}–{event.maxTeamSize}</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-black/40 p-3">
                  <Trophy size={16} className="mt-0.5 shrink-0 text-[#00b4d8]" />
                  <span>{event.totalPrizePool} prize pool</span>
                </div>
              </div>
            </div>

            <aside className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00b4d8]">
                Registration · ₹{event.pricePerPerson} / person
              </p>
              <p className="mb-5 text-xs text-zinc-400">
                ₹{event.pricePerPerson * event.minTeamSize}–₹
                {event.pricePerPerson * event.maxTeamSize} per team
              </p>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Registration closes December 2
              </p>
              <EventCountdown targetDate={event.countdownTarget || "2026-12-02T23:59:59+05:30"} />
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#00b4d8] to-[#0096c7] px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-black transition-colors hover:from-white hover:to-zinc-200"
              >
                <Sparkles size={16} /> Register Team
              </button>
            </aside>
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00b4d8]">
              Jam format
            </p>
            <h2 className="mb-4 text-2xl font-bold">24 hours to make a game</h2>
            <p className="mb-5 text-sm leading-relaxed text-zinc-400">
              The onsite jam begins at 9:00 AM on December 15. The five themes
              are announced at kickoff. Build onsite through the 24-hour jam;
              development ends at 9:00 AM on December 16, with a final submission
              window until 10:00 AM. Results will be announced by noon.
            </p>
            <div className="rounded-lg border border-[#00b4d8]/30 bg-[#00b4d8]/5 p-4 text-sm text-zinc-200">
              <strong className="text-[#00b4d8]">Themes:</strong> Five official
              themes revealed at the event. The brief does not list them before
              the Day 1 kickoff.
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00b4d8]">
              Included in registration
            </p>
            <h2 className="mb-4 text-2xl font-bold">Two days at the XR Lab</h2>
            <ul className="space-y-3">
              {event.inclusions.map((inclusion) => (
                <li key={inclusion} className="flex gap-2 text-sm text-zinc-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                  {inclusion}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00b4d8]">
              Prize Pool
            </p>
            <h2 className="mt-2 text-3xl font-bold">₹18,000 estimated prize pool</h2>
            <p className="mt-2 text-xs text-zinc-500">
              Prize pool estimate based on planned registrations.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {event.prizes.map((prize) => (
              <article
                key={prize.place}
                className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6"
              >
                <Trophy size={20} className="mb-4 text-[#00b4d8]" />
                <h3 className="text-lg font-bold">{prize.place}</h3>
                <p className="my-3 text-3xl font-bold text-[#00b4d8]">{prize.reward}</p>
                <ul className="space-y-2 text-xs text-zinc-400">
                  {prize.perks.map((perk) => <li key={perk}>{perk}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="mb-6 text-3xl font-bold">Schedule</h2>
          <div className="space-y-3">
            {event.schedule.map((phase) => (
              <article
                key={phase.phase}
                className="grid gap-2 rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 md:grid-cols-[15rem_1fr] md:gap-6"
              >
                <div>
                  <h3 className="font-bold text-white">{phase.phase}</h3>
                  <p className="mt-1 text-xs text-[#00b4d8]">{phase.time}</p>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">{phase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 text-3xl font-bold">Rules &amp; Disclaimer</h2>
            <ol className="space-y-3">
              {event.rules.map((rule, index) => (
                <li key={rule} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                  <span className="font-mono text-[#00b4d8]">{String(index + 1).padStart(2, "0")}</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="mb-5 text-3xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {event.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-xl border border-zinc-800 bg-zinc-950/70 p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-white">
                    {faq.question}
                    <ChevronDown size={16} className="shrink-0 text-[#00b4d8] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 text-center md:p-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#00b4d8]">
            December 15–16 · SIET XR Lab
          </p>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Make something in 24 hours.</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00b4d8] px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-black transition-colors hover:bg-white"
          >
            <Sparkles size={16} /> Register Team · ₹500 per person
          </button>
        </section>
      </div>

      <TeamRegistrationModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
