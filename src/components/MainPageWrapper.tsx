"use client";

import React, { useState, useEffect } from "react";
import Lenis from "lenis";
// @ts-ignore
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useMusicStore } from "../store/useMusicStore";
import { useCelebrationStore } from "../store/useCelebrationStore";

// Static imports for initial view components
import CountdownIntro from "./CountdownIntro";
import IntroScreen from "./IntroScreen";
import AtmosphericBackground from "./AtmosphericBackground";

// Dynamic imports for heavy or scroll-delayed components
const CelebrationEngine = dynamic(() => import("./CelebrationEngine"), { ssr: false });
const HeroSection = dynamic(() => import("./HeroSection"));
const Timeline = dynamic(() => import("./Timeline"));
const MemoryGallery = dynamic(() => import("./MemoryGallery"));
const VideoSection = dynamic(() => import("./VideoSection"));
const InteractiveCake = dynamic(() => import("./InteractiveCake"), { ssr: false });
const BalloonGame = dynamic(() => import("./BalloonGame"));
const WishesLetter = dynamic(() => import("./WishesLetter"));
const FinalSurprise = dynamic(() => import("./FinalSurprise"));
const GiftReveal = dynamic(() => import("./GiftReveal"));

interface MainPageWrapperProps {
  memories: any[];
}

export default function MainPageWrapper({ memories }: MainPageWrapperProps) {
  const [showCountdown, setShowCountdown] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showMain, setShowMain] = useState(false);
  
  const { isPlaying, isMuted, volume, setPlaying, setMuted, setVolume } = useMusicStore();
  const { isExploding } = useCelebrationStore();

  // Handle flow transitions
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setShowIntro(true);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowMain(true);
  };

  // Initialize Lenis Smooth Scroll only when main content is visible
  useEffect(() => {
    if (!showMain) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [showMain]);

  return (
    <>
      {/* Global Canvas celebration engine (idle by default, triggered globally) */}
      <CelebrationEngine />

      <AnimatePresence mode="wait">
        {/* Step 1: Countdown */}
        {showCountdown && (
          <CountdownIntro onComplete={handleCountdownComplete} />
        )}

        {/* Step 2: Welcome Screen & Gift Box */}
        {showIntro && !showCountdown && (
          <IntroScreen onComplete={handleIntroComplete} />
        )}

        {/* Step 3: Main Experience */}
        {showMain && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-screen text-white selection:bg-pink-500 selection:text-white overflow-x-hidden bg-transparent"
          >
            {/* Background Layers */}
            <AtmosphericBackground />

            {/* Front sections z-indexed above background */}
            <div className="relative z-10">
              {/* 3. Hero Section (Netflix Intro -> Cinematic) */}
              <HeroSection />

              {/* 4. Journey Timeline */}
              <Timeline />

              {/* 5. Photo Masonry Gallery */}
              <MemoryGallery memories={memories} />

              {/* 6. Video memories Slider */}
              <VideoSection memories={memories} />

              {/* 7. Interactive 3D Birthday Cake Section */}
              <section id="interactive-cake" className="py-24 px-6 md:px-16 bg-black/70">
                <div className="max-w-4xl mx-auto">
                  <InteractiveCake />
                </div>
              </section>

              {/* 8. Balloon Pop Mini Game */}
              <BalloonGame />

              {/* 9. Sealed handwritten letter wishes */}
              <section id="wishes-letter" className="py-24 px-6 md:px-16 bg-black/50">
                <div className="max-w-3xl mx-auto">
                  <WishesLetter />
                </div>
              </section>

              {/* 10. Final Cinematic Surprise Ending */}
              <FinalSurprise />

              {/* 11. Gift Reveal */}
              <GiftReveal />
            </div>

            {/* Floating Premium Music Bar */}
            <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl transition-all duration-500 hover:border-pink-300/30 ${isExploding ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100"}`}>
              <button
                onClick={() => setPlaying(!isPlaying)}
                className="p-3 min-w-[44px] min-h-[44px] flex justify-center items-center rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
                title={isPlaying ? "Pause Music" : "Play Music"}
                aria-label={isPlaying ? "Pause background music" : "Play background music"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <button
                onClick={() => setMuted(!isMuted)}
                className="p-3 min-w-[44px] min-h-[44px] flex justify-center items-center rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
                title={isMuted ? "Unmute" : "Mute"}
                aria-label={isMuted ? "Unmute background music" : "Mute background music"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e: any) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setMuted(false);
                }}
                className="w-16 md:w-24 accent-pink-500 h-[3px] bg-zinc-800 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
                aria-label="Volume slider"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
