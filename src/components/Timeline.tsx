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
  title: string;
  emoji: string;
  description: string;
  photos: string[];
}

const timelineData: TimelineItem[] = [
  {
    section: "first_memories",
    title: "🌸 Beautiful shot",
    emoji: "🌸",
    description: "The very start of a beautiful friendship. Cherishing the early days and laughing at the smallest things.",
    photos: ["/media/IMG-20251207-WA0025.jpg", "/media/IMG-20251207-WA0035.jpg"],
  },
  {
    section: "beautiful_moments",
    title: "📸 Unforgettable Memories",
    emoji: "📸",
    description: "Capturing your gorgeous smile. Unplanned coffee dates, warm talks, and the comfort of just being around you.",
    photos: ["/media/25860_ae_lite_edit (1).jpg", "/media/IMG_20260613_223016.jpg"],
  },
  {
    section: "fun_adventures",
    title: "🎈 Beautiful Moments",
    emoji: "🎈",
    description: "Exploring, making spontaneous plans, and traveling through highlights of pure laughter and joy.",
    photos: ["/media/IMG_20260614_144734~2.jpg", "/media/IMG_20260614_180206.jpg"],
  },
  {
    section: "special_days",
    title: "🌟 Special Days",
    emoji: "🌟",
    description: "Dressing up, celebrating milestones, and realizing how grateful we are for every single moment shared.",
    photos: ["/media/IMG_20260614_180315.jpg", "/media/IMG_20260614_180739.jpg"],
  },
  {
    section: "unforgettable_memories",
    title: "💖 Unforgettable Memories",
    emoji: "💖",
    description: " ",
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
          duration: 1.0,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
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
      className="relative w-full py-24 px-6 md:px-16 overflow-hidden bg-black/60"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-amber-200 text-xs uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full border border-amber-300/20 bg-amber-400/5">
            Our Timeline
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200">
            A Beautiful Friendship Journey
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mt-4 text-sm md:text-base">
            Rewinding through the key milestones of laughter, trust, and unforgettable days.
          </p>
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
                    <div className="timeline-card bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md hover:border-pink-300/30 transition-all duration-300 shadow-xl group hover:shadow-[0_10px_35px_rgba(183,110,121,0.15)]">
                      {/* Date / Category */}
                      <span className="text-pink-300 text-xs font-bold uppercase tracking-wider">
                        {item.title}
                      </span>

                      {/* Card Content */}
                      <p className="text-zinc-300 mt-4 text-sm md:text-base leading-relaxed">
                        {item.description}
                      </p>

                      {/* Polaroid images deck inside card */}
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {item.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            className="relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-800 border border-white/5 shadow-md group-hover:scale-[1.03] transition-transform duration-500 cursor-zoom-in"
                          >
                            <img
                              src={photo}
                              alt="Memory photo"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
