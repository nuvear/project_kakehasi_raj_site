import { notFound, permanentRedirect } from "next/navigation";
export default async function RetiredDeploymentNotes({ params }: { params: Promise<{locale: string; slug: string}> }) {
  const { locale, slug } = await params;
  if (slug !== "ai-transformation-command-center") notFound();
  permanentRedirect(`/${locale}/apps/ai-transformation-command-center`);
}
