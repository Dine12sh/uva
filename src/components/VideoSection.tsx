"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, X, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoMemory {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  section: string;
}

interface VideoSectionProps {
  memories: VideoMemory[];
}

export default function VideoSection({ memories }: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoMemory | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const videoMemories = memories.filter((m) => m.type === "video");

  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
    const video = videoRefs.current[id];
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (id: string) => {
    setHoveredId(null);
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <section id="video-memories" className="relative py-24 px-6 md:px-16 overflow-hidden bg-black/80">
      {/* Background active video blur effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {hoveredId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-cover bg-center blur-[100px] scale-110"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(183,110,121,0.4) 0%, rgba(0,0,0,0) 80%)`
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-amber-200 text-xs uppercase tracking-[0.2em] font-semibold px-4 py-1.5 rounded-full border border-amber-300/20 bg-amber-400/5 backdrop-blur-md">
            Cinematics
          </span>
          <h2 className="text-4xl md:text-6xl font-serif mt-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200 drop-shadow-[0_2px_15px_rgba(255,182,193,0.3)] tracking-wide">
            Video Memories
          </h2>
        </div>

        {/* Video Grid / Shelf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoMemories.map((vid, index) => (
            <motion.div
              key={vid.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.6, ease: "easeOut" } }}
              onMouseEnter={() => handleMouseEnter(vid.id)}
              onMouseLeave={() => handleMouseLeave(vid.id)}
              onClick={() => setActiveVideo(vid)}
              className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.4)] cursor-pointer group hover:border-pink-300/40 hover:shadow-[0_25px_50px_rgba(183,110,121,0.2)] hover:z-10 transition-colors"
            >
              {/* HTML5 Video preview */}
              <video
                ref={(el) => {
                  videoRefs.current[vid.id] = el;
                }}
                src={vid.url}
                muted
                playsInline
                loop
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover effect container for loader & play icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Background Skeleton Pulse before play */}
                <div className="absolute inset-0 bg-zinc-900 animate-pulse -z-10" />

                {/* Black overlay before play/hover */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700" />
                
                {/* Floating Play Icon */}
                <div className="w-14 h-14 rounded-full bg-white/10 group-hover:bg-white/20 border border-white/20 flex items-center justify-center text-white backdrop-blur-xl transition-all duration-[800ms] group-hover:scale-110 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                  <Play size={24} className="fill-white translate-x-[2px]" />
                </div>
              </div>
              
              {/* Glassmorphism gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-6 mix-blend-overlay" />

              {/* Glowing card border trails */}
              <div className="absolute inset-0 rounded-3xl border border-pink-400/0 group-hover:border-pink-400/20 transition-all pointer-events-none shadow-[inset_0_0_20px_rgba(244,63,94,0)] group-hover:shadow-[inset_0_0_30px_rgba(244,63,94,0.15)]" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Premium Playback Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 text-white"
          >
            {/* Top Bar controls */}
            <div className="absolute top-4 right-6 flex items-center gap-4 z-55">
              <button
                onClick={() => setActiveVideo(null)}
                className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video player canvas */}
            <div className="w-full max-w-4xl max-h-[80vh] px-4 flex flex-col items-center justify-center">
              <motion.video
                src={activeVideo.url}
                controls
                autoPlay
                playsInline
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-full max-h-[80vh] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
