"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import { Monitor, Layers, Gamepad2, FlaskConical, Diamond } from "lucide-react";
import Image from "next/image";
import EyeFollowButton from "@/components/ui/EyeFollowButton";
import { useSplashState } from "@/hooks/useSplashState";
import ExpandedCardSection from "@/components/ui/SpatialCarousel";
import PixelHoverCard from "@/components/ui/PixelHoverCard";
import ArcCarousel from "@/components/ui/ArcCarousel";
import ArtworkPinBoard from "@/components/ui/ArtworkPinBoard";
import { FOUNDERS, DISCORD_INVITE_URL } from "@/constants";
import { Founder } from "@/types";
import { submitContactInquiry } from "@/lib/sheets";




// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 4, suffix: "+", label: "Platforms" },
  { value: 100, suffix: "%", label: "Passion Driven" },
];

const TICKER_ITEMS = [
  "PC GAME DEVELOPMENT", "PHYSICS-DRIVEN MECHANICS", "CO-OP MULTIPLAYER",
  "GAME AI & LOGIC", "UNITY & GODOT ENGINES", "TECHNICAL ART & SHADERS",
  "C# DEVELOPMENT"
];

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, value]);

  return (
    <div ref={ref} className="tabular-nums font-[family-name:var(--font-tech)]">
      {count}{suffix}
    </div>
  );
}

