"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DISCORD_INVITE_URL } from "@/constants";
import EventAnnouncementPopup from "@/components/events/EventAnnouncementPopup";

const NAV_LINKS = [
  { name: "Our Work", href: "/#work" },
  { name: "About", href: "/#about" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 1. Detect scroll position for the cinematic glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Close mobile menu automatically when the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // 3. Safe early return AFTER all hooks have been initialized unconditionally
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <>
      <EventAnnouncementPopup />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-md border-zinc-800 py-4 shadow-sm"
            : "bg-transparent border-transparent py-8"
        }`}
      >
        <div className="w-full px-5 md:px-8 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <Link href="/" className="relative z-50 group flex items-center gap-3">
            <Image src="/images/logo_v2.png" alt="OuterGazers Logo" width={56} height={56} className="w-14 h-14 object-contain" />
            <div>
              <span className="text-xl font-extrabold tracking-tighter uppercase text-white">
                OuterGazers
              </span>
              <div className="h-0.5 w-0 bg-[#00b4d8] group-hover:w-full transition-all duration-500 ease-out mt-1"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/news" && (pathname?.startsWith("/news") || pathname?.startsWith("/events")));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 relative group ${
                    isActive ? "text-white" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {link.name}
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00b4d8] rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            {/* Discord Community Link */}
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5865F2]/10 hover:bg-[#5865F2] text-[#5865F2] hover:text-white border border-[#5865F2]/30 text-[11px] font-bold uppercase tracking-wider transition-all duration-300"
            >
              <span>Discord</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50 text-xs font-bold uppercase tracking-widest text-white focus:outline-none"
          >
            <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="absolute right-0 top-1/2 -translate-y-1/2">
              Menu
            </motion.span>
            <motion.span animate={{ opacity: mobileMenuOpen ? 1 : 0 }} className="absolute right-0 top-1/2 -translate-y-1/2">
              Close
            </motion.span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-center items-center px-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent pointer-events-none" />
            
            <ul className="space-y-10 text-center relative z-10">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    className={`text-3xl font-extrabold uppercase tracking-widest ${
                      pathname === link.href ? "text-white" : "text-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-extrabold uppercase tracking-widest text-[#5865F2] hover:text-white"
                >
                  Discord Server
                </a>
              </motion.li>
            </ul>

            {/* Mobile Menu Decorative Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute bottom-12 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center"
            >
              OuterGazers Studio
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}