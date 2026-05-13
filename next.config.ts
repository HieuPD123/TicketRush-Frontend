import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "salt.tkbcdn.com",
        pathname: "/**",
      },
      // add other allowed remote patterns here
    ],
  },
};

export default nextConfig;
