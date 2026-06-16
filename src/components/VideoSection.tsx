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
        <div className="text-center mb-16">
          <span className="text-amber-200 text-xs uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full border border-amber-300/20 bg-amber-400/5">
            Cinematic Highlights
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200">
            Video Memories
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mt-4 text-sm">
            Hover over any thumbnail to preview a memory in motion, or click for the full cinematic screen.
          </p>
        </div>

        {/* Video Grid / Shelf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoMemories.map((vid) => (
            <motion.div
              key={vid.id}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => handleMouseEnter(vid.id)}
              onMouseLeave={() => handleMouseLeave(vid.id)}
              onClick={() => setActiveVideo(vid)}
              className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl cursor-pointer group hover:border-pink-300/40 transition-colors"
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
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Black overlay before play/hover */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                {/* Floating Play Icon */}
                <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110">
                  <Play size={20} className="fill-white translate-x-[2px]" />
                </div>
              </div>

              {/* Bottom Card Title and Section Info */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end">
                <span className="text-pink-300 text-[10px] font-bold uppercase tracking-wider">
                  {vid.section.replace("_", " ")}
                </span>
                <p className="text-white font-medium text-xs sm:text-sm mt-1 truncate">
                  {vid.caption || "Cinematic Memory Video"}
                </p>
              </div>

              {/* Glowing card border trails */}
              <div className="absolute inset-0 rounded-2xl border border-pink-400/0 group-hover:border-pink-400/20 transition-all pointer-events-none shadow-[inset_0_0_20px_rgba(244,63,94,0)] group-hover:shadow-[inset_0_0_20px_rgba(244,63,94,0.15)]" />
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
              <video
                src={activeVideo.url}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[70vh] rounded-xl shadow-2xl border border-white/10"
              />
              <div className="mt-6 text-center max-w-xl">
                <span className="text-pink-300 text-xs font-bold uppercase tracking-widest">
                  {activeVideo.section.replace("_", " ")}
                </span>
                <h3 className="text-zinc-200 mt-2 text-lg font-serif">
                  {activeVideo.caption || "Cinematic Memory Video"}
                </h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
