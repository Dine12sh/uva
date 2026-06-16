"use client";

import React from "react";
import { motion } from "framer-motion";

const floatingPhotos = [
  { url: "/media/IMG-20251207-WA0025.jpg", x: "10%", y: "15%", rotate: -12, scale: 0.8, delay: 0 },
  { url: "/media/IMG_20260613_223016.jpg", x: "80%", y: "20%", rotate: 8, scale: 0.9, delay: 2 },
  { url: "/media/IMG_20260614_180206.jpg", x: "5%", y: "55%", rotate: 6, scale: 0.75, delay: 4 },
  { url: "/media/IMG_20260614_180315.jpg", x: "75%", y: "65%", rotate: -9, scale: 0.85, delay: 1 },
  { url: "/media/IMG-20251207-WA0035.jpg", x: "42%", y: "8%", rotate: -5, scale: 0.7, delay: 3 },
  { url: "/media/IMG_20260614_180739.jpg", x: "48%", y: "82%", rotate: 10, scale: 0.8, delay: 5 },
];

export default function FloatingMemoryWall() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {floatingPhotos.map((photo, idx) => (
        <motion.div
          key={idx}
          style={{
            left: photo.x,
            top: photo.y,
          }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{
            opacity: [0.08, 0.18, 0.08],
            scale: photo.scale,
            x: [0, 25, -20, 0],
            y: [0, -35, 30, 0],
            rotate: [photo.rotate, photo.rotate + 6, photo.rotate - 6, photo.rotate],
          }}
          transition={{
            opacity: {
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            },
            x: {
              repeat: Infinity,
              duration: 20 + idx * 3,
              ease: "easeInOut",
            },
            y: {
              repeat: Infinity,
              duration: 22 + idx * 4,
              ease: "easeInOut",
            },
            rotate: {
              repeat: Infinity,
              duration: 18 + idx * 2,
              ease: "easeInOut",
            },
            scale: {
              duration: 1.5,
              delay: photo.delay * 0.3,
            }
          }}
          className="absolute w-28 sm:w-36 bg-white/90 p-2 pb-4 shadow-xl border border-pink-200/20 rounded-sm pointer-events-auto hover:opacity-90 hover:z-20 hover:scale-[1.1] transition-all duration-300 cursor-grab active:cursor-grabbing"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-zinc-800 rounded-xs">
            <img
              src={photo.url}
              alt="Floating background photo"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <div className="h-4 mt-2 bg-gradient-to-r from-zinc-200 to-zinc-300/30 rounded-xs" />
        </motion.div>
      ))}
    </div>
  );
}
