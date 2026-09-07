import type { NextConfig } from "next";
import path from "path";
import { retiredRedirects } from "./lib/retired-paths";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() { return retiredRedirects; },
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  outputFileTracingIncludes: {
    "/*": ["../../content/**/*"],
    "/[locale]/**/*": ["../../content/**/*"],
    "/api/**/*": ["../../content/**/*"],
  },
};

export default nextConfig;
