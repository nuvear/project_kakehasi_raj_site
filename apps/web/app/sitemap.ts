import type { MetadataRoute } from "next";
import { getMarketingSitemapEntries } from "@/lib/marketing-sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getMarketingSitemapEntries();
}
