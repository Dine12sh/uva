"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownIntroProps {
  onComplete: () => void;
}

export default function CountdownIntro({ onComplete }: CountdownIntroProps) {
  const [count, setCount] = useState(10); // 10s countdown for better UX
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (count <= 0) {
      setTimeout(() => {
        setIsFinished(true);
        setTimeout(onComplete, 800);
      }, 500);
      return;
    }

    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* CSS-Only Background Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="css-particle"
              style={{
                left: `${(i * 17 + 11) % 100}%`,
                top: `${(i * 23 + 7) % 100}%`,
                animationDuration: `${10 + (i % 5) * 2}s`,
                animationDelay: `${(i % 3) * 1.5}s`,
                opacity: 0.4 + (i % 4) * 0.15,
                background: "rgba(255, 215, 0, 0.4)",
              }}
            />
          ))}

          {/* Glowing Center Core */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15)_0%,transparent_50%)]" />

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-amber-200 text-sm md:text-base font-light tracking-[0.3em] uppercase mb-8 z-10"
          >
            Something special is loading...
          </motion.div>

          {/* Main Countdown Number */}
          <div className="relative z-10 h-32 md:h-48 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={count}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="countdown-number font-sans"
              >
                {count > 0 ? count : "✨"}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="w-64 md:w-96 h-1 mt-12 bg-white/10 rounded-full overflow-hidden z-10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${((10 - count) / 10) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
              className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-amber-300"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
