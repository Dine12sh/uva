"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import { Maximize2, Minimize2, Play, Pause, ChevronLeft, ChevronRight, X } from "lucide-react";
// @ts-ignore
import Image from "next/image";

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
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter memories to images only
  const images = memories.filter((m) => m.type === "photo");

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / (clientWidth * 0.85 + 16));
    setScrollIndex(Math.min(images.length - 1, Math.max(0, index)));
  };

  // Slideshow effect
  useEffect(() => {
    if (!isPlaying || lightboxIndex === null) return;
    
    const interval = setInterval(() => {
      setLightboxIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % images.length;
      });
    }, 4000);

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
  }, [lightboxIndex, images.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsPlaying(false);
    setIsFullscreen(false);
    document.body.style.overflow = "";
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

  // Assign different aspect ratios for visual interest in masonry
  const getAspectClass = (index: number): string => {
    const patterns = [
      "aspect-[3/4]",   // Portrait
      "aspect-square",  // Square
      "aspect-[4/5]",   // Tall portrait
      "aspect-[3/4]",   // Portrait
      "aspect-[5/6]",   // Near-square portrait
      "aspect-square",  // Square
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section 
      id="memory-gallery" 
      className="relative w-full overflow-hidden bg-[#0a0a0a] py-24 px-6 md:px-16"
    >
      {/* Aurora Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[radial-gradient(circle,rgba(244,63,94,0.15)_0%,transparent_60%)] rounded-full mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,transparent_60%)] rounded-full mix-blend-screen animate-[pulse_12s_ease-in-out_infinite_reverse]" />

      {/* CSS Particles (replacing FloatingParticles canvas) */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="css-particle"
          style={{
            left: `${(i * 11 + 5) % 100}%`,
            top: `${(i * 17 + 8) % 100}%`,
            animationDuration: `${10 + (i % 4) * 3}s`,
            animationDelay: `${(i % 5) * 2}s`,
            opacity: 0.15 + (i % 3) * 0.1,
            background: "rgba(255, 215, 0, 0.3)",
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="section-label inline-block mb-6"
          >
            Moments in Time
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl md:text-5xl font-serif heading-gradient tracking-wide"
          >
            Our Memory Gallery
          </motion.h2>
        </div>

        {/* Masonry Grid */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="masonry-grid no-scrollbar"
        >
          {images.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="masonry-item"
            >
              <div
                className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/8 shadow-[0_15px_40px_rgba(0,0,0,0.5)] cursor-pointer group hover:border-pink-300/25 hover:shadow-[0_20px_60px_rgba(183,110,121,0.2)] transition-all duration-700 hover:-translate-y-1"
                onClick={() => openLightbox(idx)}
              >
                <div className={`relative ${getAspectClass(idx)} w-full`}>
                  <Image
                    src={img.url}
                    alt={img.caption || "Memory photo"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    className="object-cover transform transition-transform duration-[2000ms] ease-out group-hover:scale-110 brightness-90 group-hover:brightness-110"
                    unoptimized
                  />
                  
                  {/* Glass Reflection Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full -translate-x-full transition-all duration-[1500ms] ease-in-out z-10" />
                  
                  {/* Bottom shadow gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Caption overlay */}
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white/90 text-xs md:text-sm font-medium leading-relaxed drop-shadow-lg">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Pagination Dots */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const itemWidth = scrollRef.current.clientWidth * 0.85 + 16;
                  scrollRef.current.scrollTo({ left: idx * itemWidth, behavior: "smooth" });
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                scrollIndex === idx ? "bg-pink-400 w-5" : "bg-white/20"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            id="lightbox-container"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 text-white"
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 left-0 right-0 px-8 flex justify-between items-center z-50">
              <span className="text-xs font-light tracking-[0.2em] text-white/50">
                {lightboxIndex + 1} <span className="mx-2 text-white/20">/</span> {images.length}
              </span>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors cursor-pointer text-white/70 hover:text-white backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors cursor-pointer text-white/70 hover:text-white backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button
                  onClick={closeLightbox}
                  className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors cursor-pointer text-white/70 hover:text-white backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="Close lightbox"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={(e: any) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-8 p-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/0 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer z-50 hidden md:flex border border-transparent hover:border-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} strokeWidth={1} />
            </button>

            {/* Main Image Container */}
            <div 
              className="w-full h-full px-4 flex flex-col items-center justify-center relative select-none"
              onClick={closeLightbox}
            >
              <motion.div
                key={`lightbox-img-${images[lightboxIndex].id}`}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-[90vw] max-h-[80vh] z-40"
                onClick={(e: any) => e.stopPropagation()}
              >
                <Image
                  src={images[lightboxIndex].url}
                  alt={images[lightboxIndex].caption || "Enlarged memory"}
                  width={1200}
                  height={900}
                  className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  unoptimized
                  priority
                />
              </motion.div>

              {/* Caption below image */}
              {images[lightboxIndex].caption && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-white/60 text-sm md:text-base font-light tracking-wide text-center max-w-lg"
                >
                  {images[lightboxIndex].caption}
                </motion.p>
              )}
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={(e: any) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-8 p-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/0 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer z-50 hidden md:flex border border-transparent hover:border-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Next image"
            >
              <ChevronRight size={32} strokeWidth={1} />
            </button>

            {/* Mobile Navigation */}
            <div className="absolute bottom-8 flex gap-4 md:hidden z-50">
              <button
                onClick={(e: any) => { e.stopPropagation(); navigate(-1); }}
                className="px-6 py-3 rounded-full bg-white/10 text-xs tracking-widest uppercase font-light flex items-center gap-2 backdrop-blur-md border border-white/10"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={(e: any) => { e.stopPropagation(); navigate(1); }}
                className="px-6 py-3 rounded-full bg-white/10 text-xs tracking-widest uppercase font-light flex items-center gap-2 backdrop-blur-md border border-white/10"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
