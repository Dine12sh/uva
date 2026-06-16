"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Play, Pause, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Memory {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  section: string;
}

interface MemoryGalleryProps {
  memories: Memory[];
}

export default function MemoryGallery({ memories }: MemoryGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter memories to images only
  const images = memories.filter((m) => m.type === "photo");

  // Slideshow effect
  useEffect(() => {
    if (!isPlaying || lightboxIndex === null) return;
    
    const interval = setInterval(() => {
      setLightboxIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % images.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, lightboxIndex, images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden"; // lock scroll
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsPlaying(false);
    setIsFullscreen(false);
    document.body.style.overflow = ""; // unlock scroll
  };

  const navigate = (direction: number) => {
    if (lightboxIndex === null) return;
    const nextIdx = (lightboxIndex + direction + images.length) % images.length;
    setLightboxIndex(nextIdx);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById("lightbox-container");
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Divide images into 3 columns for pure CSS masonry
  const columns: Memory[][] = [[], [], []];
  images.forEach((img, idx) => {
    columns[idx % 3].push(img);
  });

  return (
    <section id="memory-gallery" className="relative py-24 px-6 md:px-16 bg-black/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-pink-300 text-xs uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full border border-pink-300/20 bg-pink-500/5">
            Memory Lane
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200">
            Premium Memory Gallery
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mt-4 text-sm">
            Pinterest-style masonry grid showcasing every captured moment of laughter and joy.
          </p>
        </div>

        {/* Responsive Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-6">
              {col.map((img) => {
                // Find original index in full images list
                const originalIndex = images.findIndex((item) => item.id === img.id);
                
                return (
                  <motion.div
                    key={img.id}
                    layoutId={`gallery-image-${img.id}`}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openLightbox(originalIndex)}
                    className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 p-2 shadow-lg cursor-zoom-in hover:border-pink-300/30 transition-colors"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-zinc-800">
                      <img
                        src={img.url}
                        alt={img.caption || "Memory"}
                        className="w-full h-auto object-cover max-h-[500px]"
                        loading="lazy"
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />
                      
                      {/* Hover Info */}
                      <div className="absolute inset-x-0 bottom-0 p-6 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <span className="text-pink-300 text-xs font-semibold uppercase tracking-widest">
                          {img.section.replace("_", " ")}
                        </span>
                        <p className="text-white font-medium mt-1 text-sm md:text-base leading-relaxed drop-shadow-sm">
                          {img.caption || "Beautiful Moments 🌸"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bespoke Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            id="lightbox-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 text-white"
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center z-55">
              <span className="text-sm font-medium tracking-wide text-zinc-400">
                {lightboxIndex + 1} / {images.length}
              </span>
              
              <div className="flex items-center gap-4">
                {/* Slideshow button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 transition-colors cursor-pointer text-zinc-300 hover:text-white"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Fullscreen button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 transition-colors cursor-pointer text-zinc-300 hover:text-white"
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>

                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 transition-colors cursor-pointer text-zinc-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-6 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer z-55 hidden md:block"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main Image Container */}
            <div className="w-full max-w-4xl max-h-[80vh] px-4 flex flex-col items-center justify-center relative select-none">
              <motion.img
                key={lightboxIndex}
                src={images[lightboxIndex].url}
                alt="Enlarged memory"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-white/5"
              />
              
              {/* Image Caption bottom bar */}
              <div className="mt-6 text-center max-w-xl">
                <span className="text-pink-300 text-xs font-bold uppercase tracking-widest">
                  {images[lightboxIndex].section.replace("_", " ")}
                </span>
                <p className="text-zinc-200 mt-2 text-base font-serif italic">
                  "{images[lightboxIndex].caption || "A moment frozen in time."}"
                </p>
              </div>
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={() => navigate(1)}
              className="absolute right-6 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer z-55 hidden md:block"
            >
              <ChevronRight size={28} />
            </button>

            {/* Mobile Swipe / Tap Navigation hint bar */}
            <div className="absolute bottom-6 flex gap-4 md:hidden">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 rounded-full bg-white/5 text-sm font-semibold flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={() => navigate(1)}
                className="px-6 py-2 rounded-full bg-white/5 text-sm font-semibold flex items-center gap-1"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
