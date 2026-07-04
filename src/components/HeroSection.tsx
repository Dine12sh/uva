"use client";

import { CinematicHero } from "./hero/CinematicHero";

export default function HeroSection({ onRevealComplete }: { onRevealComplete: () => void }) {
  return <CinematicHero onRevealComplete={onRevealComplete} />;
}
