import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the floating N in the corner is Next's dev overlay. It sits on top of the
  // page and gets in the way when judging how something actually looks.
  // Compile and runtime errors still surface without it.
  devIndicators: false,
};

export default nextConfig;
