import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Discord avatars (auth)
      { protocol: "https", hostname: "cdn.discordapp.com" },
      // YouTube thumbnails (Phase 5 video hub)
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
