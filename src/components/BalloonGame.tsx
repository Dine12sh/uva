"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCelebrationStore } from "../store/useCelebrationStore";

const EMOJI_MESSAGES = ["🎂", "✨", "💖", "🌟", "🎉", "🎁", "🎈", "🥰", "🥳", "💫", "🥂", "❤️"];
const BALLOON_COLORS = [
  "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)", // Pink
  "linear-gradient(135deg, #FDD819 0%, #E80505 100%)", // Orange/Red
  "linear-gradient(135deg, #E2B0FF 0%, #9F44D3 100%)", // Purple
  "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)", // Peach/Gold
  "linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)", // Teal
];

interface BalloonData {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  message: string;
  popped: boolean;
  scale: number;
}

export default function BalloonGame() {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { triggerConfetti } = useCelebrationStore();

  // Initialize balloons
  useEffect(() => {
    const newBalloons = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10% to 90% width
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 3, // 3 to 5 seconds float time
      message: EMOJI_MESSAGES[i],
      popped: false,
      scale: Math.random() * 0.3 + 0.8, // 0.8 to 1.1 scale
    }));
    setBalloons(newBalloons);
  }, []);

  // Check for completion
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const allPopped = balloons.every((b) => b.popped);
      if (allPopped) {
        setGameCompleted(true);
        triggerConfetti();
        // Scroll to next section after completion
        setTimeout(() => {
          const nextSection = document.getElementById("wishes-letter");
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 2000);
      }
    }
  }, [balloons, gameStarted, gameCompleted, triggerConfetti]);

  // Auto-complete after 20 seconds of starting if not done manually
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const timeout = setTimeout(() => {
        setGameCompleted(true);
        triggerConfetti();
        const nextSection = document.getElementById("wishes-letter");
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 20000);
      return () => clearTimeout(timeout);
    }
  }, [gameStarted, gameCompleted, triggerConfetti]);

  const handlePop = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
  };

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black py-20 flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />
      
      {/* Header */}
      <div className="z-10 text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-amber-200 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-300/20 bg-amber-400/5 inline-block mb-4"
        >
          Mini Game
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-400 to-amber-300 tracking-wide"
        >
          Pop The Balloons!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-zinc-400 mt-4 font-medium"
        >
          Click or tap the floating balloons to reveal surprises
        </motion.p>
      </div>

      {/* Game Area */}
      <div className="relative w-full max-w-4xl h-[500px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden mt-4 shadow-2xl">
        {!gameStarted ? (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
            <button
              onClick={() => setGameStarted(true)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 transition-transform"
            >
              Start Game 🎈
            </button>
          </div>
        ) : (
          <>
            {/* Balloons Container */}
            <div className="absolute inset-0">
              {balloons.map((balloon) => (
                <div
                  key={balloon.id}
                  className="absolute bottom-0 w-16 md:w-20"
                  style={{
                    left: `${balloon.x}%`,
                    transform: `scale(${balloon.scale})`,
                    zIndex: balloon.popped ? 0 : 10,
                  }}
                >
                  {!balloon.popped ? (
                    // Floating Balloon
                    <div
                      onClick={() => handlePop(balloon.id)}
                      className="balloon flex flex-col items-center"
                      style={{
                        animationDelay: `${balloon.delay}s`,
                        animationDuration: `${balloon.duration}s`,
                        bottom: "-150px", // Start below container
                      }}
                    >
                      {/* Balloon Body */}
                      <div
                        className="w-16 h-20 md:w-20 md:h-24 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-inner flex items-center justify-center relative overflow-hidden"
                        style={{ background: balloon.color }}
                      >
                        <div className="absolute top-2 left-2 w-4 h-6 rounded-full bg-white/30 rotate-[-45deg] blur-[2px]" />
                      </div>
                      {/* Balloon Knot */}
                      <div
                        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] mt-[-2px]"
                        style={{ borderBottomColor: "rgba(255,255,255,0.5)" }}
                      />
                      {/* String */}
                      <div className="w-[1px] h-16 bg-white/30" />
                    </div>
                  ) : (
                    // Revealed Message
                    <div
                      className="balloon-message text-4xl md:text-5xl"
                      style={{
                        bottom: `${Math.random() * 40 + 30}%`,
                      }}
                    >
                      {balloon.message}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Completion Overlay */}
            <AnimatePresence>
              {gameCompleted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30"
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="text-center"
                  >
                    <h3 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 mb-4 drop-shadow-lg">
                      Yay! 🎉
                    </h3>
                    <p className="text-white/90 text-lg">You popped them all!</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
