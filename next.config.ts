import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["immoinbox.dev.userv.info"],
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
