"use client";

import { useTheme, type ThemeMode } from "./ThemeProvider";

interface ThemeToggleProps {
  locale: string;
}

const iconPaths: Record<ThemeMode, string> = {
  light:
    "M12 4.5V3m0 18v-1.5M4.5 12H3m18 0h-1.5M6.7 6.7 5.6 5.6m12.8 12.8-1.1-1.1m0-10.6 1.1-1.1M5.6 18.4l1.1-1.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  dark:
    "M20.2 14.1A7.6 7.6 0 0 1 9.9 3.8 8.6 8.6 0 1 0 20.2 14.1Z",
  system:
    "M4 5.5h16v10H4v-10Zm6 13h4m-6 0h8",
};

function Icon({ mode }: { mode: ThemeMode }) {
  return (
    <svg aria-hidden="true" className="theme-toggle-icon" viewBox="0 0 24 24">
      <path d={iconPaths[mode]} />
    </svg>
  );
}

export default function ThemeToggle({ locale }: ThemeToggleProps) {
  const { mode, setMode } = useTheme();
  const isJa = locale === "ja";

  const labels: Record<ThemeMode, string> = {
    light: isJa ? "ライト" : "Light",
    dark: isJa ? "ダーク" : "Dark",
    system: isJa ? "システム" : "System",
  };

  const title = isJa ? "テーマを選択" : "Choose theme";

  return (
    <div className="theme-toggle" role="group" aria-label={title}>
      {(["light", "system", "dark"] as ThemeMode[]).map((item) => (
        <button
          key={item}
          type="button"
          className="theme-toggle-button"
          aria-label={labels[item]}
          aria-pressed={mode === item}
          title={labels[item]}
          data-active={mode === item ? "true" : "false"}
          onClick={() => setMode(item)}
        >
          <Icon mode={item} />
          <span className="theme-toggle-label">{labels[item]}</span>
        </button>
      ))}
    </div>
  );
}
