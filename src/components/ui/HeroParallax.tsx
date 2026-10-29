"use client";
import React, { useState, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Grid, LayoutGrid } from "lucide-react";
import { AsciiMedia } from "@/components/ui/AsciiMediaLoader";

export interface ParallaxProduct {
  title: string;
  description?: string;
  tag?: string;
  link: string;
  thumbnail: string;
  mediaType?: "image" | "video";
}

// ─── Main HeroParallax Component ─────────────────────────────────────────────
export const HeroParallax = ({
  products,
  id = "work",
  headerTag,
  headerTitle,
  headerDescription,
}: {
  products: ParallaxProduct[];
  id?: string;
  headerTag?: string;
  headerTitle?: React.ReactNode;
  headerDescription?: string;
}) => {
  return (
    <>
      {/* ── MOBILE VIEW (< md) : Touch-First, Silky-Smooth Showcase ── */}
      <div className="block md:hidden">
        <MobileWorksShowcase
          products={products}
          headerTag={headerTag}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
        />
      </div>

      {/* ── DESKTOP VIEW (>= md) : Cinematic 3D Parallax ── */}
      <div className="hidden md:block">
        <DesktopParallax
          products={products}
          headerTag={headerTag}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
        />
      </div>
    </>
  );
};

// ─── Desktop 3D Parallax ─────────────────────────────────────────────────────
const DesktopParallax = ({
  products,
  headerTag,
  headerTitle,
  headerDescription,
}: {
  products: ParallaxProduct[];
  headerTag?: string;
  headerTitle?: React.ReactNode;
  headerDescription?: string;
}) => {
  const itemsPerRow = Math.max(5, Math.ceil(products.length / 3));
  const firstRow = products.slice(0, itemsPerRow);
  const secondRow = products.slice(itemsPerRow, itemsPerRow * 2);
  const thirdRow = products.slice(itemsPerRow * 2, itemsPerRow * 3);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header
        tag={headerTag}
        title={headerTitle}
        description={headerDescription}
      />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 lg:space-x-8 xl:space-x-10 mb-8 lg:mb-12">
          {firstRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={`r1-${product.title}-${idx}`}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-8 lg:mb-12 space-x-6 lg:space-x-8 xl:space-x-10">
          {secondRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={`r2-${product.title}-${idx}`}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 lg:space-x-8 xl:space-x-10">
          {thirdRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={`r3-${product.title}-${idx}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// ─── Mobile Works Showcase ───────────────────────────────────────────────────
export const MobileWorksShowcase = ({
  products,
  headerTag,
  headerTitle,
  headerDescription,
}: {
  products: ParallaxProduct[];
  headerTag?: string;
  headerTitle?: React.ReactNode;
  headerDescription?: string;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"reel" | "grid">("reel");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract distinct unique projects by title
  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    const list: ParallaxProduct[] = [];
    for (const p of products) {
      if (!seen.has(p.title)) {
        seen.add(p.title);
        list.push(p);
      }
    }
    return list;
  }, [products]);

  // Extract category tags
  const categories = useMemo(() => {
    const tags = new Set<string>();
    for (const p of uniqueProducts) {
      if (p.tag) tags.add(p.tag);
    }
    return ["All", ...Array.from(tags)];
  }, [uniqueProducts]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return uniqueProducts;
    return uniqueProducts.filter((p) => p.tag === selectedCategory);
  }, [uniqueProducts, selectedCategory]);

  // Track active slide in horizontal reel
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = (el.firstElementChild as HTMLElement)?.offsetWidth || 300;
    const gap = 16;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(0, idx), filteredProducts.length - 1));
  };

  const scrollToIndex = (idx: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const card = el.children[idx] as HTMLElement | undefined;
    if (card) {
      card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const nextSlide = () => {
    if (activeIndex < filteredProducts.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  return (
    <div className="py-16 px-4 bg-transparent relative overflow-hidden">
      {/* Background glow blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[120px] bg-[#00b4d8]/10 pointer-events-none" />

      {/* Header */}
      <div className="mb-8">
        <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.35em] text-[#00b4d8] mb-3">
          {headerTag || "— Selected Works"}
        </p>
        <h2 className="text-3xl font-extrabold text-white font-[family-name:var(--font-tech)] tracking-tight leading-tight mb-4">
          {headerTitle || "Where real-time art meets responsive gameplay."}
        </h2>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed">
          {headerDescription ||
            "We build stylized games, real-time 3D environments, and interactive XR experiences."}
        </p>
      </div>

      {/* Controls: Category Filter Chips & View Mode Toggle */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveIndex(0);
                  if (scrollRef.current) scrollRef.current.scrollLeft = 0;
                }}
                className={`text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-300 shrink-0 ${
                  isSelected
                    ? "bg-[#00b4d8] text-black shadow-[0_0_15px_rgba(0,180,216,0.5)]"
                    : "bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Switcher & Slide Counter */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 font-bold">
            SHOWING <span className="text-[#00b4d8]">{filteredProducts.length}</span> PROJECTS
          </div>
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setViewMode("reel")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "reel" ? "bg-zinc-800 text-[#00b4d8]" : "text-zinc-500"
              }`}
              title="Carousel View"
              aria-label="Carousel View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid" ? "bg-zinc-800 text-[#00b4d8]" : "text-zinc-500"
              }`}
              title="List View"
              aria-label="List View"
            >
              <Grid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── VIEW 1: HORIZONTAL SWIPE REEL ── */}
      {viewMode === "reel" ? (
        <div>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none scroll-smooth touch-pan-x"
          >
            {filteredProducts.map((product, idx) => (
              <MobileProductCard
                key={`mobile-${product.title}-${idx}`}
                product={product}
                isFullWidth={false}
              />
            ))}
          </div>

          {/* Navigation Controls & Dot Indicators */}
          <div className="flex items-center justify-between mt-3 px-1">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {filteredProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? "w-6 bg-[#00b4d8] shadow-[0_0_8px_rgba(0,180,216,0.8)]"
                      : "w-1.5 bg-zinc-700"
                  }`}
                  aria-label={`Jump to project ${i + 1}`}
                />
              ))}
            </div>

            {/* Slide Arrows & Counter */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">
                <span className="text-[#00b4d8]">0{activeIndex + 1}</span> / 0{filteredProducts.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevSlide}
                  disabled={activeIndex === 0}
                  className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/90 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none hover:border-[#00b4d8] transition-colors"
                  aria-label="Previous Project"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={activeIndex === filteredProducts.length - 1}
                  className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/90 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none hover:border-[#00b4d8] transition-colors"
                  aria-label="Next Project"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── VIEW 2: VERTICAL STACK / GRID ── */
        <div className="flex flex-col gap-5">
          {filteredProducts.map((product, idx) => (
            <MobileProductCard
              key={`mobile-grid-${product.title}-${idx}`}
              product={product}
              isFullWidth={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Single Mobile Product Card ──────────────────────────────────────────────
const MobileProductCard = ({
  product,
  isFullWidth = false,
}: {
  product: ParallaxProduct;
  isFullWidth?: boolean;
}) => {
  const isVideo =
    product.mediaType === "video" ||
    /\.(mp4|webm|mov|ogg)$/i.test(product.thumbnail);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl flex flex-col justify-end ${
        isFullWidth
          ? "w-full h-[380px]"
          : "w-[84vw] max-w-[340px] h-[390px] shrink-0 snap-center"
      }`}
    >
      {/* Media Background with ASCII Loading Placeholder */}
      <div className="absolute inset-0 w-full h-full">
        <AsciiMedia
          mediaType={isVideo ? "video" : "image"}
          src={product.thumbnail}
          alt={product.title}
          className="object-cover object-center absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Top subtle badge indicating media type */}
      <div className="absolute top-4 right-4 z-20">
        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
          {isVideo ? "Video" : "Still"}
        </span>
      </div>

      {/* Bottom high-contrast gradient overlay */}
      <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/80 to-transparent pt-16">
        {product.tag && (
          <span className="inline-block px-2.5 py-0.5 mb-2 text-[10px] font-bold tracking-widest uppercase rounded bg-[#00b4d8]/20 text-[#00b4d8] border border-[#00b4d8]/40">
            {product.tag}
          </span>
        )}
        <h3 className="text-xl font-bold font-[family-name:var(--font-tech)] text-white tracking-wide leading-snug">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-xs text-zinc-300 line-clamp-3 mt-1.5 font-sans leading-relaxed">
            {product.description}
          </p>
        )}
        {product.link && product.link !== "#" && (
          <div className="mt-3">
            <Link
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00b4d8] text-black text-[11px] font-bold tracking-wider uppercase hover:bg-white transition-colors"
            >
              <span>Explore Project</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────
export const Header = ({
  tag,
  title,
  description,
}: {
  tag?: string;
  title?: React.ReactNode;
  description?: string;
} = {}) => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 z-10">
      {tag && (
        <p className="font-[family-name:var(--font-kode)] text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b4d8] mb-4">
          {tag}
        </p>
      )}
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white font-[family-name:var(--font-tech)]">
        {title || (
          <>
            Where real-time art <br /> meets responsive gameplay.
          </>
        )}
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        {description ||
          "We build stylized games, real-time 3D environments, and interactive XR experiences where mechanics and atmosphere lead."}
      </p>
    </div>
  );
};

// ─── Desktop ProductCard ─────────────────────────────────────────────────────
export const ProductCard = ({
  product,
  translate,
}: {
  product: ParallaxProduct;
  translate: MotionValue<number>;
}) => {
  const isVideo =
    product.mediaType === "video" ||
    /\.(mp4|webm|mov|ogg)$/i.test(product.thumbnail);

  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -16,
      }}
      className="group/product h-80 lg:h-[22rem] xl:h-[24rem] w-[22rem] lg:w-[25rem] xl:w-[27rem] relative flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl"
    >
      <Link
        href={product.link}
        className="block absolute inset-0 w-full h-full z-10"
      >
        <AsciiMedia
          mediaType={isVideo ? "video" : "image"}
          src={product.thumbnail}
          alt={product.title}
          className="object-cover object-center absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-105 pointer-events-none"
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-25 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300 z-10" />
      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-20">
        {product.tag && (
          <span className="inline-block px-2.5 py-0.5 mb-2 text-[10px] font-bold tracking-widest uppercase rounded bg-[#00b4d8]/20 text-[#00b4d8] border border-[#00b4d8]/40">
            {product.tag}
          </span>
        )}
        <h2 className="text-lg md:text-xl font-bold font-[family-name:var(--font-tech)] text-white tracking-wide group-hover/product:text-[#00b4d8] transition-colors duration-300">
          {product.title}
        </h2>
        {product.description && (
          <p className="text-xs text-zinc-300 line-clamp-2 mt-1.5 opacity-85 group-hover/product:opacity-100 transition-opacity font-sans">
            {product.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default HeroParallax;

