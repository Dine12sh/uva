"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Maximize2, Minimize2, Play, Pause, ChevronLeft, ChevronRight, X } from "lucide-react";
import FloatingParticles from "./FloatingParticles";

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
  const [mounted, setMounted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter memories to images only
  const images = memories.filter((m) => m.type === "photo");

  // Mouse Parallax Setup
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized mouse position from center of container (-1 to 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Spatial Layout Setup
  const [layout, setLayout] = useState<any[]>([]);

  useEffect(() => {
    // Generate a beautiful, scattered 3D layout
    const newLayout = images.map((img, i) => {
      // Golden ratio spiral inspired scattering or just random
      const angle = i * 2.4;
      const radius = 10 + Math.random() * 40; // distance from center
      const x = Math.cos(angle) * radius + (Math.random() * 20 - 10);
      const y = Math.sin(angle) * radius + (Math.random() * 20 - 10);
      
      return {
        ...img,
        x: `${x}%`,
        y: `${y}%`,
        z: Math.random() * 400 - 200, // Z depth
        rotateZ: Math.random() * 15 - 7.5, // Slight tilt
        scale: Math.random() * 0.3 + 0.85, // 0.85 to 1.15
        orbitSpeed: Math.random() * 20 + 20, // 20-40s per orbit
        orbitDirection: Math.random() > 0.5 ? 1 : -1,
      };
    });
    setLayout(newLayout);
    setMounted(true);
  }, [images]);

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

  const rotateX = useTransform(mouseY, [-1, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [-1, 1], [-5, 5]);

  if (!mounted) return <div className="min-h-screen bg-black/40" />;

  return (
    <section 
      id="memory-gallery" 
      ref={containerRef}
      className="relative min-h-[120vh] w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center perspective-[1200px]"
    >
      {/* Aurora Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-rose-500/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-pink-500/5 rounded-full blur-[100px] mix-blend-screen" />

      <FloatingParticles count={60} color="rgba(255, 215, 0, 0.3)" />

      {/* Header Overlay */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <motion.span 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-amber-200/80 text-xs uppercase tracking-[0.3em] font-light px-6 py-2 rounded-full border border-amber-200/10 bg-black/20 backdrop-blur-md inline-block mb-8 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
        >
          Moments in Time
        </motion.span>
      </div>

      {/* 3D Floating Scene */}
      <motion.div 
        className="relative w-full max-w-[1400px] h-full min-h-[800px] flex items-center justify-center transform-style-preserve-3d"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
      >
        {layout.map((img, idx) => {
          const isDimmed = lightboxIndex !== null && lightboxIndex !== idx;

          return (
            <motion.div
              key={img.id}
              layoutId={`gallery-image-${img.id}`}
              initial={{ opacity: 0, z: -1000, scale: 0.5 }}
              whileInView={{ opacity: 1, z: img.z, scale: img.scale }}
              viewport={{ once: true, margin: "200px" }}
              transition={{
                duration: 1.5,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              animate={{
                y: [0, -15 * img.orbitDirection, 0],
                rotateZ: [img.rotateZ, img.rotateZ + 2 * img.orbitDirection, img.rotateZ],
                opacity: isDimmed ? 0.3 : 1,
              }}
              // @ts-ignore
              transition={{
                y: {
                  duration: img.orbitSpeed,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotateZ: {
                  duration: img.orbitSpeed * 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                opacity: { duration: 0.4 }
              }}
              style={{
                position: "absolute",
                left: `calc(50% + ${img.x})`,
                top: `calc(50% + ${img.y})`,
                transform: `translate(-50%, -50%)`,
                zIndex: Math.round(img.z + 500),
              }}
              className="group cursor-pointer perspective-[1000px]"
              onClick={() => openLightbox(idx)}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  z: 100, // bring to front
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  transition: { duration: 0.5, ease: "easeOut" }
                }}
                className="relative overflow-hidden rounded-xl bg-zinc-900 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_50px_rgba(255,182,193,0.3)] group-hover:border-white/30 transition-colors duration-500"
              >
                {/* Image Size Contraints based on standard photo aspect ratios */}
                <div className="w-[200px] h-[250px] sm:w-[260px] sm:h-[320px] md:w-[320px] md:h-[400px]">
                  <img
                    src={img.url}
                    alt="Memory"
                    className="w-full h-full object-cover transform transition-transform duration-[3000ms] ease-out group-hover:scale-110 filter brightness-90 group-hover:brightness-110"
                    loading="lazy"
                  />
                  {/* Glass Reflection Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full -translate-x-full transition-all duration-[1500ms] ease-in-out z-10" />
                  
                  {/* Premium bottom shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bespoke Lightbox Modal */}
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
                  className="p-3 rounded-full bg-white/5 hover:bg-white/20 transition-colors cursor-pointer text-white/70 hover:text-white backdrop-blur-md border border-white/10"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/20 transition-colors cursor-pointer text-white/70 hover:text-white backdrop-blur-md border border-white/10"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button
                  onClick={closeLightbox}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/20 transition-colors cursor-pointer text-white/70 hover:text-white backdrop-blur-md border border-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-8 p-4 rounded-full bg-white/0 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer z-50 hidden md:block border border-transparent hover:border-white/10 backdrop-blur-sm"
            >
              <ChevronLeft size={32} strokeWidth={1} />
            </button>

            {/* Main Image Container */}
            <div 
              className="w-full h-full px-4 flex flex-col items-center justify-center relative select-none"
              onClick={closeLightbox}
            >
              <motion.img
                key={`lightbox-img-${images[lightboxIndex].id}`}
                layoutId={`gallery-image-${images[lightboxIndex].id}`}
                src={images[lightboxIndex].url}
                alt="Enlarged memory"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10 z-40"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-8 p-4 rounded-full bg-white/0 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer z-50 hidden md:block border border-transparent hover:border-white/10 backdrop-blur-sm"
            >
              <ChevronRight size={32} strokeWidth={1} />
            </button>

            {/* Mobile Swipe / Tap Navigation */}
            <div className="absolute bottom-8 flex gap-4 md:hidden z-50">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="px-6 py-3 rounded-full bg-white/10 text-xs tracking-widest uppercase font-light flex items-center gap-2 backdrop-blur-md border border-white/10"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
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
