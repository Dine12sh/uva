"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NetflixIntro } from "./NetflixIntro";
import { HeartParticleEngine } from "./HeartParticleEngine";
import { MemoryRevealHero } from "./MemoryRevealHero";

export function CinematicHero() {
  const [introComplete, setIntroComplete] = useState(false);
  const [heroHidden, setHeroHidden] = useState(false);

  const handleExplosion = () => {
    // Scroll down smoothly to the next section immediately
    setTimeout(() => {
      const target = document.getElementById("friendship-timeline");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback if ID doesn't exist yet, scroll down 100vh
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      }
    }, 100); // Only a 100ms micro-delay to allow DOM to register the Timeline mount
  };

  return (
    <AnimatePresence>
      {!heroHidden && (
        <motion.section
          initial={{ height: "100dvh", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative w-full bg-[#050505] overflow-hidden"
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
            <MemoryRevealHero onExplode={handleExplosion} onHeroComplete={() => setHeroHidden(true)} />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
