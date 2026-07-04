"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";

interface PolaroidScratchCardProps {
  id: number;
  url: string;
  caption: string;
  isFinal: boolean;
  disabled?: boolean;
  isPriority?: boolean;
  onNext: () => void;
  buttonText?: string;
}

export const PolaroidScratchCard = React.memo(function PolaroidScratchCard({
  id,
  url,
  caption,
  isFinal,
  disabled: parentDisabled,
  isPriority,
  onNext,
  buttonText,
}: PolaroidScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowBurstRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    if (!showTypewriter) return;

    const fullText = caption;
    let currentIdx = 0;
    let buttonTimeout: NodeJS.Timeout;

    // Fade in button earlier (300ms after typewriter starts)
    buttonTimeout = setTimeout(() => {
      setShowNext(true);
    }, 300);
    
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, currentIdx));
      currentIdx++;
      
      if (currentIdx > fullText.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      clearTimeout(buttonTimeout);
    };
  }, [showTypewriter, caption]);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw premium frosted luxury surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#D4AF37"); // Gold
    gradient.addColorStop(0.5, "#B76E79"); // Rose Gold
    gradient.addColorStop(1, "#FFB6C1"); // Blush Pink

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise texture
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
      imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise));
      imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Add "Scratch to Reveal" Text
    ctx.font = "bold 24px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText("Scratch Memory", canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;

  }, [isRevealed]);

  // Clean up GSAP animations on unmount
  useEffect(() => {
    return () => {
      if (buttonRef.current) {
        gsap.killTweensOf(buttonRef.current);
      }
      if (glowBurstRef.current) {
        gsap.killTweensOf(glowBurstRef.current);
      }
      if (rippleRef.current) {
        gsap.killTweensOf(rippleRef.current);
      }
    };
  }, []);

  const checkCompletion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const percentage = (transparentPixels / totalPixels) * 100;

    // Trigger reveal at 50% completion
    if (percentage > 50) {
      setIsRevealed(true);
      // Trigger typewriter slightly after the Polaroid pop animation starts
      setTimeout(() => setShowTypewriter(true), 600);
    }
  }, []);

  const scratch = useCallback((clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
  }, [isRevealed]);

  const handlePointerDown = (e: any) => {
    if (isRevealed) return;
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: any) => {
    if (!isDrawing || isRevealed) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    if (!isRevealed) {
      checkCompletion();
    }
  };

  // Central click handler with navigation lock, animations, and haptics
  const handleNextClick = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    if (parentDisabled || isNavigating) return;
    setIsNavigating(true);

    // Haptic feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (err) {}
    }

    const btn = buttonRef.current;
    if (btn) {
      gsap.killTweensOf(btn);
      gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: "power2.out" });

      if (glowBurstRef.current) {
        gsap.killTweensOf(glowBurstRef.current);
        gsap.fromTo(glowBurstRef.current,
          { scale: 0.8, opacity: 0.8 },
          { scale: 2.5, opacity: 0, duration: 0.45, ease: "power2.out" }
        );
      }

      if (rippleRef.current) {
        gsap.killTweensOf(rippleRef.current);
        const rect = btn.getBoundingClientRect();
        // Fallback to center coordinates if not a mouse event
        const clientX = e && 'clientX' in e ? e.clientX : rect.left + rect.width / 2;
        const clientY = e && 'clientY' in e ? e.clientY : rect.top + rect.height / 2;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        gsap.set(rippleRef.current, { x, y, scale: 0, opacity: 0.6 });
        gsap.to(rippleRef.current, {
          scale: 3,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out"
        });
      }
    }

    onNext();
  }, [parentDisabled, isNavigating, onNext]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNextClick(e);
    }
  };

  // Determine button text dynamically
  const defaultText = isFinal ? "💖 Open My Heart" : "Next Memory →";
  const displayedText = buttonText || defaultText;

  return (
    <div className="relative flex flex-col items-center">
      {/* Main Card Container */}
      <motion.div 
        ref={containerRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative w-[min(90vw,340px)] md:w-[28vw] md:min-w-[320px] md:max-w-[420px] aspect-[4/5] rounded-xl overflow-visible select-none"
        style={{ transformStyle: "preserve-3d" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        aria-label="Scratchable Memory Card"
        role="button"
        tabIndex={0}
      >
        {/* The Polaroid Card */}
        <motion.div
          animate={
            isRevealed
              ? {
                  scale: 1,
                  rotate: 0,
                  filter: "blur(0px)",
                  opacity: 1
                }
              : { scale: 1, rotate: 0, filter: "blur(0px)", opacity: 1 }
          }
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className={`absolute inset-0 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.1)] flex flex-col items-center p-4 pb-16 origin-center ${isRevealed ? "z-30" : "z-10"}`}
        >
          {/* Photo inner container */}
          <div className="relative w-full h-full bg-zinc-900 overflow-hidden shadow-inner">
            <Image
              src={url}
              alt="Memory"
              fill
              priority={isPriority}
              sizes="(max-width: 768px) 16rem, 20rem"
              className="object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Typewriter Text area */}
          <div className="absolute bottom-2 left-0 w-full px-6 flex flex-col items-center justify-center h-14">
            <div className="font-cursive text-zinc-800 text-lg md:text-xl text-center whitespace-pre-wrap leading-tight">
              {typedText}
              {showTypewriter && typedText.length < caption.length + 1 && (
                <span className="animate-pulse">|</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Scratch Canvas Overlay */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full z-20 cursor-crosshair rounded-xl shadow-[0_0_40px_rgba(244,63,94,0.3)]"
              style={{ touchAction: "none" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action Button (Next Memory or Finale) */}
      <AnimatePresence>
        {showNext && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="absolute -bottom-16 md:-bottom-24 z-40 scale-90 md:scale-100"
          >
            <button
              ref={buttonRef}
              disabled={parentDisabled || isNavigating}
              onClick={(e) => handleNextClick(e)}
              onKeyDown={handleKeyDown}
              aria-label={isFinal ? "Open My Heart" : "Next Memory"}
              className={`relative overflow-hidden px-8 py-4 rounded-full font-bold text-lg text-white shadow-2xl transition-all duration-300 pointer-events-auto ${
                (parentDisabled || isNavigating) ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
              } ${
                isFinal
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 shadow-[0_0_40px_rgba(244,63,94,0.8)] hover:shadow-[0_0_50px_rgba(244,63,94,0.95)]"
                  : "bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-pink-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              }`}
              style={{ transform: "scale(1)", transformOrigin: "center" }}
            >
              {/* Pink Glow Burst Element */}
              <span 
                ref={glowBurstRef}
                className="absolute inset-0 rounded-full bg-pink-500 blur-md pointer-events-none opacity-0"
                style={{ transform: "scale(0.8)", mixBlendMode: "screen" }}
              />
              
              {/* Ripple Element */}
              <span 
                ref={rippleRef}
                className="absolute w-10 h-10 -ml-5 -mt-5 bg-white/40 rounded-full pointer-events-none opacity-0"
                style={{ left: 0, top: 0 }}
              />

              <span className="relative z-10 flex items-center gap-2">
                {isNavigating && (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {displayedText}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
