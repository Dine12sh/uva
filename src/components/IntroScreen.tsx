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
  const setPlaying = useMusicStore((state) => state.setPlaying);
  
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
  const line1 = "A Special Birthday Surprise";
  const line2 = "For Someone Amazing 🎂✨";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-radial from-slate-950 via-purple-950 to-black text-white">
      {/* Background Star Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-[10%] left-[20%] animate-ping duration-1000 opacity-60" />
        <div className="absolute w-[3px] h-[3px] bg-pink-300 rounded-full top-[30%] left-[80%] animate-pulse duration-2000 opacity-80" />
        <div className="absolute w-[2px] h-[2px] bg-purple-300 rounded-full top-[70%] left-[15%] animate-ping duration-[3000ms] opacity-50" />
        <div className="absolute w-[3px] h-[3px] bg-yellow-200 rounded-full top-[60%] left-[85%] animate-pulse duration-[1500ms] opacity-70" />
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-[40%] left-[50%] animate-pulse duration-[2500ms] opacity-40" />
        
        {/* Soft Aurora Glow Lights */}
        <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-900/20 blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-pink-900/20 blur-[120px] animate-pulse duration-[10000ms]" />
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

      {/* Global CSS for custom animations inside IntroScreen */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
