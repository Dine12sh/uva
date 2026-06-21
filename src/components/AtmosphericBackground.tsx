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

      {/* CSS-only Floating Particles — replaces 40 Framer Motion divs with window.innerHeight */}
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={i}
          className="css-particle"
          style={{
            left: `${(i * 41 + 7) % 100}%`,
            top: `${(i * 59 + 13) % 100}%`,
            animationDuration: `${15 + (i % 10) * 3}s`,
            animationDelay: `${(i * 0.8) % 8}s`,
            opacity: 0.2 + (i % 5) * 0.1,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
          }}
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
