"use client";

import { useState } from "react";
import { NetflixIntro } from "./NetflixIntro";
import { HeartParticleEngine } from "./HeartParticleEngine";
import { FloatingMemories } from "./FloatingMemories";

export function CinematicHero() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleExplosion = () => {
    // Scroll down smoothly to the next section (e.g., MemoryGallery)
    // Wait for the GSAP explosion animation to visually obscure the screen
    setTimeout(() => {
      const target = document.getElementById("memory-timeline");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback if ID doesn't exist yet, scroll down 100vh
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      }
    }, 1000);
  };

  return (
    <section className="relative w-full h-screen bg-[#050505] overflow-hidden">
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
        <FloatingMemories onExplode={handleExplosion} />
      </div>
    </section>
  );
}
