"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WishesLetterProps {
  customMessage?: string;
}

const defaultMessage = `Dear Friend,
Happiest Birthday to the Beautiful Soul Born Today!

Every memory we've shared has made life brighter and more meaningful.

Thank you for your kindness, support, laughter, and all the wonderful moments we've created together.

May this birthday bring happiness, success, peace, good health, and endless reasons to smile.

You truly deserve the very best.

🎂 Happy Birthday 🎂`;

export default function WishesLetter({ customMessage }: WishesLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  const textToType = customMessage || defaultMessage;
  const indexRef = useRef(0);

  // Typewriter effect — fixed with ref-based counter instead of closure
  useEffect(() => {
    if (!isOpen) {
      setTypedText("");
      setTypingDone(false);
      indexRef.current = 0;
      return;
    }

    const interval = setInterval(() => {
      if (indexRef.current >= textToType.length) {
        clearInterval(interval);
        setTypingDone(true);
        return;
      }
      const char = textToType.charAt(indexRef.current);
      setTypedText((prev) => prev + char);
      indexRef.current++;
    }, 35);

    return () => clearInterval(interval);
  }, [isOpen, textToType]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[500px] w-full px-4 py-12">
      {/* Sparkles / Gold particles background only when open */}
      {isOpen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-400/40 animate-ping"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                width: `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                animationDuration: `${2 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed Envelope Screen */
          <motion.div
            key="sealed-envelope"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 45, y: -50 }}
            transition={{ duration: 0.6 }}
            onClick={() => setIsOpen(true)}
            className="relative w-full max-w-lg aspect-[1.6] rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 p-1 shadow-2xl cursor-pointer hover:shadow-pink-300/40 hover:scale-[1.03] transition-all duration-300 border border-pink-300/30 flex items-center justify-center"
          >
            {/* Envelope Triangles Fold Style */}
            <div className="absolute inset-0 border-[2px] border-pink-400/10 rounded-xl" />

            {/* Left/Right flap overlays */}
            <div className="absolute inset-0 bg-linear-to-tr from-rose-200/50 via-transparent to-rose-100/50 pointer-events-none rounded-xl" />

            <div className="flex flex-col items-center gap-4 text-center z-10">
              <span className="text-zinc-600 font-serif text-sm tracking-widest uppercase">
                A Handwritten Message For You
              </span>

              {/* Wax Seal Button */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg border border-amber-500/30"
              >
                {/* Stamp Emblem */}
                <div className="w-12 h-12 rounded-full border border-amber-400/20 flex items-center justify-center font-bold text-amber-100 text-lg">
                  ❤
                </div>

                {/* Glow ring around seal */}
                <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-pulse" />
              </motion.div>

              <span className="text-amber-800 font-semibold text-xs tracking-wider uppercase">
                Click Seal to Open Letter
              </span>
            </div>
          </motion.div>
        ) : (
          /* Opened Handwritten Letter */
          <motion.div
            key="opened-letter"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -100 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-full max-w-2xl bg-gradient-to-b from-[#FAF6EE] to-[#F3EDE0] border border-[#EBE3D3] rounded-lg shadow-2xl p-8 md:p-12 font-sans select-none overflow-hidden"
          >
            {/* Decorative Letter Borders */}
            <div className="absolute inset-4 border border-[#E7DECB] pointer-events-none rounded-md" />

            {/* Wax seal watermark in corner */}
            <div className="absolute top-6 right-6 opacity-30 w-10 h-10 rounded-full bg-amber-700/40 flex items-center justify-center font-bold text-amber-200 text-xs">
              ❤
            </div>

            {/* Letter Text (Handwritten script) */}
            <div className="relative max-h-[50vh] overflow-y-auto custom-scrollbar pr-4 whitespace-pre-wrap font-serif text-xl md:text-2xl leading-relaxed text-[#5C4A37] tracking-wide font-medium">
              {typedText}
              {!typingDone && <span className="typewriter-cursor" />}
            </div>

            {/* Close Button / Wax Seal Re-seal */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 border border-[#DCD0C0] rounded-full text-xs font-semibold uppercase tracking-wider text-[#7C6A57] hover:bg-[#EBE3D3] transition-colors duration-300 cursor-pointer"
              >
                Close Letter
              </button>
            </div>

            {/* Subtle vintage shadows */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
