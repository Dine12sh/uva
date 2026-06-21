"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "heart" | "sparkle";
  baseX?: number; // For parallax
  baseY?: number; // For parallax
  z?: number;     // Depth for parallax
}

export function HeartParticleEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isMobile = window.innerWidth < 768;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile = window.innerWidth < 768;
    };

    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      alpha: number,
      color: string
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      if (!isMobile) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      }
      ctx.translate(x, y);
      ctx.scale(size / 10, size / 10);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0, -3, -5, -3, -5, 0);
      ctx.bezierCurveTo(-5, 3, 0, 6, 0, 8);
      ctx.bezierCurveTo(0, 6, 5, 3, 5, 0);
      ctx.bezierCurveTo(5, -3, 0, -3, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    let frameCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      const maxParticles = isMobile ? 20 : 50;
      const particles = particlesRef.current;

      // Smooth mouse interpolation
      mouseRef.current.x += ((mouseRef.current.targetX || -1000) - (mouseRef.current.x || -1000)) * 0.1;
      mouseRef.current.y += ((mouseRef.current.targetY || -1000) - (mouseRef.current.y || -1000)) * 0.1;

      // Mouse Follow Glow Effect (Desktop Only)
      if (!isMobile && !isNaN(mouseRef.current.x) && mouseRef.current.x > 0) {
        try {
          const glow = ctx.createRadialGradient(
            mouseRef.current.x, mouseRef.current.y, 0,
            mouseRef.current.x, mouseRef.current.y, 300
          );
          glow.addColorStop(0, "rgba(244, 63, 94, 0.08)"); // Reduced glow intensity
          glow.addColorStop(1, "rgba(244, 63, 94, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } catch (e) {
          // Prevent radial gradient crashes if coordinates go out of bounds
        }
      }

      // Ambient Particle Spawner
      if (particles.length < maxParticles && frameCount % (isMobile ? 15 : 6) === 0) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          baseX: Math.random() * canvas.width,
          baseY: canvas.height + 20,
          z: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 1,
          vy: -Math.random() * 1.5 - 0.5, // Slower float up
          life: 0,
          maxLife: 200 + Math.random() * 200,
          size: Math.random() * 3 + 1.5, // Slightly smaller
          color: `hsl(${330 + Math.random() * 30}, 100%, 70%)`,
          type: Math.random() > 0.4 ? "sparkle" : "heart",
        });
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife || p.y < -50) {
          particles.splice(i, 1);
          continue;
        }

        // Base physics
        p.baseX! += p.vx;
        p.baseY! += p.vy;
        
        // Slow Parallax movement based on mouse distance from center
        const safeMouseX = isNaN(mouseRef.current.x) ? centerX : mouseRef.current.x;
        const safeMouseY = isNaN(mouseRef.current.y) ? centerY : mouseRef.current.y;
        
        const mouseOffsetX = (safeMouseX - centerX) * 0.05;
        const mouseOffsetY = (safeMouseY - centerY) * 0.05;

        p.x = p.baseX! - (mouseOffsetX / (p.z || 1));
        p.y = p.baseY! - (mouseOffsetY / (p.z || 1));
        
        // Fallback for extreme cases
        if (!isFinite(p.x)) p.x = 0;
        if (!isFinite(p.y)) p.y = 0;

        // Fade in and out
        let alpha = 1;
        if (p.life < 30) alpha = p.life / 30;
        else if (p.life > p.maxLife - 60) alpha = (p.maxLife - p.life) / 60;
        alpha = Math.max(0, Math.min(1, alpha)) * 0.25; // Caps global opacity to 0.25 so it sits firmly in background

        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, (p.size || 2) * 1.5, alpha, p.color);
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          if (!isMobile) {
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, (p.size || 2) * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
