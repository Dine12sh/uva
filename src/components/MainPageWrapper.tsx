"use client";

import React, { useState, useEffect } from "react";
import Lenis from "lenis";
// @ts-ignore
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";


// Static imports for initial view components
import CountdownIntro from "./CountdownIntro";
import IntroScreen from "./IntroScreen";
import AtmosphericBackground from "./AtmosphericBackground";

// Dynamic imports for heavy or scroll-delayed components
const CelebrationEngine = dynamic(() => import("./CelebrationEngine"), { ssr: false });
const HeroSection = dynamic(() => import("./HeroSection"));
const Timeline = dynamic(() => import("./Timeline"));
const MemoryGallery = dynamic<{ memories: any[] }>(() => import("./MemoryGallery"));
const VideoSection = dynamic<{ memories: any[] }>(() => import("./VideoSection"));
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

  // Handle flow transitions
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setShowIntro(true);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowMain(true);
  };

  const [showContent, setShowContent] = useState(false);

  // Initialize Lenis Smooth Scroll only when main content is visible
  useEffect(() => {
    if (!showMain) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
    });

    // Expose lenis globally for programmatic smooth scroll integrations
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (typeof window !== "undefined") {
        (window as any).lenis = undefined;
      }
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
            className="relative min-h-[100dvh] text-white selection:bg-pink-500 selection:text-white overflow-x-hidden bg-transparent"
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            {/* Background Layers */}
            <AtmosphericBackground />

            {/* Front sections z-indexed above background */}
            <div className="relative z-10">
              {/* 1. Hero Section (Netflix Intro -> Cinematic) */}
              <HeroSection onRevealComplete={() => setShowContent(true)} />

              {showContent && (
                <>
                  {/* 2. Interactive 3D Birthday Cake Section */}
                  <section id="interactive-cake" className="py-24 px-6 md:px-16 bg-black/70">
                    <div className="max-w-4xl mx-auto">
                      <InteractiveCake />
                    </div>
                  </section>

                  {/* 3. Balloon Pop Mini Game */}
                  <BalloonGame />

                  {/* 4. Sealed handwritten letter wishes */}
                  <section id="wishes-letter" className="py-24 px-6 md:px-16 bg-black/50">
                    <div className="max-w-3xl mx-auto">
                      <WishesLetter />
                    </div>
                  </section>

                  {/* 5. Final Cinematic Surprise Ending */}
                  <FinalSurprise />

                  {/* 6. Gift Reveal */}
                  <GiftReveal />

                  {/* 7. Journey Timeline */}
                  <Timeline />

                  {/* 8. Photo Masonry Gallery */}
                  <MemoryGallery memories={memories} />

                  {/* 9. Video memories Slider */}
                  <VideoSection memories={memories} />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
