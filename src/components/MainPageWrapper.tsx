"use client";

import React, { useState, useEffect } from "react";
import Lenis from "lenis";
import IntroScreen from "./IntroScreen";
import CelebrationEngine from "./CelebrationEngine";
import FloatingMemoryWall from "./FloatingMemoryWall";
import HeroSection from "./HeroSection";
import LiveMemoryCounter from "./LiveMemoryCounter";
import Timeline from "./Timeline";
import MemoryGallery from "./MemoryGallery";
import VideoSection from "./VideoSection";
import InteractiveCake from "./InteractiveCake";
import WishesLetter from "./WishesLetter";
import FinalSurprise from "./FinalSurprise";
import { useMusicStore } from "../store/useMusicStore";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface MainPageWrapperProps {
  settings: {
    title: string;
    subtitle: string;
    letterText: string;
    daysCelebrated: number;
  };
  memories: any[];
}

export default function MainPageWrapper({ settings, memories }: MainPageWrapperProps) {
  const [showIntro, setShowIntro] = useState(true);
  const { isPlaying, isMuted, volume, setPlaying, setMuted, setVolume } = useMusicStore();

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (showIntro) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
  }, [showIntro]);

  return (
    <>
      {/* Global Canvas celebration engine */}
      <CelebrationEngine />

      {showIntro ? (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      ) : (
        <div className="relative min-h-screen bg-neutral-950 text-white selection:bg-pink-500 selection:text-white overflow-x-hidden">
          {/* Infinite Drifting Photo Wall in background */}
          <FloatingMemoryWall />

          {/* Front sections */}
          <div className="relative z-10">
            {/* Hero Section */}
            <HeroSection />

            {/* Statistic Live Counter */}
            <LiveMemoryCounter daysCelebrated={settings.daysCelebrated} />

            {/* Journey Timeline */}
            <Timeline />

            {/* Photo Masonry Gallery */}
            <MemoryGallery memories={memories} />

            {/* Video memories Slider */}
            <VideoSection memories={memories} />

            {/* Interactive 3D Birthday Cake Section */}
            <section className="py-24 px-6 md:px-16 bg-black/70">
              <div className="max-w-4xl mx-auto">
                <InteractiveCake />
              </div>
            </section>

            {/* Sealed handwritten letter wishes */}
            <section className="py-24 px-6 md:px-16 bg-black/50">
              <div className="max-w-3xl mx-auto">
                <WishesLetter customMessage={settings.letterText} />
              </div>
            </section>

            {/* Final Cinematic Surprise Ending */}
            <FinalSurprise />
          </div>

          {/* Floating Premium Music Bar */}
          <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:border-pink-300/30">
            {/* Play/Pause indicator */}
            <button
              onClick={() => setPlaying(!isPlaying)}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            {/* Mute toggle button */}
            <button
              onClick={() => setMuted(!isMuted)}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Volume slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setMuted(false);
              }}
              className="w-16 md:w-24 accent-pink-500 h-[3px] bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </>
  );
}
