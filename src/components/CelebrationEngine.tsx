"use client";

import React, { useEffect, useRef } from "react";
import { useCelebrationStore } from "../store/useCelebrationStore";
import confetti from "canvas-confetti";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
  gravity: number;
  trail: { x: number; y: number }[];
}

interface FireworkRocket {
  x: number;
  targetY: number;
  y: number;
  vy: number;
  color: string;
  radius: number;
}

interface Balloon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radiusX: number;
  radiusY: number;
  wobbleSpeed: number;
  wobbleRange: number;
  angle: number;
}

interface Heart {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface Ribbon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export default function CelebrationEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const {
    fireworkTriggerCount,
    balloonTriggerCount,
    heartTriggerCount,
    confettiTriggerCount
  } = useCelebrationStore();

  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<FireworkRocket[]>([]);
  const balloonsRef = useRef<Balloon[]>([]);
  const heartsRef = useRef<Heart[]>([]);
  const isAnimatingRef = useRef(false);

  // Setup canvas resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const checkAndStartAnimation = () => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      startAnimationLoop();
    }
  };

  // Listen to global triggers
  useEffect(() => {
    if (fireworkTriggerCount > 0) {
      launchFireworks(Math.min(3 + Math.floor(Math.random() * 3), 6));
      checkAndStartAnimation();
    }
  }, [fireworkTriggerCount]);

  useEffect(() => {
    if (balloonTriggerCount > 0) {
      spawnBalloons(35);
      checkAndStartAnimation();
    }
  }, [balloonTriggerCount]);

  useEffect(() => {
    if (heartTriggerCount > 0) {
      spawnHearts(40);
      checkAndStartAnimation();
    }
  }, [heartTriggerCount]);

  useEffect(() => {
    if (confettiTriggerCount > 0) {
      // Standard dual confetti launcher
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#B76E79", "#FFD1DC", "#DCD0FF", "#D4AF37"] // Rose gold, soft pink, lavender, gold
      });
    }
  }, [confettiTriggerCount]);

  const launchFireworks = (count: number) => {
    const isMobile = window.innerWidth < 768;
    const actualCount = isMobile ? Math.max(1, Math.floor(count * 0.6)) : count;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < actualCount; i++) {
      rocketsRef.current.push({
        x: Math.random() * width,
        y: height + 20,
        targetY: 100 + Math.random() * (height * 0.4),
        vy: -8 - Math.random() * 6,
        color: getRandomColor(),
        radius: 3 + Math.random() * 2
      });
    }
  };

  const spawnBalloons = (count: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const colors = ["#FFB6C1", "#FFD1DC", "#E6E6FA", "#D4AF37", "#B76E79"]; // Pinkish/gold/lavender
    for (let i = 0; i < count; i++) {
      balloonsRef.current.push({
        x: Math.random() * width,
        y: height + 50 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.5 - Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        radiusX: 18 + Math.random() * 8,
        radiusY: 24 + Math.random() * 8,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleRange: 0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2
      });
    }
  };

  const spawnHearts = (count: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const colors = ["#FF69B4", "#FFC0CB", "#FF1493", "#B76E79", "#E6E6FA"];
    for (let i = 0; i < count; i++) {
      heartsRef.current.push({
        x: Math.random() * width,
        y: height + 30 + Math.random() * 150,
        vx: (Math.random() - 0.5) * 2,
        vy: -1.0 - Math.random() * 2.0,
        size: 10 + Math.random() * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.7 + Math.random() * 0.3
      });
    }
  };

  const createExplosion = (x: number, y: number, color: string) => {
    const isMobile = window.innerWidth < 768;
    const isHeartBurst = !isMobile && Math.random() > 0.6; // 40% chance of a heart burst on desktop
    
    const count = isMobile ? 40 + Math.floor(Math.random() * 20) : 80 + Math.floor(Math.random() * 60);
    
    for (let i = 0; i < count; i++) {
      let vx, vy;
      
      if (isHeartBurst) {
        // Parametric equation for a heart
        const t = (i / count) * Math.PI * 2;
        const scale = 0.2 + Math.random() * 0.1;
        vx = 16 * Math.pow(Math.sin(t), 3) * scale;
        vy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
      } else {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      particlesRef.current.push({
        x: isFinite(x) ? x : 0,
        y: isFinite(y) ? y : 0,
        vx: isFinite(vx) ? vx : 0,
        vy: isFinite(vy) ? vy : 0,
        color,
        radius: 1.5 + Math.random() * (isMobile ? 1.5 : 2.5),
        alpha: 1,
        decay: 0.015 + Math.random() * 0.015,
        gravity: isHeartBurst ? 0.02 : 0.06,
        trail: []
      });
    }

    // Sparkle explosion / Golden trails
    if (Math.random() > 0.4) {
      const sparkleCount = isMobile ? 10 : 30;
      for (let i = 0; i < sparkleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * (isMobile ? 2 : 4);
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.5 ? "#FFF7C2" : "#D4AF37", // bright gold or luxury gold
          radius: 1 + Math.random(),
          alpha: 1,
          decay: 0.02 + Math.random() * 0.03,
          gravity: 0.01,
          trail: []
        });
      }
    }
  };

  const getRandomColor = () => {
    const palette = [
      "rgba(183, 110, 121, 1)", // Rose gold
      "rgba(255, 209, 220, 1)", // Soft pink
      "rgba(220, 208, 255, 1)", // Lavender
      "rgba(212, 175, 55, 1)",  // Gold
      "rgba(255, 255, 255, 1)",  // Pearl White
      "rgba(255, 182, 193, 1)", // Light pink
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  const startAnimationLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      isAnimatingRef.current = false;
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      isAnimatingRef.current = false;
      return;
    }

    let animId: number;

    const update = () => {
      // Check for idle state
      const totalParticles =
        particlesRef.current.length +
        rocketsRef.current.length +
        balloonsRef.current.length +
        heartsRef.current.length;

      if (totalParticles === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Ensure canvas is clean when idle
        isAnimatingRef.current = false;
        return; // Stop the animation loop
      }

      // Clear with slight alpha for tail trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      // 1. Process Rockets
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        
        // draw rocket spark trail
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Spawn a trailing spark
        if (Math.random() > 0.2) {
          particlesRef.current.push({
            x: r.x,
            y: r.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: 1 + Math.random(),
            color: "rgba(255, 215, 0, 0.5)",
            radius: 1,
            alpha: 0.6,
            decay: 0.04,
            gravity: 0.02,
            trail: []
          });
        }

        // Explode
        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // 2. Process Explosion Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Add subtle shadow blur for glow trail effect
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        
        ctx.fill();
        ctx.restore();
      }

      // 3. Process Balloons
      const balloons = balloonsRef.current;
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        b.angle += b.wobbleSpeed;
        b.x += b.vx + Math.sin(b.angle) * b.wobbleRange * 0.2;
        b.y += b.vy;

        // Draw balloon string & body
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;

        // String
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radiusY);
        ctx.quadraticCurveTo(b.x - 5, b.y + b.radiusY + 15, b.x + 3, b.y + b.radiusY + 30);
        ctx.stroke();

        // Balloon Body (ellipse)
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.radiusX, b.radiusY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Highlights
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.ellipse(b.x - b.radiusX * 0.35, b.y - b.radiusY * 0.35, b.radiusX * 0.3, b.radiusY * 0.3, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Bottom knot
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radiusY);
        ctx.lineTo(b.x - 4, b.y + b.radiusY + 4);
        ctx.lineTo(b.x + 4, b.y + b.radiusY + 4);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Remove if off screen
        if (b.y < -100) {
          balloons.splice(i, 1);
        }
      }

      // 4. Process Hearts
      const hearts = heartsRef.current;
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.x += h.vx;
        h.y += h.vy;

        ctx.save();
        ctx.globalAlpha = h.alpha;
        ctx.fillStyle = h.color;
        ctx.beginPath();
        
        // draw a simple heart
        const topCurveHeight = h.size * 0.3;
        ctx.moveTo(h.x, h.y + topCurveHeight);
        
        // top left curve
        ctx.bezierCurveTo(
          h.x - h.size / 2, h.y - h.size / 2, 
          h.x - h.size, h.y + h.size / 3, 
          h.x, h.y + h.size
        );
        
        // top right curve
        ctx.bezierCurveTo(
          h.x + h.size, h.y + h.size / 3, 
          h.x + h.size / 2, h.y - h.size / 2, 
          h.x, h.y + topCurveHeight
        );
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Remove if off screen
        if (h.y < -50) {
          hearts.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animId);
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