// Removed unused ProjectCard function

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  const splashDone = useSplashState();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Cursor and Tilt Interaction
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springConfig = { damping: 20, stiffness: 100, mass: 1 };
  const mouseXSpring = useSpring(0, springConfig);
  const mouseYSpring = useSpring(0, springConfig);

  const handleMouseMove = (x: number, y: number) => {
    setMousePos({ x, y });
    const tiltX = (x / window.innerWidth - 0.5) * 20; // max 10 deg tilt
    const tiltY = (y / window.innerHeight - 0.5) * -20;
    mouseXSpring.set(tiltX);
    mouseYSpring.set(tiltY);
  };

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactStatus("idle");
    try {
      await submitContactInquiry({
        ...contactForm,
        submittedAt: new Date().toISOString(),
      });
      setContactStatus("success");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setContactStatus("error");
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <main onMouseMove={(e) => handleMouseMove(e.clientX, e.clientY)} className="bg-[#0a0a0a] text-white overflow-hidden font-[family-name:var(--font-anta)]">

      {/* ═══════════════════════════════════════════
          1. HERO — STARFIELD + CINEMATIC REVEAL
      ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-radial-hero pointer-events-none z-10" />

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Horizontal scan lines */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
          }}
        />

        <motion.div
          className="relative z-20 text-center px-6"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Studio tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={splashDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-[#00b4d8]" />
            <span className="font-[family-name:var(--font-vt)] text-lg font-bold uppercase tracking-[0.4em] text-[#00b4d8]">
              Interactive Studio
            </span>
            <div className="w-8 h-px bg-[#00b4d8]" />
          </motion.div>

          {/* Main title with glow */}
          <motion.h1
            initial={{ opacity: 0, y: 80, filter: "blur(20px)" }}
            animate={splashDone ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 80, filter: "blur(20px)" }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative font-[family-name:var(--font-tech)] text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] tracking-tight uppercase leading-none mb-0 group"
          >
            <span
              className="relative inline-block"
              style={{
                textShadow: "0 0 80px rgba(0,180,216,0.35), 0 0 160px rgba(0,180,216,0.15)",
              }}
            >
              Outer
            </span>
            <span
              className="relative inline-block gazers-outline"
              data-text="Gazers"
            >
              Gazers
            </span>
          </motion.h1>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={splashDone ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
            className="h-[1px] w-full max-w-lg mx-auto my-8 origin-center"
            style={{ background: "linear-gradient(90deg, transparent, #00b4d8, transparent)" }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={splashDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="font-[family-name:var(--font-kode)] text-base md:text-lg font-bold uppercase tracking-[0.4em] text-zinc-400 mb-12"
          >
            Engineering Alternate Realities
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={splashDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#work"
              className="group relative px-10 py-4 overflow-hidden font-bold text-xs uppercase tracking-[0.25em] transition-all duration-500"
              style={{ background: "#00b4d8", color: "#0a0a0a" }}
            >
              <span className="relative z-10">Explore Our Work</span>
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </Link>
            <Link
              href="#contact"
              className="group px-10 py-4 border border-zinc-700 hover:border-[#00b4d8] font-bold text-xs uppercase tracking-[0.25em] text-zinc-400 hover:text-[#00b4d8] transition-all duration-400"
            >
              Initiate Contact
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={splashDone ? { opacity: 1 } : { opacity: 0 }}
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

      {/* ═══════════════════════════════════════════
          2. SCROLLING MARQUEE TICKER
      ═══════════════════════════════════════════ */}
      <div className="relative z-20 bg-[#0a0a0a] border-y border-zinc-800 py-4 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="flex whitespace-nowrap gap-0"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="font-[family-name:var(--font-vt)] inline-flex items-center gap-6 px-6 text-xl font-bold uppercase tracking-[0.35em] text-zinc-500"
            >
              {item}
              <Diamond className="w-3 h-3 text-[#00b4d8]" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          3. FEATURED PROJECTS -> OUR WORK
      ═══════════════════════════════════════════ */}
      <section id="work" className="relative z-20 bg-[#0a0a0a] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
          >
            <div>
              <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-4">
                — Selected Works
              </p>
              <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-7xl font-bold tracking-tight leading-none">
                Our Work
              </h2>
            </div>
          </motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-0">
          <ExpandedCardSection 
            className="z-30"
            items={[
              { type: "project", title: "Virtual Lab", tag: "Next-Gen EdTech", description: "A training simulation that transforms traditional chemistry education. By leveraging Meta Quest's spatial capabilities, it allows students to perform repeatable, physics-accurate experiments in a hazard-free digital laboratory.", link: "#", mediaUrl: "/images/ChemLab.jpg", mediaType: "image" },
              { type: "project", title: "Fake It Till You Sink", tag: "Chaotic Co-Op", description: "Grab your friends and try to keep a yacht from going under. Work together to steer the ship, manage repairs, and survive the elements before the whole thing sinks.", link: "#", mediaUrl: "/videos/fake-it-till-you-sink.mp4", mediaType: "video" },
              { type: "project", title: "MR Zombie Shooter", tag: "MR Game", description: "A mixed reality survival shooter leveraging Meta Quest 3 spatial mapping and passthrough.", link: "#", mediaUrl: "/videos/MR_Game.mp4", mediaType: "video" },
              { type: "project", title: "Echoes of Reality", tag: "Android Mobile", description: "An immersive mobile experience exploring the echoes of reality.", link: "#", mediaUrl: "/videos/MobileGame.mp4", mediaType: "video" },
              { type: "project", title: "BumperBlitz", tag: "Web Game", description: "A fast-paced browser-based bumper car experience with physics-driven arena combat.", link: "https://sudo-sidd.itch.io/bumperblitz", mediaUrl: "/images/bumperblitz.png", mediaType: "image" },
            ]}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. STATS BAR
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 border-y border-zinc-900 bg-[#0d0d0d] py-20 px-6 md:px-12 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full blur-[120px] bg-[#00b4d8]/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 relative">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2"
                style={{ color: "#00b4d8" }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-[family-name:var(--font-kode)] text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4.5. ARTWORK PIN BOARD GALLERY
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] py-32 overflow-hidden border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-4">
              — Visual Arts
            </p>
            <h2 className="font-[family-name:var(--font-tech)] text-4xl md:text-6xl font-bold tracking-tight leading-none">
              Creative Showcase
            </h2>
          </motion.div>
        </div>
        
        <ArtworkPinBoard 
          items={[
            { mediaUrl: "/videos/screen_recording.mp4", mediaType: "video", title: "Visual Demo", tag: "Gameplay" },
            { mediaUrl: "/videos/urban_alley.mov", mediaType: "video", title: "Urban Alley", tag: "Environment" },
            { mediaUrl: "/videos/videoplayback.webm", mediaType: "video", title: "Action Showcase", tag: "Trailer" },
          ]}
        />
      </section>


      {/* ═══════════════════════════════════════════
          6. MANIFESTO / CTA
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] py-36 px-6 md:px-12 overflow-hidden">
        {/* Big background text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span
            className="font-[family-name:var(--font-tech)] text-[15vw] font-bold tracking-tight text-white/[0.025] whitespace-nowrap"
          >
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
              — Studio Manifesto
            </p>

            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-6">
              We don&apos;t just build{" "}
              <span
                className="relative inline-block"
                style={{ textShadow: "0 0 60px rgba(0,180,216,0.4)" }}
              >
                software.
              </span>
            </h2>
            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-16">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(0,180,216,0.7)" }}
              >
                We engineer realities.
              </span>
            </h2>

            {/* Horizontal rule with glow */}
            <div
              className="h-px w-32 mx-auto mb-16"
              style={{ background: "linear-gradient(90deg, transparent, #00b4d8, transparent)" }}
            />

            <div className="flex flex-col items-center justify-center">
              <EyeFollowButton href="#contact" text="Start a Project" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. ABOUT SECTION
      ═══════════════════════════════════════════ */}
      <section id="about" className="relative z-20 bg-[#0a0a0a] py-32 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-4">
              — The Studio
            </p>
            <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-7xl font-bold tracking-tight leading-none mb-10">
              About Us
            </h2>
            <p className="text-xl md:text-3xl text-zinc-400 font-light max-w-4xl leading-relaxed">
              OuterGazers is a vanguard interactive studio engineering the next generation of realities. We build across four frontiers: PC, Android, Augmented Reality, and Meta Quest VR.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-sm font-bold tracking-widest text-zinc-500 uppercase">
              // The Team
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FOUNDERS.map((founder, index) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <PixelHoverCard
                  name={founder.name}
                  role={founder.role}
                  domain={founder.domain}
                  imageUrl={founder.profilePhotoUrl}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. CONTACT SECTION
      ═══════════════════════════════════════════ */}
      <section id="contact" className="relative z-20 bg-[#0a0a0a] py-32 px-6 md:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col justify-center"
            >
              <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-4">
                — Comms Open
              </p>
              <h2 className="font-[family-name:var(--font-tech)] text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-6">
                Get in<br />Touch
              </h2>
              <div className="h-1 w-24 bg-[#00b4d8] mb-10"></div>
              <p className="text-xl text-zinc-400 font-light mb-12 max-w-md leading-relaxed">
                Whether you are looking to collaborate on a new reality, inquire about our PC and VR pipelines, or join the vanguard—our comms are open.
              </p>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Headquarters
                  </h3>
                  <p className="text-lg text-white">
                    OuterGazers Studio<br />
                    Coimbatore, Tamil Nadu<br />
                    India
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Direct Line
                  </h3>
                  <a href="mailto:connect@outergazer.in" className="text-lg text-white hover:text-[#00b4d8] transition-colors">
                    connect@outergazer.in
                  </a>
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t border-zinc-800">
                  <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4">
                    Comms Channels
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-[#5865F2] transition-all duration-300 group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-widest">Discord</span>
                    </a>

                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-[#00b4d8] transition-all duration-300 group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
                    </a>
                    
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-[#00b4d8] transition-all duration-300 group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-widest">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 rounded-lg backdrop-blur-sm"
            >
              <form className="space-y-8" onSubmit={handleContactSubmit}>
                {contactStatus === "success" && (
                  <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Transmission received! Our team will respond to your comms shortly.</span>
                  </div>
                )}
                {contactStatus === "error" && (
                  <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                    Comms error. Please email directly at connect@outergazer.in.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                      placeholder="Name"
                    />
                    <label className="absolute left-0 top-3 text-zinc-500 text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#00b4d8] peer-valid:-top-4 peer-valid:text-[10px] font-bold">
                      Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                      placeholder="Email"
                    />
                    <label className="absolute left-0 top-3 text-zinc-500 text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#00b4d8] peer-valid:-top-4 peer-valid:text-[10px] font-bold">
                      Email
                    </label>
                  </div>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                    placeholder="Subject"
                  />
                  <label className="absolute left-0 top-3 text-zinc-500 text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#00b4d8] peer-valid:-top-4 peer-valid:text-[10px] font-bold">
                    Subject
                  </label>
                </div>
                <div className="relative group">
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:outline-none focus:border-white transition-colors peer placeholder-transparent resize-none"
                    placeholder="Message"
                  ></textarea>
                  <label className="absolute left-0 top-3 text-zinc-500 text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#00b4d8] peer-valid:-top-4 peer-valid:text-[10px] font-bold">
                    Message
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-[#00b4d8] transition-colors flex justify-center items-center group relative overflow-hidden disabled:opacity-50"
                >
                  <span className="relative z-10">{contactSubmitting ? "Transmitting..." : "Send Message"}</span>
                  <div className="absolute inset-0 h-full w-0 bg-[#00b4d8] group-hover:w-full transition-all duration-500 ease-out z-0"></div>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
}
