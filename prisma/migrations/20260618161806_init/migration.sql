-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "section" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL DEFAULT '🎉 Happy Birthday, My Amazing Friend! 🎉',
    "subtitle" TEXT NOT NULL DEFAULT 'Thank you for being one of the most wonderful people in my life.',
    "letterText" TEXT NOT NULL,
    "musicUrl" TEXT NOT NULL DEFAULT '/media/default_music.mp3',
    "daysCelebrated" INTEGER NOT NULL DEFAULT 365,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
