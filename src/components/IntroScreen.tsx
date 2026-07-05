// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicStore } from "../store/useMusicStore";
import { useCelebrationStore } from "../store/useCelebrationStore";

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [stage, setStage] = useState<"text" | "gift" | "opening" | "complete">("text");
  // @ts-ignore
  const setPlaying = useMusicStore((state: any) => state.setPlaying);

  const { triggerFireworks, triggerBalloons, triggerConfetti } = useCelebrationStore();

  // Handle auto transitions
  useEffect(() => {
    // Show text first, then show the gift box after 4 seconds
    const timer = setTimeout(() => {
      setStage("gift");
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenGift = () => {
    if (stage !== "gift") return;
    setStage("opening");

    // Start background music (requires user gesture)
    setPlaying(true);

    // Trigger celebrations
    triggerConfetti();
    triggerFireworks();
    triggerBalloons();

    // End opening sequence after camera zoom and fade out
    setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 2500);
  };

  // Split text into lines/words for staggered animations
  const line1 = "A Cutiepie Was Born Today";
  const line2 = "25 Years Ago! 🎂✨";
  const subtitle = "Yes, it's YOU! A little surprise awaits...";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-radial from-slate-950 via-purple-950 to-black text-white">
      {/* Background Star Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="css-particle"
            style={{
              left: `${(i * 13 + 8) % 100}%`,
              top: `${(i * 17 + 5) % 100}%`,
              animationDuration: `${8 + (i % 4) * 3}s`,
              animationDelay: `${(i % 5) * 1.2}s`,
              opacity: 0.3 + (i % 3) * 0.15,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: i % 2 === 0 ? "rgba(255, 182, 193, 0.6)" : "rgba(255, 255, 255, 0.5)",
            }}
          />
        ))}

        {/* Soft Aurora Glow Lights */}
        <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(88,28,135,0.25)_0%,transparent_60%)] animate-pulse duration-[8000ms]" />
        <div className="absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(131,24,67,0.25)_0%,transparent_60%)] animate-pulse duration-[10000ms]" />
      </div>

      <AnimatePresence mode="wait">
        {stage === "text" && (
          <motion.div
            key="text-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center text-center px-6"
          >
            {/* Title Text with letter blur reveal */}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-wider leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200 drop-shadow-[0_0_15px_rgba(255,182,193,0.3)]">
              {line1.split(" ").map((word, wIdx) => (
                <motion.span
                  key={wIdx}
                  className="inline-block mr-3"
                  initial={{ filter: "blur(12px)", opacity: 0, y: 15 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: wIdx * 0.2 }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {line2.split(" ").map((word, wIdx) => (
                <motion.span
                  key={wIdx}
                  className="inline-block mr-3 mt-4"
                  initial={{ filter: "blur(12px)", opacity: 0, y: 15 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 1.0 + wIdx * 0.2 }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.8 }}
              className="mt-8 text-zinc-400 text-lg md:text-xl font-light tracking-wide"
            >
              {subtitle}
            </motion.p>
          </motion.div>
        )}

        {(stage === "gift" || stage === "opening") && (
          <motion.div
            key="gift-stage"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2.5, filter: "blur(15px)" }}
            transition={{ duration: stage === "opening" ? 2.2 : 0.8 }}
            className="relative flex flex-col items-center cursor-pointer select-none z-10"
            onClick={handleOpenGift}
          >
            {/* Pulsing Hint Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-amber-200 font-medium text-lg tracking-widest uppercase mb-12 drop-shadow-md text-center"
            >
              🎁 Click the Gift Box to Open 🎁
            </motion.p>

            {/* Custom 3D CSS Gift Box */}
            <div className={`gift-box-container relative w-44 h-44 transition-transform duration-500 hover:scale-110 active:scale-95 ${stage === "opening" ? "animate-bounce" : ""}`}>
              {/* Lid */}
              <motion.div
                animate={stage === "opening" ? { y: -180, rotate: 45, opacity: 0 } : {}}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="absolute -top-3 left-[-6px] w-[188px] h-12 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600 rounded-t-sm shadow-lg z-20"
              >
                {/* Horizontal ribbon on lid */}
                <div className="absolute top-0 bottom-0 left-[82px] w-6 bg-amber-400 shadow-md" />
                {/* Bow */}
                <div className="absolute -top-10 left-[70px] w-12 h-10 flex justify-between">
                  <div className="w-6 h-10 bg-amber-400 rounded-full rotate-[-45deg] border-2 border-amber-300" />
                  <div className="w-6 h-10 bg-amber-400 rounded-full rotate-[45deg] border-2 border-amber-300" />
                </div>
              </motion.div>

              {/* Box Base */}
              <div className="absolute bottom-0 w-44 h-44 bg-gradient-to-br from-pink-500 via-rose-600 to-pink-700 rounded-b-md shadow-2xl overflow-hidden">
                {/* Vertical Ribbon */}
                <div className="absolute top-0 bottom-0 left-[76px] w-6 bg-amber-400" />
                {/* Horizontal Ribbon */}
                <div className="absolute left-0 right-0 top-[76px] h-6 bg-amber-400" />

                {/* Internal sparkle shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
              </div>
            </div>

            {/* Soft Ambient Gold Glow Ring behind box */}
            <div className="absolute -z-10 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
