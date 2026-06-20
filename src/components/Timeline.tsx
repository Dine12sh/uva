"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineItem {
  section: string;
  emoji: string;
  photos: string[];
}

const timelineData: TimelineItem[] = [
  {
    section: "first_memories",
    emoji: "🌸",
    photos: ["/media/IMG-20251207-WA0025.jpg", "/media/IMG-20251207-WA0035.jpg"],
  },
  {
    section: "beautiful_moments",
    emoji: "📸",
    photos: ["/media/25860_ae_lite_edit (1).jpg", "/media/IMG_20260613_223016.jpg"],
  },
  {
    section: "fun_adventures",
    emoji: "🎈",
    photos: ["/media/IMG_20260614_144734~2.jpg", "/media/IMG_20260614_180206.jpg"],
  },
  {
    section: "special_days",
    emoji: "🌟",
    photos: ["/media/IMG_20260614_180315.jpg", "/media/IMG_20260614_180739.jpg"],
  },
  {
    section: "unforgettable_memories",
    emoji: "💖",
    photos: ["/media/IMG_20260615_220045.jpg", "/media/IMG-20260108-WA0012.jpg"],
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    // Animate timeline vertical line drawing
    const lineTrigger = gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 25%",
          end: "bottom 75%",
          scrub: true,
        },
      }
    );

    // Animate cards on scroll reveal
    const cards = containerRef.current.querySelectorAll(".timeline-card");
    const anims: gsap.core.Tween[] = [];
    cards.forEach((card, idx) => {
      const isLeft = idx % 2 === 0;
      const tween = gsap.fromTo(
        card,
        {
          opacity: 0,
          x: isLeft ? -80 : 80,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
      anims.push(tween);
    });

    return () => {
      lineTrigger.kill();
      anims.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="friendship-timeline"
      ref={containerRef}
      className="relative w-full py-24 px-6 md:px-16 overflow-hidden bg-transparent"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-amber-200 text-xs uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full border border-amber-300/20 bg-amber-400/5">
            Our Timeline
          </span>
          <h2 className="text-3xl md:text-5xl font-serif mt-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200 drop-shadow-[0_2px_15px_rgba(255,182,193,0.3)] tracking-wide">
            A Beautiful Friendship Journey
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12">
          {/* Background Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[4px] bg-zinc-800 rounded-full transform -translate-x-1/2 pointer-events-none" />

          {/* Glowing Animated Scroll Line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-rose-400 via-pink-500 to-amber-400 rounded-full transform -translate-x-1/2 origin-top pointer-events-none shadow-[0_0_10px_rgba(244,63,94,0.5)]"
          />

          {/* Timeline Nodes */}
          <div className="space-y-20">
            {timelineData.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start md:items-center w-full ${isLeft ? "md:flex-row-reverse" : ""
                    }`}
                >
                  {/* Timeline bullet node */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-slate-900 border-[3px] border-pink-400 shadow-[0_0_10px_rgba(244,63,94,0.4)] flex items-center justify-center text-xs z-10 transform -translate-x-1/2">
                    <span className="scale-75">{item.emoji}</span>
                  </div>

                  {/* Card wrapper */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                    <div className="timeline-card bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all duration-700 shadow-[0_15px_40px_rgba(0,0,0,0.5)] group hover:shadow-[0_20px_60px_rgba(183,110,121,0.25)] hover:-translate-y-2">
                      {/* Polaroid images deck inside card */}
                      <div className="grid grid-cols-2 gap-4">
                        {item.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-800 shadow-[0_15px_30px_rgb(0,0,0,0.4)] group-hover:scale-[1.04] transition-all duration-700 cursor-zoom-in group/photo"
                          >
                            <img
                              src={photo}
                              alt="Memory photo"
                              className="w-full h-full object-cover transform scale-105 group-hover/photo:scale-[1.2] transition-transform duration-[1500ms] ease-out origin-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-700 mix-blend-overlay" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Empty Spacer column on opposite side */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
