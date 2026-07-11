import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "Happy Birthday! 🎂✨ | A Cinematic Birthday Surprise",
  description:
    "A stunning cinematic birthday celebration — an immersive experience with interactive cake, balloon games, memory galleries, and heartfelt wishes crafted with love.",
  authors: [{ name: "Best Friend" }],
  openGraph: {
    title: "Happy Birthday! 🎂✨",
    description:
      "A beautiful cinematic digital birthday surprise showing our friendship journey.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Sacramento&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 text-white">
        {children}
      </body>
    </html>
  );
}
