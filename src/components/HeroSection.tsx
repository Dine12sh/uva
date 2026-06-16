"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCelebrationStore } from "../store/useCelebrationStore";

// Let's pick 4 images from the uploaded public/media directory for the Hero Collage
const heroPhotos = [
  { url: "/media/25860_ae_lite_edit (1).jpg", caption: "Sweet Memories 🌸", rotate: -8, x: -30, y: 10 },
  { url: "/media/IMG_20260613_223016.jpg", caption: "Beautiful Moments ✨", rotate: 6, x: 20, y: -20 },
  { url: "/media/IMG-20251207-WA0035.jpg", caption: "Fun Times Together 🎈", rotate: -3, x: -10, y: 30 },
  { url: "/media/IMG_20260614_180739.jpg", caption: "Special Days 🌟", rotate: 12, x: 40, y: 15 },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { triggerFireworks, triggerBalloons, triggerConfetti } = useCelebrationStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { width, height, left, top } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / (width / 2); // -1 to 1
      const y = (e.clientY - top - height / 2) / (height / 2); // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCelebrate = () => {
    triggerConfetti();
    triggerFireworks();
    triggerBalloons();
  };

  const handleScrollToTimeline = () => {
    const el = document.getElementById("friendship-timeline");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-20 lg:flex-row lg:px-16"
      style={{
        background: "radial-gradient(circle at center, rgba(255,209,220,0.15) 0%, rgba(26,16,33,0.3) 50%, rgba(10,10,10,0.5) 100%)"
      }}
    >
      {/* Background Particles (Sparkles) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300/30 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDuration: `${1.5 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Left Content */}
      <div className="z-10 flex flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block rounded-full border border-pink-300/30 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-300 backdrop-blur-md">
            A Beautiful Friendship Journey ✨
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200 drop-shadow-[0_2px_10px_rgba(255,182,193,0.25)]"
        >
          Happy Birthday, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-rose-300 drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)]">
            My Amazing Friend!
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4 }}
          className="mt-6 max-w-lg text-lg text-zinc-300 font-medium leading-relaxed drop-shadow-sm"
        >
          "Thank you for being one of the most wonderful people in my life. Every day is brighter with you in it."
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.6 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6 w-full justify-center lg:justify-start"
        >
          <button
            onClick={handleScrollToTimeline}
            className="group relative flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 font-bold text-white shadow-[0_4px_15px_rgba(244,63,94,0.4)] transition-transform duration-300 hover:scale-[1.05] hover:shadow-[0_6px_20px_rgba(244,63,94,0.6)] active:scale-95 cursor-pointer"
          >
            <span>💖 Explore Memories</span>
          </button>
          
          <button
            onClick={handleCelebrate}
            className="group flex h-14 items-center justify-center gap-2 rounded-full border border-amber-300/40 bg-black/30 px-8 font-bold text-amber-200 backdrop-blur-md transition-all duration-300 hover:bg-amber-400/10 hover:border-amber-300/80 hover:text-white hover:scale-[1.05] active:scale-95 cursor-pointer"
          >
            <span>🎂 Celebrate</span>
          </button>
        </motion.div>
      </div>

      {/* Hero Right: Polaroid Collage Deck with mouse parallax */}
      <div className="relative mt-20 flex h-[350px] w-full items-center justify-center lg:mt-0 lg:h-[500px] lg:w-1/2 select-none">
        {heroPhotos.map((photo, index) => {
          // Calculate parallax offset based on card index
          const px = mousePos.x * (index + 1) * 12;
          const py = mousePos.y * (index + 1) * 12;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: photo.rotate }}
              transition={{ duration: 1.2, delay: 0.4 + index * 0.15, type: "spring" }}
              style={{
                x: photo.x + px,
                y: photo.y + py,
              }}
              className="absolute w-48 sm:w-56 rounded-sm bg-white/95 p-3 pb-6 shadow-2xl transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(255,182,193,0.3)] hover:z-30 cursor-grab active:cursor-grabbing border border-pink-100"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 rounded-sm">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="h-full w-full object-cover select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
              </div>
              <p className="mt-4 text-center font-serif text-sm font-semibold tracking-wide text-rose-800">
                {photo.caption}
              </p>
            </motion.div>
          );
        })}

        {/* Soft radial aura glow under collage */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-pink-500/10 blur-3xl -z-10 animate-pulse" />
      </div>
    </section>
  );
}
