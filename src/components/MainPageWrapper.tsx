"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Static imports for initial view components
import CountdownIntro from "./CountdownIntro";
import IntroScreen from "./IntroScreen";
import AtmosphericBackground from "./AtmosphericBackground";

// Import types, constants, hooks, and helpers
import { MainPageWrapperProps, Memory } from "../types";
import { PAGE_TRANSITION } from "../lib/constants";
import { useIntroFlow } from "../hooks/useIntroFlow";
import { useLenisScroll } from "../hooks/useLenisScroll";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { SectionSkeleton } from "./SectionSkeleton";
import { ErrorBoundary } from "./ErrorBoundary";

// Preload HeroSection to optimize initial render after welcome flow
import HeroSection from "./HeroSection";

// Dynamic imports for heavy/scroll-delayed components with premium loading skeletons
const CelebrationEngine = dynamic(() => import("./CelebrationEngine"), { ssr: false });

const Timeline = dynamic(() => import("./Timeline"), {
  loading: () => <SectionSkeleton />,
});

const MemoryGallery = dynamic<{ memories: Memory[] }>(() => import("./MemoryGallery"), {
  loading: () => <SectionSkeleton />,
});

const VideoSection = dynamic<{ memories: Memory[] }>(() => import("./VideoSection"), {
  loading: () => <SectionSkeleton />,
});

const InteractiveCake = dynamic(() => import("./InteractiveCake"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const BalloonGame = dynamic(() => import("./BalloonGame"), {
  loading: () => <SectionSkeleton />,
});

const WishesLetter = dynamic(() => import("./WishesLetter"), {
  loading: () => <SectionSkeleton />,
});

const FinalSurprise = dynamic(() => import("./FinalSurprise"), {
  loading: () => <SectionSkeleton />,
});

const GiftReveal = dynamic(() => import("./GiftReveal"), {
  loading: () => <SectionSkeleton />,
});

export const MainPageWrapper = React.memo(function MainPageWrapper({ memories }: MainPageWrapperProps) {
  const {
    showCountdown,
    showIntro,
    showMain,
    showContent,
    handleCountdownComplete,
    handleIntroComplete,
    handleHeroComplete,
  } = useIntroFlow();

  const [cakeFailed, setCakeFailed] = useState(false);

  // Memoize error callback for InteractiveCake
  const handleCakeError = useCallback(() => {
    console.error("[MainPageWrapper] InteractiveCake failed to load/render. Skipping auto scroll.");
    setCakeFailed(true);
  }, []);

  // Initialize Lenis scroll when main experience is ready
  useLenisScroll(showMain);

  // Trigger auto scroll to interactive cake once layout is rendered (skip if cake failed)
  useAutoScroll(showContent, cakeFailed);

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
          <motion.main
            key="main"
            variants={PAGE_TRANSITION}
            initial="initial"
            animate="animate"
            className="relative min-h-[100dvh] text-white selection:bg-pink-500 selection:text-white overflow-x-hidden bg-transparent"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Background Layers */}
            <AtmosphericBackground />

            {/* Front sections z-indexed above background */}
            <div className="relative z-10">
              {/* 1. Hero Section (Netflix Intro -> Cinematic) */}
              <section id="hero">
                <HeroSection onRevealComplete={handleHeroComplete} />
              </section>

              {showContent && (
                <>
                  {/* 2. Interactive 3D Birthday Cake Section */}
                  <section id="interactive-cake" className="py-24 px-6 md:px-16 bg-black/70">
                    <div className="max-w-4xl mx-auto">
                      <ErrorBoundary
                        fallback={
                          <div className="text-center py-12 text-zinc-400 font-serif border border-zinc-800/40 rounded-xl bg-zinc-900/10">
                            🎂 Interactive cake is temporarily unavailable.
                          </div>
                        }
                        onError={handleCakeError}
                      >
                        <InteractiveCake />
                      </ErrorBoundary>
                    </div>
                  </section>

                  {/* 3. Balloon Pop Mini Game */}
                  <section id="balloon-game">
                    <BalloonGame />
                  </section>

                  {/* 4. Sealed handwritten letter wishes */}
                  <section id="wishes-letter" className="py-24 px-6 md:px-16 bg-black/50">
                    <div className="max-w-3xl mx-auto">
                      <WishesLetter />
                    </div>
                  </section>

                  {/* 5. Final Cinematic Surprise Ending */}
                  <FinalSurprise />

                  {/* 6. Journey Timeline */}
                  <Timeline />

                  {/* 7. Photo Masonry Gallery */}
                  <MemoryGallery memories={memories} />

                  {/* 8. Video memories Slider */}
                  <VideoSection memories={memories} />

                  {/* 9. Gift Reveal */}
                  <GiftReveal />
                </>
              )}
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
});

export default MainPageWrapper;
