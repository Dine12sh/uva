"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";

interface FloatingMemoriesProps {
  onExplode: () => void;
}

// Replaced placeholder text with actual photos from gallery
const MEMORIES = [
  { id: 1, x: -30, y: -20, z: -100, rotate: -15, scale: 0.8, url: "/media/IMG-20251207-WA0025.jpg" },
  { id: 2, x: 40, y: -30, z: -150, rotate: 10, scale: 0.6, url: "/media/IMG_20260613_223016.jpg" },
  { id: 3, x: -40, y: 30, z: -50, rotate: -5, scale: 0.9, url: "/media/IMG_20260614_144734~2.jpg" },
  { id: 4, x: 30, y: 20, z: -200, rotate: 20, scale: 0.7, url: "/media/IMG_20260614_180206.jpg" },
  { id: 5, x: 0, y: -40, z: -80, rotate: 5, scale: 0.85, url: "/media/IMG_20260614_180315.jpg" },
];

export function FloatingMemories({ onExplode }: FloatingMemoriesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleExplode = () => {
    // GSAP Timeline for the explosion effect
    const tl = gsap.timeline({
      onComplete: () => {
        onExplode(); // Notify parent to route/scroll down
      },
    });

    // Animate central heart expanding wildly
    tl.to(heartRef.current, {
      scale: 30,
      opacity: 0,
      duration: 1.5,
      ease: "power4.inOut",
    });

    // Fly cards toward the camera (scale up heavily, fade out)
    cardsRef.current?.forEach((card: HTMLDivElement | null, i: number) => {
      if (!card) return;
      tl.to(
        card,
        {
          scale: 5,
          z: 500,
          opacity: 0,
          duration: 1.2,
          ease: "expo.in",
        },
        i * 0.05 // stagger
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center perspective-[1000px]"
    >
      {/* 3D Container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center transform-style-3d"
        style={{
          rotateX: useTransform(smoothScroll, [0, 1], [0, 20]),
          rotateY: useTransform(smoothScroll, [0, 1], [0, -20]),
          z: useTransform(smoothScroll, [0, 1], [0, -300]),
        }}
      >
        {/* Floating Cards */}
        {MEMORIES.map((mem, index) => (
          <motion.div
            key={mem.id}
            ref={(el: HTMLDivElement | null) => {
              if (cardsRef.current) {
                cardsRef.current[index] = el;
              }
            }}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.5 + index * 0.1, duration: 1 },
            }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            className="absolute w-48 h-64 md:w-64 md:h-80 rounded-2xl border border-white/20 bg-zinc-900 shadow-[0_8px_32px_rgba(255,0,100,0.2)] flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
            style={{
              x: `${mem.x}vw`,
              y: `${mem.y}vh`,
              z: mem.z,
              rotate: mem.rotate,
              scale: mem.scale,
            }}
          >
            <Image
              src={mem.url}
              alt={`Memory ${mem.id}`}
              fill
              sizes="(max-width: 768px) 12rem, 16rem"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized
            />
            {/* Glassmorphism Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
          </motion.div>
        ))}

        {/* Center Heart Button */}
        <button
          ref={heartRef}
          onClick={handleExplode}
          className="absolute z-40 w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-[0_0_80px_rgba(244,63,94,0.6)] hover:shadow-[0_0_120px_rgba(244,63,94,0.9)] transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16 text-white group-hover:animate-pulse"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
