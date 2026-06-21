"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PolaroidScratchCardProps {
  id: number;
  url: string;
  caption: string;
  isFinal: boolean;
  onNext: () => void;
}

export const PolaroidScratchCard = React.memo(function PolaroidScratchCard({
  id,
  url,
  caption,
  isFinal,
  onNext,
}: PolaroidScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showNext, setShowNext] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    if (!showTypewriter) return;

    const fullText = caption;
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, currentIdx));
      currentIdx++;
      
      if (currentIdx > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowNext(true), 500);
      }
    }, 50);

    return () => clearInterval(interval);
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

    if (percentage > 65) {
      setIsRevealed(true);
      // Trigger typewriter slightly after the Polaroid pop animation
      setTimeout(() => setShowTypewriter(true), 1200);
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
      >
        {/* The Polaroid Card */}
        <motion.div
          animate={
            isRevealed
              ? {
                  scale: [0.4, 1.15, 1],
                  rotate: [-18, 5, 0],
                  filter: ["blur(10px)", "blur(0px)", "blur(0px)"],
                  opacity: 1
                }
              : { scale: 1, rotate: 0, filter: "blur(0px)", opacity: 1 }
          }
          transition={{
            duration: 1.2,
            times: [0, 0.6, 1],
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          className={`absolute inset-0 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.1)] flex flex-col items-center p-4 pb-16 origin-center ${isRevealed ? "z-30" : "z-10"}`}
        >
          {/* Photo inner container */}
          <div className="relative w-full h-full bg-zinc-900 overflow-hidden shadow-inner">
            <Image
              src={url}
              alt="Memory"
              fill
              sizes="(max-width: 768px) 16rem, 20rem"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Glossy reflection on polaroid photo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Typewriter Text area on the white bottom border of Polaroid */}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="absolute -bottom-16 md:-bottom-24 z-40 scale-90 md:scale-100"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onPointerDown={(e) => {
                // Immediate visual feedback bypasses React/Framer event loop lag
                e.currentTarget.style.transform = "scale(0.95)";
                e.currentTarget.style.boxShadow = "0 0 60px rgba(244,63,94,1)";
                setTimeout(() => {
                  if (e.currentTarget) {
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }, 100);
              }}
              onClick={onNext}
              className={`px-8 py-4 rounded-full font-bold text-lg text-white shadow-2xl transition-all duration-300 hover:scale-105 ${
                isFinal
                  ? "bg-gradient-to-r from-red-500 to-pink-600 shadow-[0_0_40px_rgba(244,63,94,0.8)] animate-pulse"
                  : "bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-pink-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              }`}
            >
              {isFinal ? "💖 Open My Heart" : "Next Memory ➔"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
