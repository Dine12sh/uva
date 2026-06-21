import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat, Sacramento } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  weight: "400",
  subsets: ["latin"],
});

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
      className={`${playfair.variable} ${montserrat.variable} ${sacramento.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-white">
        {children}
      </body>
    </html>
  );
}
