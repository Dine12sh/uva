"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { useCelebrationStore } from "../../store/useCelebrationStore";
import { ScratchCard } from "./ScratchCard";

interface MemoryRevealHeroProps {
  onExplode: () => void;
}

const MEMORIES = [
  { id: 1, x: -30, y: -20, z: -100, rotate: -15, scale: 0.8, url: "/media/IMG-20251207-WA0025.jpg", caption: "Our first trip ✈️" },
  { id: 2, x: 40, y: -30, z: -150, rotate: 10, scale: 0.6, url: "/media/IMG_20260613_223016.jpg", caption: "Movie nights 🍿" },
  { id: 3, x: -40, y: 30, z: -50, rotate: -5, scale: 0.9, url: "/media/IMG_20260614_144734~2.jpg", caption: "Dinner dates 🍷" },
  { id: 4, x: 30, y: 20, z: -200, rotate: 20, scale: 0.7, url: "/media/IMG_20260614_180206.jpg", caption: "That random Tuesday ✨" },
  { id: 5, x: 0, y: -40, z: -80, rotate: 5, scale: 0.85, url: "/media/IMG_20260614_180315.jpg", caption: "Forever & Always ❤️" },
];

export const MemoryRevealHero = React.memo(function MemoryRevealHero({ onExplode }: MemoryRevealHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const [revealedCount, setRevealedCount] = useState(0);
  const { triggerBalloons } = useCelebrationStore();

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

  const handleReveal = (index: number) => {
    // Only allow increment if it matches expected sequence
    if (index === revealedCount) {
      setRevealedCount((prev) => prev + 1);
      
      // Minor celebration for unlocking a card
      if (index === 2) {
        triggerBalloons(); // mid-way reward
      }
    }
  };

  const handleExplode = () => {
    if (revealedCount < MEMORIES.length) return; // Prevent early clicking

    // GSAP Timeline for the cinematic explosion
    const tl = gsap.timeline({
      onComplete: () => {
        onExplode(); // Trigger parent scroll/transition
      },
    });

    // Animate central glowing heart expanding wildly
    tl.to(heartRef.current, {
      scale: 40,
      opacity: 0,
      duration: 1.5,
      ease: "power4.inOut",
    });

    // Fly all revealed cards toward the camera (scale up heavily, fade out)
    cardsRef.current?.forEach((card, i) => {
      if (!card) return;
      tl.to(
        card,
        {
          scale: 6,
          z: 800,
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
      className="relative w-full h-screen overflow-hidden flex items-center justify-center perspective-[1200px]"
    >
      {/* 3D Parallax Container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center transform-style-3d"
        style={{
          rotateX: useTransform(smoothScroll, [0, 1], [0, 20]),
          rotateY: useTransform(smoothScroll, [0, 1], [0, -20]),
          z: useTransform(smoothScroll, [0, 1], [0, -300]),
        }}
      >
        {/* Floating Scratch Cards */}
        {MEMORIES.map((mem, index) => {
          const isRevealed = index < revealedCount;
          const isActive = index === revealedCount;
          const isLocked = index > revealedCount;

          return (
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
              className="absolute flex flex-col items-center justify-center"
              style={{
                x: `${mem.x}vw`,
                y: `${mem.y}vh`,
                z: mem.z,
                rotate: mem.rotate,
                scale: mem.scale,
                // Elevate active card slightly towards user
                translateZ: isActive ? "50px" : "0px",
              }}
            >
              <ScratchCard
                id={mem.id}
                url={mem.url}
                caption={mem.caption}
                isLocked={isLocked}
                isActive={isActive}
                isRevealed={isRevealed}
                onReveal={() => handleReveal(index)}
              />
            </motion.div>
          );
        })}

        {/* Grand Finale Heart Button - Only appears after all are revealed */}
        {revealedCount === MEMORIES.length && (
          <motion.button
            ref={heartRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
            onClick={handleExplode}
            className="absolute z-50 w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-[0_0_80px_rgba(244,63,94,0.6)] hover:shadow-[0_0_120px_rgba(244,63,94,1)] transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-rose-500/40" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-white group-hover:animate-pulse relative z-10"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="absolute -bottom-16 w-max text-white text-lg font-serif tracking-widest animate-pulse drop-shadow-lg">
              Click the Heart
            </span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
});
