"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register GSAP ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineItem {
  section: string;
  title: string;
  description: string;
  emoji: string;
  photos: string[];
}

const timelineData: TimelineItem[] = [
  {
    section: "YOUR_memories",
    title: "YOUR_memories",
    description: "Capturing glowing smiles and random snapshots of joy.",
    emoji: "🌸",
    photos: ["/media/IMG-20251207-WA0025.jpg", "/media/IMG-20251207-WA0035.jpg"],
  },
  {
    section: "beautiful_moments",
    title: "Beautiful Moments",
    description: " Every snapshot tells a Jolly story.",
    emoji: "📸",
    photos: ["/media/25860_ae_lite_edit (1).jpg", "/media/IMG_20260613_223016.jpg"],
  },

  {
    section: "special_days",
    title: "Special Days",
    description: "Dressed up, celebrating milestones, and feeling grateful.",
    emoji: "🌟",
    photos: ["/media/IMG_20260614_180315.jpg"],
  },
  {
    section: "unforgettable_memories",
    title: "Unforgettable Memories",
    description: "Always there for each other, chapters that will last a lifetime.",
    emoji: "💖",
    photos: ["/media/IMG-20260108-WA0012.jpg"],
  },
];

const Timeline = React.memo(function Timeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const selector = gsap.utils.selector(container);

      if (prefersReducedMotion) {
        // Instant visual states for accessibility with no movement
        gsap.set(line, { scaleY: 1 });
        const cards = selector(".timeline-card");
        gsap.set([container, cards], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // 1. Draw the scroll line from 0 to 1 as the timeline scrolls through viewport
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 65%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        }
      );

      // 2. Fade up the entire timeline section container when it enters viewport
      gsap.fromTo(
        container,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            once: true,
          }
        }
      );

      // 4. Stagger reveal all memory cards as timeline enters viewport
      const cards = selector(".timeline-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            once: true,
          }
        }
      );
    }, containerRef);

    // Refresh ScrollTrigger when images load to update calculations
    const images = container.querySelectorAll("img");
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    images.forEach((img) => {
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener("load", handleLoad);
      }
    });

    // Resize observer to handle dynamic layout shifts from dynamic components (e.g. 3D Cake)
    let resizeObserver: ResizeObserver | null = null;
    let rAF: number | null = null;
    if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        if (rAF) cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      ctx.revert();
      images.forEach((img) => {
        img.removeEventListener("load", handleLoad);
      });
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (rAF) {
        cancelAnimationFrame(rAF);
      }
    };
  }, []);

  return (
    <section
      id="friendship-timeline"
      ref={containerRef}
      className="relative z-[20] w-full py-24 px-6 md:px-16 overflow-hidden bg-transparent"
    >
      <div className="max-w-6xl mx-auto relative z-[25]">
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
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-[4px] bg-zinc-800 rounded-full transform -translate-x-1/2 pointer-events-none" />

          {/* Glowing Animated Scroll Line */}
          <div
            ref={lineRef}
            className="absolute left-5 md:left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-rose-400 via-pink-500 to-amber-400 rounded-full transform -translate-x-1/2 origin-top pointer-events-none shadow-[0_0_10px_rgba(244,63,94,0.5)]"
            style={{ willChange: "transform" }}
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
                  <div className="absolute left-5 md:left-1/2 w-8 h-8 rounded-full bg-slate-900 border-[3px] border-pink-400 shadow-[0_0_10px_rgba(244,63,94,0.4)] flex items-center justify-center text-xs z-10 transform -translate-x-1/2">
                    <span className="scale-75">{item.emoji}</span>
                  </div>

                  {/* Card wrapper */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                    <div
                      className="timeline-card bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-all duration-700 shadow-[0_15px_40px_rgba(0,0,0,0.5)] group hover:shadow-[0_20px_60px_rgba(183,110,121,0.25)] hover:-translate-y-2"
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div className="mb-6">
                        <h3 className="text-xl md:text-2xl font-bold text-pink-200 mb-2">{item.title}</h3>
                        <p className="text-zinc-400 text-sm">{item.description}</p>
                      </div>

                      {/* Polaroid images deck inside card */}
                      <div className="grid grid-cols-2 gap-4">
                        {item.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-800 shadow-[0_15px_30px_rgb(0,0,0,0.4)] group-hover:scale-[1.04] transition-all duration-700 cursor-zoom-in group/photo"
                          >
                            <Image
                              src={photo}
                              alt={`${item.title} - memory photo ${pIdx + 1}`}
                              fill
                              sizes="(max-width: 768px) 45vw, 20vw"
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                              className="object-cover transform scale-105 group-hover/photo:scale-[1.2] transition-transform duration-[1500ms] ease-out origin-center"
                              unoptimized
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
});

export default Timeline;
