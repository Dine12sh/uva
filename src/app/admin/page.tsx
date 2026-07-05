import React from "react";
import { getMemories } from "@/lib/db";


export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Fetch data to populate admin dashboard from JSON Database
  const memories = getMemories();


}
