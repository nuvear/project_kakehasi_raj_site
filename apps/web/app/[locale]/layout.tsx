import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import ThemeDock from "@/components/ThemeDock";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeBootScript } from "@/lib/theme-script";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rajkumar Rajagobalan — Building AI-Native Enterprises",
  description: "Enterprise AI Transformation Leader, HealthTech Founder (Innuir), Stanford SEP Alumni, MIT Alumni.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
