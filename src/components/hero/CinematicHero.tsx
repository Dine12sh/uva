"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NetflixIntro } from "./NetflixIntro";
import { HeartParticleEngine } from "./HeartParticleEngine";
import { MemoryRevealHero } from "./MemoryRevealHero";

export function CinematicHero({ onRevealComplete }: { onRevealComplete: () => void }) {
  const [introComplete, setIntroComplete] = useState(false);
  const [heroHidden, setHeroHidden] = useState(false);

  const handleExplosion = () => {
    // Restore scrolling on body and html globally
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    if ((window as any).lenis) {
      try {
        (window as any).lenis.start();
      } catch (e) {}
    }
  };

  return (
    <AnimatePresence>
      {!heroHidden && (
        <motion.section
          initial={{ opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative w-full min-h-[100dvh] h-[100dvh] bg-[#050505] overflow-hidden"
        >
          {!introComplete && (
            <NetflixIntro onComplete={() => setIntroComplete(true)} />
          )}

          {/* 
            We render the interactive hero even while intro is playing 
            so it's ready behind the black intro screen 
          */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: introComplete ? 1 : 0 }}
          >
            <HeartParticleEngine />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15),transparent_50%)] pointer-events-none" />
            <MemoryRevealHero 
              onExplode={handleExplosion} 
              onHeroComplete={() => setHeroHidden(true)} 
              onRevealComplete={onRevealComplete}
            />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
