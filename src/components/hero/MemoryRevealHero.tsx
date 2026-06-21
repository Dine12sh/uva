"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { useCelebrationStore } from "../../store/useCelebrationStore";
import { PolaroidScratchCard } from "./PolaroidScratchCard";

interface MemoryRevealHeroProps {
  onExplode: () => void;
  onHeroComplete?: () => void;
}

const MEMORIES = [
  { id: 1, url: "/media/IMG-20251207-WA0025.jpg", caption: "Our first trip " },
  { id: 2, url: "/media/IMG_20260613_223016.jpg", caption: "Movie nights " },
  { id: 3, url: "/media/IMG_20260614_144734~2.jpg", caption: "Dinner dates " },
  { id: 4, url: "/media/IMG_20260614_180206.jpg", caption: "That random Tuesday " },
  { id: 5, url: "/media/IMG_20260614_180315.jpg", caption: "Forever & Always " },
];

export const MemoryRevealHero = React.memo(function MemoryRevealHero({ onExplode, onHeroComplete }: MemoryRevealHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isExploding, setIsExploding] = useState(false);
  const [isExplosionFinished, setIsExplosionFinished] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const overlayImageRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const lensFlareRef = useRef<HTMLDivElement>(null);

  const { triggerBalloons, triggerFireworks, triggerHearts, triggerConfetti } = useCelebrationStore();

  const handleNext = () => {
    if (currentIndex < MEMORIES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      if (currentIndex === 1) triggerBalloons();
    } else {
      setIsExploding(true);
      const { setExploding } = useCelebrationStore.getState();
      setExploding(true);
    }
  };

  useEffect(() => {
    if (!isExploding) return;

    // Trigger external global particle systems
    triggerFireworks();
    triggerConfetti();
    triggerHearts();

    let ctx = gsap.context(() => {
      // Fire onExplode immediately so the Timeline section mounts right away
      // instead of waiting for the animation to finish
      onExplode();

      const tl = gsap.timeline({
        onComplete: () => {
          setIsExplosionFinished(true);
          onHeroComplete?.();
        },
      });

      // 1. Camera Shake on the main wrapper (200-300ms)
      if (containerRef.current) {
        const isMobile = window.innerWidth < 768;
        const shakeAmp = isMobile ? 5 : 15;
        const rotAmp = isMobile ? 1 : 2;
        
        gsap.to(containerRef.current, {
          x: () => gsap.utils.random(-shakeAmp, shakeAmp),
          y: () => gsap.utils.random(-shakeAmp, shakeAmp),
          rotation: () => gsap.utils.random(-rotAmp, rotAmp),
          duration: 0.05,
          repeat: 5, // 250ms of shake
          yoyo: true,
          ease: "none",
          onComplete: () => {
            gsap.set(containerRef.current, { x: 0, y: 0, rotation: 0 });
          }
        });
      }

      // 2. Short White Flash (500-700ms)
      if (lensFlareRef.current) {
        gsap.fromTo(lensFlareRef.current,
          { opacity: 1 },
          { opacity: 0, duration: 0.6, ease: "power4.out" }
        );
      }

      // 3. Expanding GSAP Heart (Dynamic Scale based on Viewport)
      if (heartRef.current) {
        // Reduced the massive 25/15 scale to a much more reasonable cinematic 8/5 scale
        const targetScale = window.innerWidth > 768 ? 8 : 5;
        tl.fromTo(heartRef.current, 
          { scale: 1, opacity: 1 },
          {
            scale: targetScale,
            opacity: 0,
            duration: 1.5,
            ease: "power4.inOut",
          }, 0);
      }

      // 4. Image Overlay fading in and then fading out
      if (overlayImageRef.current) {
        tl.fromTo(overlayImageRef.current, 
          { opacity: 0, scale: 0.8 }, 
          { opacity: 1, scale: 1, duration: 1.0, ease: "power3.out" }, 
        0.2)
        .to(overlayImageRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 0.5,
          ease: "power2.in"
        }, "+=0.3");
      }

      // 5. Flying Particles (Photos, Petals, Hearts, Sparks)
      if (particlesRef.current) {
        const particles = Array.from(particlesRef.current.children);
        tl.fromTo(particles, 
          { x: 0, y: 0, scale: 0, opacity: 1 },
          {
            x: () => gsap.utils.random(-window.innerWidth, window.innerWidth),
            y: () => gsap.utils.random(-window.innerHeight, window.innerHeight),
            rotation: () => gsap.utils.random(-720, 720),
            scale: () => gsap.utils.random(0.5, 2.5),
            opacity: 0,
            duration: () => gsap.utils.random(1.5, 3),
            ease: "expo.out",
            stagger: 0.01,
          },
        0.1);
      }
    }, containerRef); // Scope to containerRef for strict cleanup

    return () => ctx.revert(); // Kill all timelines on unmount
  }, [isExploding, triggerConfetti, triggerFireworks, triggerHearts, onExplode]);

  const progressPercentage = ((currentIndex + 1) / MEMORIES.length) * 100;

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Dark Luxury Background with Pink/Gold Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.12),transparent_70%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(244,63,94,0.08),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Progress Indicator */}
      <AnimatePresence>
        {currentIndex >= 0 && !isExploding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-10 flex flex-col items-center gap-3 z-50 w-full px-8 max-w-md"
          >
            <span className="text-white/80 font-serif text-lg md:text-xl tracking-widest drop-shadow-md">
              Memory {currentIndex + 1} / {MEMORIES.length}
            </span>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Centered Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          {currentIndex === -1 ? (
            <motion.div
              key="tap-to-begin"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => setCurrentIndex(0)}
            >
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(244,63,94,0.3)] group-hover:bg-white/10 group-hover:border-pink-400/50 group-hover:shadow-[0_0_80px_rgba(244,63,94,0.6)] transition-all duration-700">
                <div className="absolute inset-0 rounded-full animate-ping bg-rose-500/20" />
                <span className="text-5xl group-hover:scale-110 transition-transform duration-500">💖</span>
              </div>
              <h2 className="mt-8 text-2xl md:text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-white tracking-widest font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                Tap To Begin
              </h2>
            </motion.div>
          ) : !isExploding ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: -50, scale: 0.9, rotate: -5, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute"
            >
              <PolaroidScratchCard
                id={MEMORIES[currentIndex].id}
                url={MEMORIES[currentIndex].url}
                caption={MEMORIES[currentIndex].caption}
                isFinal={currentIndex === MEMORIES.length - 1}
                onNext={handleNext}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* EXPLOSION DOM ELEMENTS */}
      {!isExplosionFinished && (
        <>
          {/* 1. Short White Flash */}
          <div 
            ref={lensFlareRef}
            className="fixed inset-0 z-[90] pointer-events-none opacity-0 bg-white"
          />

          {/* 2. Expanding Pink Heart */}
          <div
            ref={heartRef}
            className="absolute z-[100] pointer-events-none opacity-0 flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-[0_0_100px_rgba(244,63,94,1)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white drop-shadow-2xl">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>

          {/* 3. Image Overlay (Revealed inside the pink explosion) */}
          <div 
            ref={overlayImageRef}
            className="absolute z-[105] pointer-events-none opacity-0 flex items-center justify-center w-[90vw] h-[60vh] md:w-[60vw] md:h-[80vh] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.4)] border-4 border-white/20"
          >
            <Image 
              src="/media/IMG-20251207-WA0025.jpg"
              alt="Overlay Memory Snapshot"
              fill
              unoptimized={true}
              className="object-cover"
              onError={(e) => {
                // Fallback image
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* 4. Flying Particles Container */}
          <div ref={particlesRef} className="absolute inset-0 z-[110] pointer-events-none flex items-center justify-center">
            {isExploding && [...Array(60)].map((_, i) => {
              const type = i % 4; // 0: Heart, 1: Spark, 2: Petal, 3: Photo
              
              if (type === 0) {
                return <span key={i} className="absolute text-4xl drop-shadow-lg opacity-0">💖</span>;
              }
              if (type === 1) {
                return <div key={i} className="absolute w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_20px_#fde047] opacity-0" />;
              }
              if (type === 2) {
                return <div key={i} className="absolute w-6 h-6 bg-rose-600 rounded-full rounded-tr-none blur-[1px] opacity-0" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />;
              }
              if (type === 3) {
                return (
                  <div key={i} className="absolute w-24 h-24 p-1 bg-white shadow-2xl opacity-0 rotate-12">
                    <div className="relative w-full h-full bg-black">
                      <Image 
                        src={MEMORIES[i % MEMORIES.length].url} 
                        alt={`Flying memory photo ${i}`} 
                        fill 
                        unoptimized={true}
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }} 
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </>
      )}

    </div>
  );
});
