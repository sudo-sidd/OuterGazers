"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface ParallaxProduct {
  title: string;
  description?: string;
  tag?: string;
  link: string;
  thumbnail: string;
  mediaType?: "image" | "video";
}

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
  const itemsPerRow = Math.max(5, Math.ceil(products.length / 3));
  const firstRow = products.slice(0, itemsPerRow);
  const secondRow = products.slice(itemsPerRow, itemsPerRow * 2);
  const thirdRow = products.slice(itemsPerRow * 2, itemsPerRow * 3);
  const ref = React.useRef(null);
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
      id={id}
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
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={`r1-${product.title}-${idx}`}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={`r2-${product.title}-${idx}`}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
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
        y: -20,
      }}
      className="group/product h-96 w-[30rem] relative flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl"
    >
      <Link
        href={product.link}
        className="block absolute inset-0 w-full h-full z-10"
      >
        {isVideo ? (
          <video
            src={product.thumbnail}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover object-center absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-105 pointer-events-none"
          />
        ) : (
          <Image
            src={product.thumbnail}
            height={600}
            width={600}
            className="object-cover object-center absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-105"
            alt={product.title}
          />
        )}
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
