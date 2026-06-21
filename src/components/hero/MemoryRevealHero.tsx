"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useCelebrationStore } from "../../store/useCelebrationStore";
import { PolaroidScratchCard } from "./PolaroidScratchCard";

interface MemoryRevealHeroProps {
  onExplode: () => void;
}

const MEMORIES = [
  { id: 1, url: "/media/IMG-20251207-WA0025.jpg", caption: "Our first trip " },
  { id: 2, url: "/media/IMG_20260613_223016.jpg", caption: "Movie nights " },
  { id: 3, url: "/media/IMG_20260614_144734~2.jpg", caption: "Dinner dates " },
  { id: 4, url: "/media/IMG_20260614_180206.jpg", caption: "That random Tuesday " },
  { id: 5, url: "/media/IMG_20260614_180315.jpg", caption: "Forever & Always " },
];

export const MemoryRevealHero = React.memo(function MemoryRevealHero({ onExplode }: MemoryRevealHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = Tap To Begin screen
  const heartRef = useRef<HTMLDivElement>(null);

  const { triggerBalloons, triggerFireworks, triggerHearts, triggerConfetti } = useCelebrationStore();

  const handleNext = () => {
    if (currentIndex < MEMORIES.length - 1) {
      setCurrentIndex((prev) => prev + 1);

      // Minor celebration mid-way
      if (currentIndex === 1) {
        triggerBalloons();
      }
    } else {
      handleExplode();
    }
  };

  const handleExplode = () => {
    // Fire everything!
    triggerFireworks();
    triggerConfetti();
    triggerHearts();

    // GSAP Timeline for the cinematic explosion
    const tl = gsap.timeline({
      onComplete: () => {
        onExplode(); // Trigger parent scroll/transition
      },
    });

    // Animate central glowing heart expanding wildly to swallow the screen
    if (heartRef.current) {
      tl.to(heartRef.current, {
        scale: 30, // Specified by user
        opacity: 1,
        duration: 1.5,
        ease: "power4.inOut",
      });
    }
  };

  const progressPercentage = ((currentIndex + 1) / MEMORIES.length) * 100;

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Dark Luxury Background with Pink/Gold Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.12),transparent_70%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(244,63,94,0.08),transparent_50%)]" />
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Progress Indicator (Hidden on Tap To Begin Screen) */}
      <AnimatePresence>
        {currentIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-10 flex flex-col items-center gap-3 z-50 w-full px-8 max-w-md"
          >
            <span className="text-white/80 font-serif text-lg md:text-xl tracking-widest drop-shadow-md">
              Memory {currentIndex + 1} / {MEMORIES.length}
            </span>
            {/* Animated Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Centered Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          {currentIndex === -1 ? (
            // Tap To Begin Screen
            <motion.div
              key="tap-to-begin"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => setCurrentIndex(0)}
            >
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(244,63,94,0.3)] group-hover:bg-white/10 group-hover:border-pink-400/50 group-hover:shadow-[0_0_80px_rgba(244,63,94,0.6)] transition-all duration-700">
                <div className="absolute inset-0 rounded-full animate-ping bg-rose-500/20" />
                <span className="text-5xl group-hover:scale-110 transition-transform duration-500">💖</span>
              </div>
              <h2 className="mt-8 text-2xl md:text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-white tracking-widest font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                Tap To Begin
              </h2>
            </motion.div>
          ) : (
            // Sequential Polaroid Carousel
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: -50, scale: 0.9, rotate: -5, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute"
            >
              <PolaroidScratchCard
                id={MEMORIES[currentIndex].id}
                url={MEMORIES[currentIndex].url}
                caption={MEMORIES[currentIndex].caption}
                isFinal={currentIndex === MEMORIES.length - 1}
                onNext={handleNext}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Finale Heart (Used for GSAP Explosion) */}
      <div
        ref={heartRef}
        className="absolute z-[100] pointer-events-none opacity-0 flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-16 h-16 text-white drop-shadow-2xl"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>
    </div>
  );
});
