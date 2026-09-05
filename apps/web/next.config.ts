import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  outputFileTracingIncludes: {
    "/*": ["../../content/**/*"],
    "/[locale]/**/*": ["../../content/**/*"],
    "/api/**/*": ["../../content/**/*"],
  },
};

export default nextConfig;
