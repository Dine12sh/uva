"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AtmosphericBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-neutral-950">
      {/* Deep Space / Night Sky gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-80" />

      {/* Aurora Effects - Top / Left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.2, 1],
          x: ["-10%", "5%", "-10%"],
          y: ["-20%", "0%", "-20%"]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-pink-600/10 blur-[120px] mix-blend-screen"
      />

      {/* Aurora Effects - Bottom / Right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.3, 1],
          x: ["10%", "-5%", "10%"],
          y: ["20%", "0%", "20%"]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-1/4 -right-1/4 w-[90vw] h-[90vw] rounded-full bg-rose-500/10 blur-[150px] mix-blend-screen"
      />

      {/* Aurora Effects - Center / Amber */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [0.8, 1.5, 0.8],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-amber-400/5 blur-[140px] mix-blend-screen"
      />

      {/* Floating Ambient Particles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: Math.random() * window.innerHeight,
            x: Math.random() * window.innerWidth
          }}
          animate={{
            opacity: [0, Math.random() * 0.5 + 0.3, 0],
            y: [null, Math.random() * -200 - 100],
            x: [null, (Math.random() - 0.5) * 100]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          className="absolute w-[2px] h-[2px] rounded-full bg-white/60 blur-[1px]"
        />
      ))}
      
      {/* Global Noise Overlay for Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
