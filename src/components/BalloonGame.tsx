"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCelebrationStore } from "../store/useCelebrationStore";

const BALLOON_DATA = [
  { id: 1, text: "HAPPY", color: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)", effect: "confetti_small" },
  { id: 2, text: "BIRTHDAY", color: "linear-gradient(135deg, #FDD819 0%, #E80505 100%)", effect: "confetti_medium" },
  { id: 3, text: "DAY", color: "linear-gradient(135deg, #E2B0FF 0%, #9F44D3 100%)", effect: "hearts" },
  { id: 4, text: "Yuvashree", color: "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)", effect: "gold_burst" },
  { id: 5, text: "", color: "linear-gradient(135deg, #FFD700 0%, #FDB931 100%)", effect: "cinematic", special: true },
];

export default function BalloonGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const { triggerConfetti, triggerFireworks, triggerHearts, triggerBalloons } = useCelebrationStore();

  const handlePop = (index: number) => {
    if (index !== currentIndex) return;

    const balloon = BALLOON_DATA[index];

    // Trigger visual effect based on balloon
    if (balloon.effect === "confetti_small" || balloon.effect === "confetti_medium") {
      triggerConfetti();
    } else if (balloon.effect === "hearts") {
      triggerHearts();
    } else if (balloon.effect === "gold_burst") {
      triggerConfetti();
      triggerFireworks();
    } else if (balloon.special) {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500); // Stop shake after 500ms

      // Delay modal opening slightly for cinematic effect
      setTimeout(() => {
        setVideoModalOpen(true);
      }, 600);
      return; // Do not increment index normally, freeze the game state
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
    triggerFireworks();
    triggerConfetti();
    triggerHearts();
    triggerBalloons();
  };

  const scrollToWishes = () => {
    setVideoModalOpen(false);
    setTimeout(() => {
      const nextSection = document.getElementById("wishes-letter");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  // Generate some persistent sparkles for the background
  const sparkles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      {/* Cinematic Screen Shake Container */}
      <motion.div
        animate={screenShake ? { x: [-10, 10, -10, 10, -5, 5, 0], y: [-10, 10, -5, 5, -2, 2, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full h-full flex flex-col items-center py-20 px-4"
      >
        {/* Header */}
        <div className="z-10 text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-200 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-300/20 bg-amber-400/5 inline-block mb-4 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
          >
            A Birthday Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-400 to-amber-300 tracking-wide drop-shadow-md"
          >
            Follow The Balloons
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 mt-4 font-medium"
          >
            Pop them sequentially to reveal a special surprise.
          </motion.p>

          <div className="mt-6 flex justify-center items-center gap-2">
            <span className="text-pink-400 font-mono text-lg font-bold tracking-widest bg-pink-500/10 px-4 py-1 rounded-full border border-pink-500/20">
              {Math.min(currentIndex, 5)} / 5 Complete
            </span>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative w-full max-w-4xl h-[600px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden mt-4 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
          {!gameStarted ? (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-md">
              <button
                onClick={() => setGameStarted(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:shadow-[0_0_50px_rgba(244,63,94,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Begin Journey ✨
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {currentIndex < 5 && (
                  <motion.button
                    key={currentIndex}
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      y: [0, -15, 0],
                      transition: {
                        y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                        opacity: { duration: 0.5 },
                        scale: { type: "spring", bounce: 0.5 }
                      }
                    }}
                    exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)", transition: { duration: 0.4 } }}
                    className="relative flex flex-col items-center cursor-pointer group focus:outline-none border-none bg-transparent p-0 select-none pointer-events-auto touch-manipulation min-h-[220px] justify-between"
                    onClick={() => handlePop(currentIndex)}
                    aria-label={`Pop balloon ${currentIndex + 1}`}
                  >
                    {/* The Balloon */}
                    <div
                      className={`${BALLOON_DATA[currentIndex].special ? "w-32 h-40 md:w-40 md:h-48 shadow-[0_0_50px_rgba(255,215,0,0.6)]" : "w-24 h-32 md:w-32 md:h-40"} rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-inner flex flex-col items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105 group-active:scale-95`}
                      style={{ background: BALLOON_DATA[currentIndex].color }}
                    >
                      {/* Shine Reflection */}
                      <div className="absolute top-2 left-4 w-1/4 h-1/3 rounded-full bg-white/30 rotate-[-45deg] blur-[2px]" />

                      {/* Text inside balloon (if desired, or we show it after pop. User requested text reveal AFTER pop) */}
                      {BALLOON_DATA[currentIndex].special && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-[pulse_2s_infinite]" />
                      )}
                    </div>

                    {/* Balloon Knot */}
                    <div
                      className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] mt-[-2px]"
                      style={{ borderBottomColor: "rgba(255,255,255,0.6)" }}
                    />

                    {/* String */}
                    <div className="w-[2px] h-32 bg-gradient-to-b from-white/40 to-transparent" />

                    {/* Special balloon particles */}
                    {BALLOON_DATA[currentIndex].special && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-[0_0_10px_#fde047]" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `ping ${Math.random() * 2 + 1}s infinite` }} />
                        ))}
                      </motion.div>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Revealed Text Display (Persists behind the next balloon or briefly shown) */}
              <div className="absolute top-10 w-full flex justify-center px-4">
                <AnimatePresence mode="popLayout">
                  {currentIndex > 0 && currentIndex < 5 && (
                    <motion.div
                      key={`text-${currentIndex}`}
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
                      className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                    >
                      {BALLOON_DATA[currentIndex - 1].text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Cinematic Video Reveal Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 px-4"
          >
            {/* Background floating hearts/sparkles */}
            {sparkles.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: [0, 1, 0], y: -100 }}
                transition={{ duration: 4, delay: s.delay, repeat: Infinity }}
                className="absolute text-pink-500/30 text-xl pointer-events-none"
                style={{ left: `${s.left}%`, top: `${s.top}%` }}
              >
                {s.id % 2 === 0 ? "❤️" : "✨"}
              </motion.div>
            ))}

            {!videoEnded && (
              <motion.h3
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-2xl md:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 mb-8 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)] text-center z-10"
              >
                💖 A Special Message Just For You 💖
              </motion.h3>
            )}

            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-3xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(244,63,94,0.4)] border border-white/20 z-10 bg-black"
            >
              <video
                ref={videoRef}
                src="/media/video_20251129_173014.mp4"
                className="w-full h-full object-cover"
                autoPlay
                controls
                playsInline
                onEnded={handleVideoEnded}
              />

              {/* Dim overlay during playback if desired, but user requested normal controls */}
            </motion.div>

            {/* Final Completion State */}
            <AnimatePresence>
              {videoEnded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20"
                >
                  <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 drop-shadow-[0_0_60px_rgba(251,191,36,0.8)] text-center uppercase tracking-tighter"
                  >
                    🎉 HAPPY BIRTHDAY 🎉<br />Yuvashree
                  </motion.h1>

                  <motion.button
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                    onClick={scrollToWishes}
                    className="mt-16 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 text-white font-bold text-xl md:text-2xl shadow-[0_0_40px_rgba(244,63,94,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 animate-[pulse_2s_infinite] border border-pink-400/50 cursor-pointer"
                  >
                    ❤️ Continue The Journey ❤️
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
