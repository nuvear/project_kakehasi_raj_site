import type { Metadata } from "next";
import CollectionIndexPage from "@/components/CollectionIndexPage";
import { generateCollectionMetadata } from "@/lib/collection-index";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateCollectionMetadata("apps", locale);
}

export default async function AppsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  return <CollectionIndexPage collection="apps" locale={locale} />;
}
