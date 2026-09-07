import { notFound, permanentRedirect } from "next/navigation";
export default async function RetiredFramework({ params }: { params: Promise<{locale: string; slug: string}> }) {
  const { locale, slug } = await params;
  if (slug !== "enterprise-ai-transformation") notFound();
  permanentRedirect(`/${locale}/apps/ai-transformation-command-center`);
}
