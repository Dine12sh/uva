"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCelebrationStore } from "../store/useCelebrationStore";
import Image from "next/image";

const collagePhotos = [
  "/media/25860_ae_lite_edit (1).jpg",
  "/media/IMG_20260613_223016.jpg",
  "/media/IMG_20260614_144734~2.jpg",
  "/media/IMG_20260614_180206.jpg",
  "/media/IMG_20260614_180315.jpg",
  "/media/IMG_20260614_180739.jpg",
  "/media/IMG_20260615_220045.jpg",
  "/media/IMG-20251207-WA0025.jpg",
];

export default function FinalSurprise() {
  const { triggerFireworks, triggerBalloons, triggerConfetti } = useCelebrationStore();
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto-trigger celebration when section scrolls into view
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasCelebrated) {
          setHasCelebrated(true);
          triggerConfetti();
          setTimeout(() => triggerFireworks(), 400);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasCelebrated, triggerConfetti, triggerFireworks]);

  const handleEndingCelebrate = () => {
    triggerConfetti();
    triggerFireworks();
    triggerBalloons();
  };

  return (
    <section
      id="final-surprise"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24 final-bg"
    >
      {/* Background Animated Collage (Ken Burns slow zoom effect) */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-2 opacity-15 pointer-events-none"
      >
        {collagePhotos.map((url, index) => (
          <div key={index} className="relative w-full h-full overflow-hidden bg-zinc-950">
            <Image
              src={url}
              alt="Ending Background Collage"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </motion.div>

      {/* Dark overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 final-bg pointer-events-none" />

      {/* Central Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, type: "spring", damping: 25 }}
        className="relative z-10 w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-lg p-8 md:p-14 rounded-3xl text-center shadow-2xl overflow-hidden group hover:border-pink-300/30 transition-colors"
      >
        {/* Glow border ring */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-amber-500/5 to-purple-500/10 pointer-events-none" />

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-amber-200 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-300/20 bg-amber-400/5 inline-block mb-8"
        >
          Stay Amazing Always ✨
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200 drop-shadow-[0_2px_15px_rgba(255,182,193,0.35)]"
        >
          🌟 YOU ARE TRULY SPECIAL 🌟
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 space-y-6 text-zinc-300 text-sm md:text-base leading-relaxed font-medium"
        >
          <p>
            Thank you for all the laughs, support, encouragement, and unforgettable memories we&apos;ve created together.
          </p>
          <p>
            May your life always be filled with happiness, success, good health, love, and endless reasons to smile.
          </p>
          <p className="font-serif italic text-pink-300 text-base md:text-lg">
            &ldquo;You deserve every beautiful thing this world has to offer.&rdquo;
          </p>
        </motion.div>

        {/* Ending Wishes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-rose-300 tracking-wider"
        >
          🎂 Happy Birthday 🎂
        </motion.div>

        {/* Interactive Heart Button that launches particles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEndingCelebrate}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(244,63,94,0.4)] cursor-pointer group-hover:scale-105 transition-transform"
          >
            ❤
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
