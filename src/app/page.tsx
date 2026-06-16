import React from "react";
import prisma from "../lib/prisma";
import MainPageWrapper from "../components/MainPageWrapper";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch site settings from SQLite
  let settings = await prisma.settings.findFirst({
    where: { id: 1 },
  });

  // Fetch all photos & videos from SQLite ordered by section & order
  const memories = await prisma.memory.findMany({
    orderBy: [
      { section: "asc" },
      { order: "asc" },
    ],
  });

  // Fallback defaults if DB is not seeded yet
  const defaultSettings = {
    title: "🎉 Happy Birthday, My Amazing Friend! 🎉",
    subtitle: "Thank you for being one of the most wonderful people in my life.",
    letterText: `Dear Friend,
Every memory we've shared has made life brighter and more meaningful.
Thank you for your kindness, support, laughter, and all the wonderful moments we've created together.
May this birthday bring happiness, success, peace, good health, and endless reasons to smile.
You truly deserve the very best.
🎂 Happy Birthday 🎂`,
    daysCelebrated: 365,
  };

  return (
    <MainPageWrapper 
      settings={settings || defaultSettings} 
      memories={memories} 
    />
  );
}
