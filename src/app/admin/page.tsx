import React from "react";
import { cookies } from "next/headers";
import prisma from "../../lib/prisma";
import { decryptSession } from "../../lib/cryptoSession";
import AdminDashboardClient from "./AdminDashboardClient";
import AdminLoginClient from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  
  const decrypted = sessionCookie ? decryptSession(sessionCookie) : null;
  const isAuthenticated = decrypted !== null;

  if (!isAuthenticated) {
    return <AdminLoginClient />;
  }

  // Fetch data to populate admin dashboard
  const settings = await prisma.settings.findFirst({
    where: { id: 1 },
  });

  const memories = await prisma.memory.findMany({
    orderBy: [
      { section: "asc" },
      { order: "asc" },
    ],
  });

  return (
    <AdminDashboardClient 
      initialSettings={settings || {
        id: 1,
        title: "🎉 Happy Birthday, My Amazing Friend! 🎉",
        subtitle: "Thank you for being one of the most wonderful people in my life.",
        letterText: "",
        musicUrl: "",
        daysCelebrated: 365
      }} 
      initialMemories={memories} 
    />
  );
}
