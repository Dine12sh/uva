"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useCelebrationStore } from "../store/useCelebrationStore";
import { useSoundtrack } from "../hooks/useSoundtrack";

export default function InteractiveCake() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const { triggerFireworks, triggerBalloons, triggerConfetti } = useCelebrationStore();
  const { playBirthdaySong } = useSoundtrack();

  // References to animate flames
  const flamesRef = useRef<THREE.Mesh[]>([]);
  const lightsRef = useRef<THREE.PointLight[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffe5ec, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const goldGlowLight = new THREE.PointLight(0xffb703, 1.5, 10);
    goldGlowLight.position.set(0, 2, 0);
    scene.add(goldGlowLight);

    // 3. Create 3D Cake Group
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Materials
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.1,
      metalness: 0.3,
    });

    const tier1Material = new THREE.MeshStandardMaterial({
      color: 0xffb6c1, // Rose pink frosting
      roughness: 0.4,
      bumpScale: 0.05,
    });

    const tier2Material = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White vanilla frosting
      roughness: 0.3,
    });

    const cherryMaterial = new THREE.MeshStandardMaterial({
      color: 0xd00000,
      roughness: 0.1,
    });

    const candleMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6e6fa, // lavender candle body
      roughness: 0.5,
    });

    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffb700,
    });

    // Plate/Stand
    const plateGeo = new THREE.CylinderGeometry(2.3, 2.5, 0.15, 32);
    const plate = new THREE.Mesh(plateGeo, plateMaterial);
    plate.position.y = 0.075;
    plate.receiveShadow = true;
    cakeGroup.add(plate);

    const plateStandGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.4, 32);
    const plateStand = new THREE.Mesh(plateStandGeo, plateMaterial);
    plateStand.position.y = -0.2;
    cakeGroup.add(plateStand);

    // Tier 1 (Bottom)
    const tier1Geo = new THREE.CylinderGeometry(1.8, 1.8, 1.0, 32);
    const tier1 = new THREE.Mesh(tier1Geo, tier1Material);
    tier1.position.y = 0.5 + 0.15;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Tier 1 frosting dollops (Cream swirls)
    const dollopCount = 18;
    for (let i = 0; i < dollopCount; i++) {
      const angle = (i / dollopCount) * Math.PI * 2;
      const radius = 1.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const dollopGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const dollop = new THREE.Mesh(dollopGeo, tier2Material);
      dollop.position.set(x, 1.15, z);
      dollop.scale.y = 1.3;
      cakeGroup.add(dollop);
    }

    // Tier 2 (Top)
    const tier2Geo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    const tier2 = new THREE.Mesh(tier2Geo, tier2Material);
    tier2.position.y = 1.0 + 0.4 + 0.15;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // Tier 2 piping details (pink swirls on top edge)
    const dollop2Count = 12;
    for (let i = 0; i < dollop2Count; i++) {
      const angle = (i / dollop2Count) * Math.PI * 2;
      const radius = 1.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const dollopGeo = new THREE.SphereGeometry(0.09, 8, 8);
      const dollop = new THREE.Mesh(dollopGeo, tier1Material);
      dollop.position.set(x, 1.95, z);
      dollop.scale.y = 1.3;
      cakeGroup.add(dollop);
    }

    // Cherries around the stand base
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2.0;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const cherryGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const cherry = new THREE.Mesh(cherryGeo, cherryMaterial);
      cherry.position.set(x, 0.22, z);
      cakeGroup.add(cherry);
    }

    // 4. Add Candles & Flames
    const candlesList: THREE.Mesh[] = [];
    const flamesList: THREE.Mesh[] = [];
    const lightsList: THREE.PointLight[] = [];

    const candlePositions = [
      { x: 0, z: 0 },         // Center
      { x: 0.6, z: 0.4 },     // Right Front
      { x: -0.6, z: 0.4 },    // Left Front
      { x: 0.5, z: -0.5 },    // Right Back
      { x: -0.5, z: -0.5 },   // Left Back
    ];

    candlePositions.forEach((pos, idx) => {
      // Candle cylinder
      const candleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
      const candle = new THREE.Mesh(candleGeo, candleMaterial);
      
      // Calculate top of tier 2
      const cakeHeight = 1.95;
      candle.position.set(pos.x, cakeHeight + 0.3, pos.z);
      candle.castShadow = true;
      cakeGroup.add(candle);

      // Wick
      const wickGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.1, 8);
      const wick = new THREE.Mesh(wickGeo, new THREE.MeshBasicMaterial({ color: 0x222222 }));
      wick.position.set(pos.x, cakeHeight + 0.65, pos.z);
      cakeGroup.add(wick);

      // Flame (Teardrop shape using a cone + sphere)
      const flameGeo = new THREE.ConeGeometry(0.08, 0.2, 16);
      const flame = new THREE.Mesh(flameGeo, flameMaterial);
      flame.position.set(pos.x, cakeHeight + 0.75, pos.z);
      cakeGroup.add(flame);
      flamesList.push(flame);

      // Point Light from Flame
      const flameLight = new THREE.PointLight(0xffa200, 1.2, 3);
      flameLight.position.set(pos.x, cakeHeight + 0.8, pos.z);
      flameLight.castShadow = true;
      scene.add(flameLight);
      lightsList.push(flameLight);
    });

    flamesRef.current = flamesList;
    lightsRef.current = lightsList;

    // 5. Interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      if (isDragging) {
        cakeGroup.rotation.y += deltaMove.x * 0.005;
        cakeGroup.rotation.x += deltaMove.y * 0.005;
        // Limit X rotation
        cakeGroup.rotation.x = Math.max(-0.2, Math.min(0.8, cakeGroup.rotation.x));
      }

      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY,
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      isDragging = true;
      const touch = e.touches[0];
      previousMousePosition = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevents the browser from scrolling while rotating the cake
      const touch = e.touches[0];
      const deltaMove = {
        x: touch.clientX - previousMousePosition.x,
        y: touch.clientY - previousMousePosition.y,
      };

      cakeGroup.rotation.y += deltaMove.x * 0.005;
      cakeGroup.rotation.x += deltaMove.y * 0.005;
      cakeGroup.rotation.x = Math.max(-0.2, Math.min(0.8, cakeGroup.rotation.x));

      previousMousePosition = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Use passive: false so we are allowed to call e.preventDefault()
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation if not dragging
      if (!isDragging) {
        cakeGroup.rotation.y += 0.008;
        // Float slightly up and down
        cakeGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
      }

      // Flame Flicker Animation (Sine wave variations)
      flamesRef.current.forEach((flame, index) => {
        if (flame.visible) {
          const flicker = Math.sin(elapsedTime * 15 + index * 5) * 0.06;
          flame.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
          
          // Random offset for organic motion
          flame.position.y = 1.95 + 0.75 + Math.sin(elapsedTime * 20 + index * 3) * 0.01;
          
          // Flicker lights intensity
          if (lightsRef.current[index]) {
            lightsRef.current[index].intensity = 1.0 + Math.random() * 0.4;
          }
        }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Handle Resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      
      // Dispose materials & geometries
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, []);

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);

    // Turn off flames & candle lights in Three.js objects
    flamesRef.current.forEach((flame) => {
      flame.visible = false;
    });
    lightsRef.current.forEach((light) => {
      light.intensity = 0;
    });

    // Play birthday song (Web Audio API synthesis)
    playBirthdaySong();

    // Trigger full screen celebration effects
    triggerConfetti();
    triggerFireworks();
    triggerBalloons();
    
    // Fire multiple sequential celebration bursts
    setTimeout(() => triggerFireworks(), 500);
    setTimeout(() => triggerConfetti(), 1000);
    setTimeout(() => triggerBalloons(), 1500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl max-w-xl mx-auto shadow-2xl overflow-hidden group">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-amber-500/10 pointer-events-none" />

      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-pink-300 to-rose-200 mb-2">
        🎂 Interactive Birthday Cake
      </h3>
      <p className="text-zinc-400 text-sm mb-6 text-center">
        Rotate the cake with your mouse/finger and blow the candles to celebrate!
      </p>

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-80 relative select-none cursor-grab active:cursor-grabbing"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <button
        onClick={handleBlowCandles}
        disabled={candlesBlown}
        className={`mt-6 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 active:scale-95 cursor-pointer ${
          candlesBlown
            ? "bg-zinc-700/50 border border-zinc-600/30 text-zinc-400 cursor-not-allowed shadow-none"
            : "bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 hover:scale-[1.05] hover:shadow-pink-500/30"
        }`}
      >
        {candlesBlown ? "✨ Make a Wish! ✨" : "🎂 Blow Candles"}
      </button>

      {/* Candellight Ambient Screen Glow on Active state */}
      {!candlesBlown && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75" />
      )}
    </div>
  );
}
