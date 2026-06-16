const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // 1. Create Default Admin
  const adminPassword = "birthdayfriend2026";
  const passwordHash = crypto.createHash("sha256").update(adminPassword).digest("hex");

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: passwordHash,
    },
  });
  console.log("Admin seeded:", admin.username);

  // 2. Create Default Settings
  const letterText = `Dear Friend,

Every memory we've shared has made life brighter and more meaningful.

Thank you for your kindness, support, laughter, and all the wonderful moments we've created together.

May this birthday bring happiness, success, peace, good health, and endless reasons to smile.

You truly deserve the very best.

🎂 Happy Birthday 🎂`;

  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "🎉 Happy Birthday, My Amazing Friend! 🎉",
      subtitle: "Thank you for being one of the most wonderful people in my life.",
      letterText: letterText,
      musicUrl: "/media/default_music.mp3",
      daysCelebrated: 365,
    },
  });
  console.log("Settings seeded.");

  // 3. Create Default Memories (10 Photos and 4 Videos)
  const initialMemories = [
    // Photos
    {
      type: "photo",
      url: "/media/IMG-20251207-WA0025.jpg",
      caption: "Our early days together, a beautiful start of a friendship.",
      section: "first_memories",
      order: 1,
    },
    {
      type: "photo",
      url: "/media/IMG-20251207-WA0035.jpg",
      caption: "Simple laughs that made the hardest days feel light.",
      section: "first_memories",
      order: 2,
    },
    {
      type: "photo",
      url: "/media/25860_ae_lite_edit (1).jpg",
      caption: "Capturing that glowing, unforgettable smile.",
      section: "beautiful_moments",
      order: 1,
    },
    {
      type: "photo",
      url: "/media/IMG_20260613_223016.jpg",
      caption: "A random snapshot showing how beautiful our days are.",
      section: "beautiful_moments",
      order: 2,
    },
    {
      type: "photo",
      url: "/media/IMG_20260614_144734~2.jpg",
      caption: "Making spontaneous plans and heading out.",
      section: "fun_adventures",
      order: 1,
    },
    {
      type: "photo",
      url: "/media/IMG_20260614_180206.jpg",
      caption: "Pure joy, adventure, and the best of times.",
      section: "fun_adventures",
      order: 2,
    },
    {
      type: "photo",
      url: "/media/IMG_20260614_180315.jpg",
      caption: "Dressed up and celebrating special milestones.",
      section: "special_days",
      order: 1,
    },
    {
      type: "photo",
      url: "/media/IMG_20260614_180739.jpg",
      caption: "So incredibly grateful for every single moment.",
      section: "special_days",
      order: 2,
    },
    {
      type: "photo",
      url: "/media/IMG_20260615_220045.jpg",
      caption: "Cherished chapters that will last a lifetime.",
      section: "unforgettable_memories",
      order: 1,
    },
    {
      type: "photo",
      url: "/media/IMG-20260108-WA0012.jpg",
      caption: "Always there for each other, no matter the distance.",
      section: "unforgettable_memories",
      order: 2,
    },

    // Videos
    {
      type: "video",
      url: "/media/77c99d9f0e6f4b21ba3020d96a5c9886.mp4",
      caption: "Moments in motion: A beautiful capture.",
      section: "beautiful_moments",
      order: 3,
    },
    {
      type: "video",
      url: "/media/video_20251129_173014.mp4",
      caption: "Unplanned laughter, filmed forever.",
      section: "fun_adventures",
      order: 3,
    },
    {
      type: "video",
      url: "/media/video_20260614_060100.mp4",
      caption: "A bright morning, a beautiful day.",
      section: "special_days",
      order: 3,
    },
    {
      type: "video",
      url: "/media/Kai_Project_V1~2.mp4",
      caption: "A cinematic summary of our journey.",
      section: "unforgettable_memories",
      order: 3,
    },
  ];

  await prisma.memory.deleteMany({}); // clear existing
  console.log("Existing memories cleared.");

  for (const item of initialMemories) {
    await prisma.memory.create({
      data: item,
    });
  }

  console.log(`Successfully seeded ${initialMemories.length} memories.`);
  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
