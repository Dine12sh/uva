import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UVA ❤️ | Happy Birthday Yuvashree",
    short_name: "UVA ❤️",
    description: "A cinematic birthday surprise website created for Yuvashree. Explore beautiful memories, heartfelt wishes, interactive moments, and a magical birthday experience.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
