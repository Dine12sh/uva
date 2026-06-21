"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface NetflixIntroProps {
  onComplete: () => void;
}

export function NetflixIntro({ onComplete }: NetflixIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out entire intro container and notify parent
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete,
        });
      },
    });

    // Initial state: scaled up massively, invisible
    gsap.set(textRef.current, { scale: 5, opacity: 0 });

    // The drop
    tl.to(textRef.current, {
      scale: 1,
      opacity: 1,
      duration: 2.5,
      ease: "expo.out",
    })
      // The lingering glow/slight push
      .to(textRef.current, {
        scale: 1.05,
        duration: 2,
        ease: "power1.inOut",
      })
      // The fade out of the text before the container fades
      .to(textRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1,
        ease: "power2.in",
      });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <h1
        ref={textRef}
        className="font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 via-rose-500 to-red-900 tracking-tighter uppercase drop-shadow-[0_0_50px_rgba(220,38,38,0.8)] leading-none text-center"
        style={{ fontSize: "clamp(3.5rem, 15vw, 10rem)" }}
      >
        Happy Birthday
      </h1>
    </div>
  );
}
