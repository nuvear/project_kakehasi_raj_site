import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DM_Sans, Libre_Caslon_Display } from "next/font/google";
import ThemeDock from "@/components/ThemeDock";
import { ThemeProvider } from "@/components/ThemeProvider";
import { isPublicLocale, PUBLIC_LOCALES } from "@/lib/i18n";
import { themeBootScript } from "@/lib/theme-script";
import "../globals.css";
import "../campus.css";

const inter = DM_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Libre_Caslon_Display({
  weight: "400",
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rajkumar Rajagobalan — Building AI-Native Enterprises",
  description:
    "Enterprise AI Transformation Leader, HealthTech Founder (Innuir), Stanford SEP Alumni, MIT Alumni.",
};

export function generateStaticParams() {
  return PUBLIC_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isPublicLocale(locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript() }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ThemeProvider>
          {children}
          <ThemeDock locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
