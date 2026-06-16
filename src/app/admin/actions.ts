"use strict";

"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "../../lib/prisma";
import { encryptSession } from "../../lib/cryptoSession";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

// Verify admin credential & set cookie
export async function loginAction(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD || "birthdayfriend2026";
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    
    // Fetch seeded admin record
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return { success: false, error: "Admin account not initialized." };
    }

    if (admin.passwordHash !== passwordHash) {
      return { success: false, error: "Incorrect admin password." };
    }

    // Set secure cookie session
    const encryptedToken = encryptSession({ username: admin.username, timestamp: Date.now() });
    
    const cookieStore = await cookies();
    cookieStore.set("admin_session", encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return { success: true };
  } catch (e) {
    console.error("Login action error:", e);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// Log out admin
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

// Update Global settings
export async function updateSettingsAction(data: {
  title: string;
  subtitle: string;
  letterText: string;
  daysCelebrated: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.settings.update({
      where: { id: 1 },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        letterText: data.letterText,
        daysCelebrated: Number(data.daysCelebrated),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Update settings error:", e);
    return { success: false, error: "Failed to update settings." };
  }
}

// Delete memory item
export async function deleteMemoryAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Optional: We could also delete the file from disk if desired
    await prisma.memory.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Delete memory error:", e);
    return { success: false, error: "Failed to delete memory item." };
  }
}

// Update memory item details
export async function editMemoryAction(data: {
  id: string;
  caption: string;
  section: string;
  order: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.memory.update({
      where: { id: data.id },
      data: {
        caption: data.caption,
        section: data.section,
        order: Number(data.order),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Edit memory error:", e);
    return { success: false, error: "Failed to edit memory item." };
  }
}

// Upload direct local files
export async function uploadMemoryAction(data: {
  type: "photo" | "video";
  caption: string;
  section: string;
  order: number;
  fileName: string;
  base64Data: string; // Base64 string of file
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Parse base64 content
    const base64Content = data.base64Data.split(";base64,").pop();
    if (!base64Content) {
      return { success: false, error: "Invalid file data payload." };
    }

    const fileBuffer = Buffer.from(base64Content, "base64");
    
    // Save locally to public/media
    const uploadDir = path.join(process.cwd(), "public", "media");
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique name to prevent collisions
    const fileExt = path.extname(data.fileName);
    const uniqueFileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.writeFile(filePath, fileBuffer);

    // Register path in SQLite Database
    const relativeUrl = `/media/${uniqueFileName}`;
    await prisma.memory.create({
      data: {
        type: data.type,
        url: relativeUrl,
        caption: data.caption,
        section: data.section,
        order: Number(data.order),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Local file upload error:", e);
    return { success: false, error: "Failed to upload file to local media store." };
  }
}
