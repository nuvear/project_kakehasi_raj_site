"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function ThemeDock({ locale }: { locale: string }) {
  const [hasHeader, setHasHeader] = useState(true);

  useEffect(() => {
    setHasHeader(Boolean(document.querySelector(".site-header")));
  }, []);

  if (hasHeader) {
    return null;
  }

  return (
    <div className="theme-dock" aria-label={locale === "ja" ? "テーマ設定" : "Theme settings"}>
      <ThemeToggle locale={locale} />
    </div>
  );
}
