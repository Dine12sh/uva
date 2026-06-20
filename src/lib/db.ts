import fs from "fs";
import path from "path";

export interface Memory {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  section: string;
  order: number;
  createdAt: string;
}

const DB_FILE = path.join(process.cwd(), "src/data/db.json");

const DEFAULT_MEMORIES: Memory[] = [
  // Photos
  {
    id: "mem-1",
    type: "photo",
    url: "/media/IMG-20251207-WA0025.jpg",
    caption: "Our early days together, a beautiful start of a friendship.",
    section: "first_memories",
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-2",
    type: "photo",
    url: "/media/IMG-20251207-WA0035.jpg",
    caption: "Simple laughs that made the hardest days feel light.",
    section: "first_memories",
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-3",
    type: "photo",
    url: "/media/25860_ae_lite_edit (1).jpg",
    caption: "Capturing that glowing, unforgettable smile.",
    section: "beautiful_moments",
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-4",
    type: "photo",
    url: "/media/IMG_20260613_223016.jpg",
    caption: "A random snapshot showing how beautiful our days are.",
    section: "beautiful_moments",
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-5",
    type: "photo",
    url: "/media/IMG_20260614_144734~2.jpg",
    caption: "Making spontaneous plans and heading out.",
    section: "fun_adventures",
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-6",
    type: "photo",
    url: "/media/IMG_20260614_180206.jpg",
    caption: "Pure joy, adventure, and the best of times.",
    section: "fun_adventures",
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-7",
    type: "photo",
    url: "/media/IMG_20260614_180315.jpg",
    caption: "Dressed up and celebrating special milestones.",
    section: "special_days",
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-8",
    type: "photo",
    url: "/media/IMG_20260614_180739.jpg",
    caption: "So incredibly grateful for every single moment.",
    section: "special_days",
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-9",
    type: "photo",
    url: "/media/IMG_20260615_220045.jpg",
    caption: "Cherished chapters that will last a lifetime.",
    section: "unforgettable_memories",
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-10",
    type: "photo",
    url: "/media/IMG-20260108-WA0012.jpg",
    caption: "Always there for each other, no matter the distance.",
    section: "unforgettable_memories",
    order: 2,
    createdAt: new Date().toISOString(),
  },
  // Videos
  {
    id: "mem-11",
    type: "video",
    url: "/media/77c99d9f0e6f4b21ba3020d96a5c9886.mp4",
    caption: "Moments in motion: A beautiful capture.",
    section: "beautiful_moments",
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-12",
    type: "video",
    url: "/media/video_20251129_173014.mp4",
    caption: "Unplanned laughter, filmed forever.",
    section: "fun_adventures",
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-13",
    type: "video",
    url: "/media/video_20260614_060100.mp4",
    caption: "A bright morning, a beautiful day.",
    section: "special_days",
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mem-14",
    type: "video",
    url: "/media/Kai_Project_V1~2.mp4",
    caption: "A cinematic summary of our journey.",
    section: "unforgettable_memories",
    order: 3,
    createdAt: new Date().toISOString(),
  },
];

interface DBData {
  memories: Memory[];
}

function readDB(): DBData {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Create directory if it doesn't exist
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const initialData = { memories: DEFAULT_MEMORIES };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read database file, returning defaults:", error);
    return { memories: DEFAULT_MEMORIES };
  }
}

function writeDB(data: DBData) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write to database file:", error);
  }
}

export function getMemories(): Memory[] {
  const memories = readDB().memories;
  // Sort by section asc, order asc
  return memories.sort((a, b) => {
    if (a.section !== b.section) {
      return a.section.localeCompare(b.section);
    }
    return a.order - b.order;
  });
}

export function createMemory(data: Omit<Memory, "id" | "createdAt">): Memory {
  const db = readDB();
  const newMemory: Memory = {
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  db.memories.push(newMemory);
  writeDB(db);
  return newMemory;
}

export function updateMemory(id: string, data: Partial<Omit<Memory, "id" | "createdAt">>): Memory | null {
  const db = readDB();
  const idx = db.memories.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  db.memories[idx] = { ...db.memories[idx], ...data };
  writeDB(db);
  return db.memories[idx];
}

export function deleteMemory(id: string): boolean {
  const db = readDB();
  const initialLength = db.memories.length;
  db.memories = db.memories.filter((m) => m.id !== id);
  if (db.memories.length === initialLength) return false;
  writeDB(db);
  return true;
}
