import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  outputFileTracingIncludes: {
    "/*": ["../../content/**/*"],
    "/[locale]/**/*": ["../../content/**/*"],
    "/api/**/*": ["../../content/**/*"]
  }
};

export default nextConfig;
