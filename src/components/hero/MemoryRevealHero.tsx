// @ts-nocheck
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { useCelebrationStore } from "../../store/useCelebrationStore";
import { PolaroidScratchCard } from "./PolaroidScratchCard";

interface MemoryRevealHeroProps {

  onRevealComplete?: () => void;
}

const MEMORIES = [
  {
    id: 1,
    url: "/media/IMG-20251207-WA0025.jpg",
    caption: "Effortlessly beautiful ✨",
  },
  {
    id: 2,
    url: "/media/IMG_20260613_223016.jpg",
    caption: "Silent vibes, loud presence 🤍",
  },
  {
    id: 3,
    url: "/media/IMG_20260614_144734~2.jpg",
    caption: "Just me, my mood, my moment 🌙",
  },
  {
    id: 4,
    url: "/media/IMG_20260614_180206.jpg",
    caption: "Simple look, strong aura 🔥",
  },
  {
    id: 5,
    url: "/media/IMG_20260614_180315.jpg",
    caption: "No words needed… just vibes 💫",
  },
];


export const MemoryRevealHero = React.memo(function MemoryRevealHero({ onRevealComplete }: MemoryRevealHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isExploding, setIsExploding] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const lensFlareRef = useRef<HTMLDivElement>(null);
  const whiteFlashRef = useRef<HTMLDivElement>(null);
  const radialRaysRef = useRef<HTMLDivElement>(null);
  const lightRingRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const memoryBurstRef = useRef<HTMLDivElement>(null);
  const finalRevealRef = useRef<HTMLDivElement>(null);
  const finalPhotoRef = useRef<HTMLDivElement>(null);
  const ambientBloomRef = useRef<HTMLDivElement>(null);

  // Climax hint and animation refs
  const downArrowRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLButtonElement>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);

  const { triggerBalloons, triggerFireworks, triggerHearts, triggerConfetti, setExploding } = useCelebrationStore();

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (currentIndex < MEMORIES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      if (currentIndex === 1) triggerBalloons();
      setTimeout(() => setIsTransitioning(false), 800);
    } else {
      setIsExploding(true);
      setExploding(true);
    }
  };

  const handleScrollToCake = () => {
    const target = document.getElementById("interactive-cake");
    if (target) {
      if ((window as any).lenis) {
        try {
          (window as any).lenis.scrollTo(target);
        } catch (e) {
          console.error("Lenis scrollTo failed, falling back to native scroll", e);
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      } else {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  };

  useEffect(() => {
    if (!isExploding) return;

    // Lock scrolling on body when explosion animation begins
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if ((window as any).lenis) {
      try {
        (window as any).lenis.stop();
      } catch (e) {
        console.error("Lenis stop failed:", e);
      }
    }

    let ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline();
      tl.timeScale(2.0); // Play the reveal animation sequence at double speed (double time) for a punchy transition

      // Prepare initial states of all elements to prevent FOUC (flash of unstyled content)
      gsap.set([heartRef.current, radialRaysRef.current, lightRingRef.current, shockwaveRef.current, memoryBurstRef.current, finalRevealRef.current], { transformOrigin: "center center" });

      // ==========================================
      // PHASE 1 — HEART AWAKENING (0.0s - 0.5s)
      // ==========================================
      // Heart scales 1 -> 1.08 -> 1 with smooth easing
      tl.set(heartRef.current, { opacity: 1, scale: 1 }, 0);
      tl.to(heartRef.current, { scale: 1.08, duration: 0.25, ease: "power2.inOut" }, 0)
        .to(heartRef.current, { scale: 1.0, duration: 0.25, ease: "power2.inOut" }, 0.25);

      // Ambient light bloom starts
      tl.to(ambientBloomRef.current, { opacity: 0.4, scale: 1.2, duration: 0.5, ease: "power2.out" }, 0);

      // Background darkens slightly
      tl.to(containerRef.current, { backgroundColor: "#020202", duration: 0.5, ease: "power2.out" }, 0);

      // Soft pink particles appear around heart
      if (particlesRef.current) {
        const allParticles = Array.from(particlesRef.current.children);
        const awakeningCount = isMobile ? 8 : 15;
        const awakeningParticles = allParticles.slice(0, awakeningCount);

        awakeningParticles.forEach((p) => {
          const angle = Math.random() * Math.PI * 2;
          const radius = gsap.utils.random(35, 70);
          const startX = Math.cos(angle) * radius;
          const startY = Math.sin(angle) * radius;

          gsap.set(p, { x: startX, y: startY, scale: 0, opacity: 0 });
          tl.to(p, {
            x: startX + Math.cos(angle) * 30,
            y: startY + Math.sin(angle) * 30,
            scale: gsap.utils.random(0.5, 1.2),
            opacity: gsap.utils.random(0.4, 0.8),
            duration: 0.5,
            ease: "power2.out"
          }, 0);
        });
      }

      // ==========================================
      // PHASE 2 — CAMERA SHAKE (0.5s - 0.9s)
      // ==========================================
      // Slight elegant camera shake to build anticipation
      const shakeAmp = isMobile ? 3 : 8;
      const rotAmp = isMobile ? 0.3 : 0.8;

      tl.to(containerRef.current, {
        x: () => gsap.utils.random(-shakeAmp, shakeAmp),
        y: () => gsap.utils.random(-shakeAmp, shakeAmp),
        rotation: () => gsap.utils.random(-rotAmp, rotAmp),
        duration: 0.05,
        repeat: 7,
        yoyo: true,
        ease: "none"
      }, 0.5);

      // Reset position at the end of shake
      tl.set(containerRef.current, { x: 0, y: 0, rotation: 0 }, 0.9);

      // Heart pulse intensifies during shake
      tl.to(heartRef.current, { scale: 1.15, duration: 0.2, ease: "power1.inOut" }, 0.5)
        .to(heartRef.current, { scale: 1.0, duration: 0.2, ease: "power1.inOut" }, 0.7);
      tl.to(ambientBloomRef.current, { opacity: 0.65, scale: 1.6, duration: 0.4, ease: "power2.out" }, 0.5);

      // ==========================================
      // PHASE 3 — LIGHT BURST (0.9s - 1.5s)
      // ==========================================
      // Radial light rays, pink bloom, lens flare, expanding light ring
      tl.set(radialRaysRef.current, { opacity: 0, scale: 0.4 }, 0.9);
      tl.to(radialRaysRef.current, { opacity: 0.95, scale: 1.6, duration: 0.6, ease: "power3.in" }, 0.9);
      tl.to(ambientBloomRef.current, { opacity: 1, scale: 2.8, duration: 0.6, ease: "power3.in" }, 0.9);

      // Lens flare across heart
      tl.set(lensFlareRef.current, { opacity: 0, scaleX: 0, scaleY: 1 }, 0.9);
      tl.to(lensFlareRef.current, { opacity: 1, scaleX: 2.5, scaleY: 1.8, duration: 0.35, ease: "power2.out" }, 0.9)
        .to(lensFlareRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, 1.25);

      // Expanding light ring
      tl.set(lightRingRef.current, { opacity: 0.9, scale: 0.4 }, 1.15);
      tl.to(lightRingRef.current, { opacity: 0, scale: 4.8, duration: 0.35, ease: "power2.out" }, 1.15);

      // Background fades towards white
      tl.to(containerRef.current, { backgroundColor: "#ffffff", duration: 0.6, ease: "power3.in" }, 0.9);

      // ==========================================
      // PHASE 4 — HEART EXPLOSION (1.5s - 2.3s)
      // ==========================================
      // Heart explodes outward
      const targetHeartScale = isMobile ? 8 : 12;
      tl.to(heartRef.current, {
        scale: targetHeartScale,
        opacity: 0,
        duration: 0.65,
        ease: "expo.out"
      }, 1.5);

      // Circular shockwave
      tl.set(shockwaveRef.current, { opacity: 1, scale: 0.2 }, 1.5);
      tl.to(shockwaveRef.current, { opacity: 0, scale: 6.5, duration: 0.8, ease: "expo.out" }, 1.5);

      // Fade out rays
      tl.to(radialRaysRef.current, { opacity: 0, scale: 3.5, duration: 0.5, ease: "power2.out" }, 1.5);

      // Explosion Particles (Mini hearts, sparkles, petals)
      if (particlesRef.current) {
        const allParticles = Array.from(particlesRef.current.children);

        const heartsLimit = isMobile ? 20 : 50;
        const sparklesLimit = isMobile ? 20 : 60;
        const petalsLimit = isMobile ? 10 : 40;

        const heartEls = allParticles.filter(el => el.dataset.type === "heart").slice(0, heartsLimit);
        const sparkleEls = allParticles.filter(el => el.dataset.type === "sparkle").slice(0, sparklesLimit);
        const petalEls = allParticles.filter(el => el.dataset.type === "petal").slice(0, petalsLimit);

        const explodeGroup = (elements) => {
          elements.forEach((el) => {
            const angle = gsap.utils.random(0, Math.PI * 2);
            const speed = gsap.utils.random(180, isMobile ? 380 : 700);
            const targetX = Math.cos(angle) * speed;
            const targetY = Math.sin(angle) * speed;
            const rotation = gsap.utils.random(-360, 360);
            const scale = gsap.utils.random(0.5, 2.0);

            gsap.set(el, { x: 0, y: 0, scale: 0, opacity: 1 });
            tl.to(el, {
              x: targetX,
              y: targetY,
              rotation: rotation,
              scale: scale,
              opacity: 0,
              duration: gsap.utils.random(0.9, 1.7),
              ease: "expo.out"
            }, 1.5);
          });
        };

        explodeGroup(heartEls);
        explodeGroup(sparkleEls);
        explodeGroup(petalEls);
      }

      // ==========================================
      // PHASE 5 — WHITE FLASH (2.3s - 2.55s)
      // ==========================================
      // Full screen white flash fading smoothly
      tl.set(whiteFlashRef.current, { opacity: 1, display: "block" }, 2.3);
      tl.to(whiteFlashRef.current, { opacity: 0, duration: 0.25, ease: "power2.out" }, 2.3)
        .set(whiteFlashRef.current, { display: "none" }, 2.55);

      // Return background to luxury dark
      tl.set(containerRef.current, { backgroundColor: "#0a0a0a" }, 2.3);

      // ==========================================
      // PHASE 6 — SLOW MOTION MEMORY BURST (2.55s - 4.05s)
      // ==========================================
      // Escape memories flying outward in 4 corners (↖ ↗ ↙ ↘)
      if (memoryBurstRef.current) {
        const cards = Array.from(memoryBurstRef.current.children);
        const directions = [
          { x: -280, y: -280, rot: -20 },
          { x: 280, y: -280, rot: 20 },
          { x: -260, y: 260, rot: -15 },
          { x: 260, y: 260, rot: 15 }
        ];

        cards.forEach((card, i) => {
          const dir = directions[i % directions.length];

          gsap.set(card, {
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0,
            rotation: 0,
            filter: "blur(12px)",
            transformPerspective: 1000,
            z: -200
          });

          // Escape burst outwards
          tl.to(card, {
            x: dir.x,
            y: dir.y,
            scale: isMobile ? 0.95 : 1.25,
            rotation: dir.rot,
            opacity: 0.95,
            filter: "blur(0px)",
            z: 0,
            duration: 0.65,
            ease: "power2.out"
          }, 2.55)
            // Slow drift motion
            .to(card, {
              x: dir.x * 1.12,
              y: dir.y * 1.12,
              rotation: dir.rot + gsap.utils.random(-6, 6),
              duration: 0.95,
              ease: "sine.inOut"
            }, 3.2)
            // Fade away at end of Phase 6
            .to(card, {
              opacity: 0,
              scale: 0.75,
              filter: "blur(10px)",
              z: 120,
              duration: 0.45,
              ease: "power2.in"
            }, 3.6);
        });
      }

      // ==========================================
      // PHASE 7 — CELEBRATION WORLD (4.05s - 7.05s)
      // ==========================================
      // Global particle effects triggers
      tl.add(() => {
        triggerFireworks();
        triggerConfetti();
        triggerHearts();
        triggerBalloons();
      }, 4.05);

      // Layered depth floating particles rising from bottom
      if (particlesRef.current) {
        const allParticles = Array.from(particlesRef.current.children);

        const heartsLimit = isMobile ? 20 : 50;
        const sparklesLimit = isMobile ? 20 : 60;
        const petalsLimit = isMobile ? 10 : 40;

        const heartEls = allParticles.filter(el => el.dataset.type === "heart").slice(0, heartsLimit);
        const sparkleEls = allParticles.filter(el => el.dataset.type === "sparkle").slice(0, sparklesLimit);
        const petalEls = allParticles.filter(el => el.dataset.type === "petal").slice(0, petalsLimit);

        const floatGroup = (elements) => {
          elements.forEach((el, index) => {
            const depth = index % 3;
            let scale, duration, blur, opacity;

            if (depth === 0) {
              // Far layer: smaller & slower
              scale = gsap.utils.random(0.3, 0.55);
              duration = gsap.utils.random(4.8, 6.5);
              blur = 0;
              opacity = gsap.utils.random(0.35, 0.55);
            } else if (depth === 1) {
              // Mid layer
              scale = gsap.utils.random(0.75, 1.15);
              duration = gsap.utils.random(3.2, 4.5);
              blur = 0;
              opacity = gsap.utils.random(0.55, 0.75);
            } else {
              // Near layer: larger & faster
              scale = gsap.utils.random(1.5, 2.2);
              duration = gsap.utils.random(2.0, 3.0);
              blur = isMobile ? 0 : 2.5; // cinematic depth of field blur
              opacity = gsap.utils.random(0.75, 0.95);
            }

            const startX = gsap.utils.random(-window.innerWidth * 0.45, window.innerWidth * 0.45);
            const endX = startX + gsap.utils.random(-120, 120);
            const startY = window.innerHeight * 0.5 + 40;
            const endY = -window.innerHeight * 0.5 - 40;

            gsap.set(el, {
              x: startX,
              y: startY,
              scale: scale,
              opacity: 0,
              rotation: gsap.utils.random(-30, 30),
              filter: blur > 0 ? `blur(${blur}px)` : "none"
            });

            // Parallel timings inside Phase 7
            tl.to(el, {
              opacity: opacity,
              duration: 0.3,
              ease: "power1.out"
            }, 4.05)
              .to(el, {
                x: endX,
                y: endY,
                rotation: gsap.utils.random(-150, 150),
                duration: duration,
                ease: "none"
              }, 4.05)
              .to(el, {
                opacity: 0,
                duration: 0.4,
                ease: "power1.in"
              }, 4.05 + duration - 0.4);
          });
        };

        floatGroup(heartEls);
        floatGroup(sparkleEls);
        floatGroup(petalEls);
      }

      // ==========================================
      // PHASE 8 — FINAL REVEAL (7.05s - 8.55s)
      // ==========================================
      // Reveal the final birthday card and photo
      tl.set(finalRevealRef.current, { display: "flex", opacity: 0, scale: 0.94 }, 7.05);
      tl.to(finalRevealRef.current, { opacity: 1, scale: 1.0, duration: 2.00, ease: "power3.out" }, 7.05);

      // Floating animation
      const floatTween = gsap.to(finalPhotoRef.current, {
        y: -10,
        rotation: 5,
        duration: 1.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      }, 7.45);

      floatTweenRef.current = floatTween;

      // Down arrow fade in and gentle pulse
      tl.to(downArrowRef.current, { opacity: 0.9, y: 0, duration: 0.8, ease: "power2.out" }, 7.05);

      const arrowPulse = gsap.to(downArrowRef.current, {
        y: 8,
        opacity: 0.5,
        duration: 1.0,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      }, 7.85);

      // Fade out arrow and fade in hint card at 8.55s
      tl.to(downArrowRef.current, { opacity: 0, y: 15, duration: 0.5, ease: "power2.in" }, 8.55);
      tl.to(scrollHintRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, 8.55);

      // At 8.55s, unlock scroll and notify parent
      tl.add(() => {
        // Unlock scroll immediately when final card is shown to allow native interaction
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if ((window as any).lenis) {
          try {
            (window as any).lenis.start();
          } catch (e) { }
        }

        // Notify parent that reveal is complete
        onRevealComplete?.();
        // Trigger onExplode to restore scrolling globally

      }, 8.55);

    }, containerRef);

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if ((window as any).lenis) {
        try {
          (window as any).lenis.start();
        } catch (e) { }
      }
      ctx.revert();
    };
  }, [isExploding, triggerConfetti, triggerFireworks, triggerHearts, triggerBalloons]);

  const progressPercentage = ((currentIndex + 1) / MEMORIES.length) * 100;

  return (
    <div ref={containerRef} className="relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Dark Luxury Background with Pink/Gold Glow */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
        <div ref={ambientBloomRef} className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.18),transparent_70%)] opacity-0 scale-100 pointer-events-none" style={{ willChange: "transform, opacity" }} />
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
                disabled={isTransitioning}
                isPriority={currentIndex === 0}
                onNext={handleNext}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* CINEMATIC FINALE OVERLAYS */}
      {isExploding && (
        <>
          {/* Phase 5: Solid White Flash */}
          <div
            ref={whiteFlashRef}
            className="fixed inset-0 z-[200] pointer-events-none opacity-0 bg-white"
            style={{ display: "none" }}
          />

          {/* Phase 3: Lens Flare bar */}
          <div
            ref={lensFlareRef}
            className="absolute z-[105] w-[200%] h-3 bg-gradient-to-r from-transparent via-white to-transparent blur-[3px] opacity-0 pointer-events-none"
            style={{ transform: "rotate(-15deg)", willChange: "transform, opacity" }}
          />

          {/* Phase 3: Radial Light Rays */}
          <div
            ref={radialRaysRef}
            className="absolute z-[98] w-[500px] h-[500px] max-w-[90vw] max-h-[90vw] pointer-events-none opacity-0 scale-50"
            style={{ willChange: "transform, opacity" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[slow-spin_25s_linear_infinite] text-pink-400/40">
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d={`M50,50 L${50 + 50 * Math.cos((i * 30 * Math.PI) / 180)},${50 + 50 * Math.sin((i * 30 * Math.PI) / 180)}`}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.35"
                />
              ))}
            </svg>
          </div>

          {/* Phase 3 & 4: Expanding Light Ring / Shockwave */}
          <div
            ref={lightRingRef}
            className="absolute z-[99] rounded-full border-4 border-pink-300 pointer-events-none opacity-0 scale-0 w-32 h-32"
            style={{ willChange: "transform, opacity" }}
          />
          <div
            ref={shockwaveRef}
            className="absolute z-[101] rounded-full border-[12px] border-pink-400 pointer-events-none opacity-0 scale-0 w-32 h-32"
            style={{ willChange: "transform, opacity" }}
          />

          {/* Phase 1 & 4: Awakening & Exploding Heart */}
          <div
            ref={heartRef}
            className="absolute z-[100] pointer-events-none flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-[0_0_120px_rgba(244,63,94,1)] border-2 border-white/20"
            style={{ opacity: 0, scale: 1, willChange: 'transform, opacity', transform: 'translateZ(0)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-white drop-shadow-2xl">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>

          {/* Phase 6: Slow Motion Escaping Memories */}
          <div ref={memoryBurstRef} className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-[120]">
            {[...Array(4)].map((_, idx) => {
              const mem = MEMORIES[idx % MEMORIES.length];
              return (
                <div
                  key={idx}
                  className="absolute w-32 h-40 p-2 bg-white shadow-2xl rounded border border-zinc-200 opacity-0 scale-0 flex flex-col rotate-12"
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  <div className="relative w-full h-[78%] bg-zinc-950 overflow-hidden shadow-inner">
                    <img src={mem.url} alt="Burst memory" className="object-cover w-full h-full" />
                  </div>
                  <div className="h-[22%] flex items-center justify-center text-[9px] font-cursive text-zinc-800 leading-none text-center">
                    {mem.caption}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phase 7: Layered Particles Container (Hearts, Sparkles, Petals) */}
          <div ref={particlesRef} className="absolute inset-0 z-[110] pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Hearts (50) */}
            {[...Array(50)].map((_, i) => (
              <span key={`h-${i}`} data-type="heart" className="absolute text-3xl drop-shadow-lg opacity-0 select-none" style={{ willChange: "transform, opacity" }}>
                {i % 3 === 0 ? "💖" : i % 3 === 1 ? "💝" : "❤️"}
              </span>
            ))}

            {/* Sparkles (60) */}
            {[...Array(60)].map((_, i) => (
              <div
                key={`s-${i}`}
                data-type="sparkle"
                className="absolute w-3 h-3 bg-amber-300 rounded-full shadow-[0_0_12px_#fde047] opacity-0"
                style={{ willChange: "transform, opacity" }}
              />
            ))}

            {/* Petals (40) */}
            {[...Array(40)].map((_, i) => (
              <div
                key={`p-${i}`}
                data-type="petal"
                className="absolute w-5 h-5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full rounded-tr-none opacity-0"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', willChange: "transform, opacity" }}
              />
            ))}
          </div>

          {/* Phase 8: Final Birthday Reveal */}
          <div
            ref={finalRevealRef}
            className="absolute inset-0 z-[150] flex flex-col items-center justify-center pointer-events-none opacity-0 scale-95"
            style={{ display: "none" }}
          >
            <div className="glass-card max-w-sm w-[85vw] p-6 md:p-8 flex flex-col items-center gap-5 border-2 border-pink-400/30 shadow-[0_0_50px_rgba(244,63,94,0.25)] select-none">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-rose-300 drop-shadow-[0_2px_10px_rgba(244,63,94,0.4)] uppercase">
                Happy Birthday, Yuvashre! 💖
              </h1>

              <div
                ref={finalPhotoRef}
                className="relative w-44 h-56 md:w-48 md:h-64 rounded-lg overflow-hidden border-[6px] border-white shadow-[0_15px_30px_rgba(0,0,0,0.5)] rotate-3"
              >
                <Image
                  src="/media/IMG_20260615_220045.jpg"
                  alt="Final Magical Memory"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              <p className="text-zinc-200 text-center font-serif italic text-xs md:text-sm leading-relaxed max-w-[280px]">
                "You make every single moment brighter. Wishing you a year as beautiful and special as you are." ✨
              </p>
            </div>



            {/* Premium CTA Button */}
            <motion.button
              ref={scrollHintRef}
              onClick={handleScrollToCake}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[155] px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-semibold text-sm md:text-base tracking-widest uppercase shadow-[0_0_30px_rgba(244,63,94,0.4)] border border-pink-400/30 hover:border-pink-400/60 pointer-events-auto opacity-0 select-none flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300"
              style={{ transform: "translate3d(0, 15px, 0)", willChange: "transform, opacity" }}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 45px rgba(244, 63, 94, 0.9)"
              }}
              whileTap={{
                scale: 0.95
              }}
              animate={{
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 0 15px rgba(244, 63, 94, 0.4)",
                  "0 0 35px rgba(244, 63, 94, 0.8)",
                  "0 0 15px rgba(244, 63, 94, 0.4)"
                ]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              ❤️ Continue The Journey ❤️
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
});
