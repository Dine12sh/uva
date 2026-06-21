"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import { Lock, Sparkles } from "lucide-react";
// @ts-ignore
import Image from "next/image";

interface ScratchCardProps {
  id: number;
  url: string;
  caption: string;
  isLocked: boolean;
  isActive: boolean;
  isRevealed: boolean;
  onReveal: () => void;
}

export const ScratchCard = React.memo(function ScratchCard({
  id,
  url,
  caption,
  isLocked,
  isActive,
  isRevealed,
  onReveal,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas resolution to match container size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw premium scratch surface (Rose Gold Gradient)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#D4AF37"); // Gold
    gradient.addColorStop(0.5, "#B76E79"); // Rose Gold
    gradient.addColorStop(1, "#FFB6C1"); // Blush Pink

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise texture for scratch card feel
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
      imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise));
      imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Add Text "Scratch to Reveal" if active
    ctx.font = "bold 20px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText("Scratch Me", canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;

  }, [isRevealed]); // Only re-run if revealed state changes (should unmount anyway)

  const checkCompletion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentPixels = 0;

    // Check alpha channel (every 4th byte)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const percentage = (transparentPixels / totalPixels) * 100;

    if (percentage > 50) {
      onReveal();
    }
  }, [onReveal]);

  // Handle Drawing (Scratching)
  const scratch = useCallback((clientX: number, clientY: number) => {
    if (!isActive || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    // Calculate scale in case of CSS transforms
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Spawn tiny particles for visual feedback
    if (Math.random() > 0.7) {
      const id = Date.now() + Math.random();
      setParticles((prev) => [...prev, { id, x: clientX - rect.left, y: clientY - rect.top }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 800);
    }
  }, [isActive, isRevealed]);

  const handlePointerDown = (e: any) => {
    if (!isActive || isRevealed) return;
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: any) => {
    if (!isDrawing || !isActive || isRevealed) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    if (isActive && !isRevealed) {
      checkCompletion();
    }
  };

  return (
    <div className="relative flex flex-col items-center group">
      <motion.div
        ref={containerRef}
        animate={{
          scale: isActive && !isRevealed ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isActive && !isRevealed ? Infinity : 0,
          ease: "easeInOut"
        }}
        className={`relative w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden border transition-all duration-700 ${
          isActive ? "border-pink-400 shadow-[0_0_30px_rgba(244,63,94,0.5)] cursor-crosshair z-20" : 
          isRevealed ? "border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-10" : 
          "border-white/5 opacity-50 grayscale cursor-not-allowed"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Underlying Image */}
        <Image
          src={url}
          alt={`Memory ${id}`}
          fill
          sizes="(max-width: 768px) 12rem, 16rem"
          className={`object-cover transition-transform duration-[2000ms] ${isRevealed ? "scale-110" : "scale-100"}`}
          unoptimized
        />

        {/* Scratch Canvas Overlay */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full touch-none"
              style={{ touchAction: "none" }}
            />
          )}
        </AnimatePresence>

        {/* Lock Overlay */}
        <AnimatePresence>
          {isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <Lock className="w-8 h-8 text-white/50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scratch Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: p.x, y: p.y, scale: Math.random() * 0.5 + 0.5 }}
            animate={{ opacity: 0, y: p.y + 50, x: p.x + (Math.random() - 0.5) * 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-gold pointer-events-none"
            style={{ backgroundColor: "#D4AF37", boxShadow: "0 0 10px #D4AF37" }}
          />
        ))}

        {/* Completed Sparkles */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent mix-blend-overlay" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Memory Caption */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-12 w-[150%] text-center"
          >
            <p className="text-sm md:text-base font-serif text-pink-100 tracking-wide bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl inline-block">
              {caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
