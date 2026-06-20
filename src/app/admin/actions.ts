"use strict";

"use server";

import { revalidatePath } from "next/cache";
import { deleteMemory, updateMemory, createMemory } from "@/lib/db";
import fs from "fs/promises";
import path from "path";


// Delete memory item
export async function deleteMemoryAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const deleted = deleteMemory(id);
    if (!deleted) {
      return { success: false, error: "Memory item not found." };
    }

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
    const updated = updateMemory(data.id, {
      caption: data.caption,
      section: data.section,
      order: Number(data.order),
    });
    if (!updated) {
      return { success: false, error: "Memory item not found." };
    }

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

    // Register path in JSON Database
    const relativeUrl = `/media/${uniqueFileName}`;
    createMemory({
      type: data.type,
      url: relativeUrl,
      caption: data.caption,
      section: data.section,
      order: Number(data.order),
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Local file upload error:", e);
    return { success: false, error: "Failed to upload file to local media store." };
  }
}
