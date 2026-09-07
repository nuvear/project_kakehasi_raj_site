import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {rules: {userAgent: "*", allow: "/", disallow: ["/api/", "/diary", "/apps/ai-transformation-command-center/"]}, sitemap: "https://www.rajagobalan.com/sitemap.xml", host: "https://www.rajagobalan.com"};
}
