"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCelebrationStore } from "../store/useCelebrationStore";

export default function GiftReveal() {
  const [isOpened, setIsOpened] = useState(false);
  const { triggerConfetti, triggerFireworks } = useCelebrationStore();

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    triggerConfetti();
    setTimeout(() => triggerFireworks(), 600);
  };

  return (
    <section className="relative min-h-[80vh] w-full flex flex-col items-center justify-center bg-black py-24 px-6 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,182,193,0.1)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="glass-card relative z-10 w-full max-w-lg p-10 md:p-14 text-center flex flex-col items-center"
      >
        <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-300 mb-10 tracking-wide">
          One Last Surprise
        </h2>

        {/* 3D CSS Gift Box (Animated on hover, stops when opened) */}
        <div 
          onClick={handleOpen}
          className={`relative w-40 h-40 md:w-48 md:h-48 mb-8 select-none ${!isOpened ? "gift-container" : "gift-opened"}`}
        >
          {/* Box Base */}
          <div className="absolute bottom-0 w-full h-32 md:h-40 bg-gradient-to-br from-pink-500 via-rose-600 to-pink-700 rounded-b-md shadow-2xl overflow-hidden border border-pink-400/30">
            {/* Vertical Ribbon */}
            <div className="absolute top-0 bottom-0 left-1/2 -ml-3 w-6 bg-amber-400 shadow-[0_0_10px_rgba(0,0,0,0.2)]" />
            {/* Horizontal Ribbon */}
            <div className="absolute left-0 right-0 top-1/2 -mt-3 h-6 bg-amber-400 shadow-[0_0_10px_rgba(0,0,0,0.2)]" />
          </div>

          {/* Lid (Animates up when opened) */}
          <motion.div
            animate={isOpened ? { y: -100, opacity: 0, rotate: 15 } : { y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-4 md:top-2 -left-2 -right-2 h-12 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600 rounded-sm shadow-xl z-20 border border-pink-300/30"
          >
            {/* Vertical ribbon on lid */}
            <div className="absolute top-0 bottom-0 left-1/2 -ml-3 w-6 bg-amber-400" />
            
            {/* Bow */}
            <div className="absolute -top-12 left-1/2 -ml-8 w-16 h-14 flex justify-between items-end pb-1">
              <div className="w-8 h-10 bg-amber-400 rounded-full rotate-[-45deg] border-2 border-amber-300 origin-bottom-right" />
              <div className="w-8 h-10 bg-amber-400 rounded-full rotate-[45deg] border-2 border-amber-300 origin-bottom-left" />
            </div>
          </motion.div>

          {/* Sparkles burst on open */}
          <AnimatePresence>
            {isOpened && (
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="sparkle"
                    style={{
                      left: `${50 + (Math.random() * 100 - 50)}%`,
                      top: `${50 + (Math.random() * 100 - 50)}%`,
                      animationDelay: `${Math.random() * 0.2}s`
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Revealed Message */}
        <AnimatePresence mode="wait">
          {!isOpened ? (
            <motion.p
              key="hint"
              exit={{ opacity: 0, y: 10 }}
              className="text-zinc-400 font-medium tracking-widest uppercase text-sm"
            >
              Click to open
            </motion.p>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", damping: 15 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                A Lifetime of Friendship
              </h3>
              <p className="text-pink-200/90 leading-relaxed mb-8 max-w-sm">
                The greatest gift is having you as a friend. Here&apos;s to many more years of laughter, joy, and unforgettable memories!
              </p>
              
              <button
                onClick={() => {
                  triggerConfetti();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(251,191,36,0.4)]"
              >
                Replay the Magic ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
