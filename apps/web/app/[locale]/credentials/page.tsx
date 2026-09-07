import type { Metadata } from "next";
import CredentialTabs from "@/components/CredentialTabs";
import DetailPageShell from "@/components/DetailPageShell";
import { getProfileCredentials } from "@/lib/profile-credentials";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";

  return {
    title: isJa
      ? "資格・認定 | Rajkumar Rajagobalan"
      : "Credentials and Certifications | Rajkumar Rajagobalan",
    description: isJa
      ? "Rajkumar Rajagobalanの資格・認定の一覧。"
      : "Credentials and certifications across executive leadership, AI, IoT, blockchain, and data science.",
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/credentials`,
      languages: {
        en: "https://www.rajagobalan.com/en/credentials",
        ja: "https://www.rajagobalan.com/ja/credentials",
      },
    },
  };
}

export default async function CredentialsPage({ params }: PageProps) {
  const { locale } = await params;
  const isJa = locale === "ja";
  const oppositeLocale = isJa ? "en" : "ja";
  const { copy, credentials } = getProfileCredentials(locale);

  return (
    <DetailPageShell
      active="none"
      backHref={`/${locale}#credentials`}
      backLabel={copy.backLabel}
      badge={copy.badge}
      languageHref={`/${oppositeLocale}/credentials`}
      locale={locale}
      summary={copy.summary}
      title={copy.title}
      wide
    >
      <CredentialTabs copy={copy} credentials={credentials} locale={locale} />
    </DetailPageShell>
  );
}
