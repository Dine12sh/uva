import React from "react";
import { getMemories } from "@/lib/db";
import MainPageWrapper from "../components/MainPageWrapper";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all photos & videos from JSON Database ordered by section & order
  const memories = getMemories();

  return (
    <MainPageWrapper 
      memories={memories} 
    />
  );
}
