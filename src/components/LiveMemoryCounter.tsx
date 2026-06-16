"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Video, Heart, Calendar } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
}

function CountUp({ end, duration = 1.5 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const endVal = end;
    if (start === endVal) {
      setCount(endVal);
      return;
    }

    const startTime = performance.now();

    const animateCount = (timestamp: number) => {
      const runtime = timestamp - startTime;
      const progress = Math.min(runtime / (duration * 1000), 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      
      const currentCount = Math.floor(easeProgress * endVal);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(endVal);
      }
    };

    requestAnimationFrame(animateCount);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}</span>;
}

interface LiveMemoryCounterProps {
  daysCelebrated?: number;
}

export default function LiveMemoryCounter({ daysCelebrated = 365 }: LiveMemoryCounterProps) {
  const stats = [
    {
      title: "Total Photos",
      value: 10,
      icon: <Camera className="text-pink-300" size={24} />,
      bg: "from-pink-500/10 to-transparent",
      border: "hover:border-pink-300/30",
    },
    {
      title: "Total Videos",
      value: 4,
      icon: <Video className="text-amber-200" size={24} />,
      bg: "from-amber-500/10 to-transparent",
      border: "hover:border-amber-300/30",
    },
    {
      title: "Total Memories",
      value: 14,
      icon: <Heart className="text-rose-400" size={24} />,
      bg: "from-rose-500/10 to-transparent",
      border: "hover:border-rose-300/30",
    },
    {
      title: "Days Celebrated",
      value: daysCelebrated,
      icon: <Calendar className="text-purple-300" size={24} />,
      bg: "from-purple-500/10 to-transparent",
      border: "hover:border-purple-300/30",
    },
  ];

  return (
    <section className="relative py-20 px-6 md:px-16 overflow-hidden bg-black/40">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ scale: 1.03 }}
              className={`relative flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 group shadow-xl ${stat.border}`}
            >
              {/* Subtle background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-20 pointer-events-none rounded-2xl`} />

              {/* Icon & Title */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-semibold text-xs tracking-wider uppercase">
                  {stat.title}
                </span>
                <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  {stat.icon}
                </div>
              </div>

              {/* Counter Value */}
              <h4 className="text-4xl md:text-5xl font-extrabold mt-6 text-white tracking-tight">
                <CountUp end={stat.value} />
                {stat.title === "Days Celebrated" && <span className="text-lg text-amber-200 ml-1">+</span>}
              </h4>

              {/* Detail label */}
              <p className="text-zinc-500 mt-2 text-xs font-medium uppercase tracking-widest">
                Registered in Database
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
