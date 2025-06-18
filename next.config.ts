import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["jenkins.eneseren.online"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jenkins.eneseren.online",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
