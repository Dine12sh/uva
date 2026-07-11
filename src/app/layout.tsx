import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display, Sacramento } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  variable: "--font-sacramento",
  weight: ["400"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://uva-umber.vercel.app"),
  title: {
    default: "UVA ❤️ | Happy Birthday Yuvashree",
    template: "%s | UVA ❤️",
  },
  description:
    "A cinematic birthday surprise website created for Yuvashree. Explore beautiful memories, heartfelt wishes, interactive moments, and a magical birthday experience.",
  keywords: [
    "UVA",
    "UVA Birthday",
    "Birthday UVA",
    "Yuvashree",
    "Happy Birthday Yuvashree",
    "Yuvashree Birthday",
    "Yuvashree Birthday Story",
    "UVA Birthday Surprise",
    "UVA Birthday Website",
    "Birthday Surprise",
    "Birthday Gift",
    "Birthday Gift Website",
    "Interactive Birthday Website",
    "Cinematic Birthday Experience",
    "Memory Gallery",
    "Photo Memories",
    "Birthday Memories",
    "Personalized Birthday Gift",
    "UVA Story",
    "Digital Birthday Card",
    "Romantic Surprise",
    "Next.js Birthday Website",
  ],
  authors: [{ name: "Best Friend", url: "https://uva-umber.vercel.app" }],
  creator: "Best Friend",
  publisher: "UVA Story",
  category: "Personal",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "UVA ❤️ | Happy Birthday Yuvashree",
    description:
      "A cinematic birthday surprise website created for Yuvashree. Explore beautiful memories, heartfelt wishes, interactive moments, and a magical birthday experience.",
    url: "https://uva-umber.vercel.app",
    siteName: "UVA Birthday",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UVA | Happy Birthday Yuvashree",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UVA ❤️ | Happy Birthday Yuvashree",
    description:
      "A cinematic birthday surprise website created for Yuvashree. Explore beautiful memories, heartfelt wishes, interactive moments, and a magical birthday experience.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://uva-umber.vercel.app/#website",
      "name": "UVA Birthday Story",
      "url": "https://uva-umber.vercel.app",
      "description": "A cinematic birthday surprise website created for Yuvashree. Explore beautiful memories, heartfelt wishes, interactive moments, and a magical birthday experience.",
      "inLanguage": "en",
      "publisher": {
        "@type": "Organization",
        "name": "UVA Story",
        "url": "https://uva-umber.vercel.app"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://uva-umber.vercel.app/#person",
      "name": "Yuvashree",
      "description": "Recipient of the cinematic digital birthday surprise story website.",
      "birthDate": "2001-07-31",
      "sameAs": []
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://uva-umber.vercel.app"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "@id": "https://uva-umber.vercel.app/og-image.png",
      "url": "https://uva-umber.vercel.app/og-image.png",
      "width": "1200",
      "height": "630",
      "caption": "UVA ❤️ | Happy Birthday Yuvashree"
    }
  ];

  return (
    <html
      lang="en"
      className={`h-full antialiased ${montserrat.variable} ${playfairDisplay.variable} ${sacramento.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 text-white">
        {children}
      </body>
    </html>
  );
}

