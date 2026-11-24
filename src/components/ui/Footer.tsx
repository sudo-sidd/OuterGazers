"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
export default function Footer() {
  const pathname = usePathname();

  // The footer should not appear in the secure admin sectors
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  const linkVariants = {
    hover: { x: 5, color: "#00b4d8", transition: { duration: 0.3 } },
    initial: { x: 0, color: "#71717a" }, // zinc-500
  };

  return (
    <footer className="bg-[#0d0d0d] border-t border-zinc-800 pt-24 pb-8 overflow-hidden relative z-10 text-[#f0f0f0]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          
          {/* Column 1: Studio Identity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <Image src="/images/logo_v2.png" alt="OuterGazers Logo" width={80} height={80} className="w-20 h-20 object-contain" />
              <h2 className="text-2xl font-extrabold uppercase tracking-tighter text-white">
                OuterGazers
              </h2>
            </div>
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest leading-relaxed mb-6 max-w-xs">
              Engineering alternate realities through code and spatial design.
            </p>
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Coimbatore, Tamil Nadu<br />
              India
            </div>
          </motion.div>

          {/* Column 2: Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col"
          >
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-6">
              Directives
            </h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li>
                <Link href="/">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    Home
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/#work">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    Our Work
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/#about">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    About
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/news">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    News
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/#contact">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    Contact
                  </motion.div>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Sectors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-6">
              Active Frontiers
            </h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li>
                <Link href="/#work">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    PC Gaming
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/#work">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    Meta Quest VR
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/#work">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    Augmented Reality
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/#work">
                  <motion.div initial="initial" whileHover="hover" variants={linkVariants} className="inline-block cursor-pointer">
                    Android Mobile
                  </motion.div>
                </Link>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Legal, Copyright & Discreet Admin Link */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left border-t border-zinc-800 pt-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500 gap-4 md:gap-0">
          <p>© {new Date().getFullYear()} OuterGazers Studio. All Rights Reserved.</p>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-[#00b4d8] transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-[#00b4d8] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Background Watermark */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none z-0 flex justify-center translate-y-1/4">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.03 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-[15vw] font-extrabold uppercase tracking-tighter text-white whitespace-nowrap"
        >
          OUTERGAZERS
        </motion.span>
      </div>
    </footer>
  );
}