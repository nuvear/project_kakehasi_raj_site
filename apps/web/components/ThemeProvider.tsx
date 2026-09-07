"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "rajagobalan-theme";

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? systemTheme() : mode;
}

function applyTheme(mode: ThemeMode) {
  const resolved = resolveTheme(mode);
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const initialMode = isThemeMode(document.documentElement.dataset.themeMode || null)
      ? document.documentElement.dataset.themeMode as ThemeMode
      : "system";

    setModeState(initialMode);
    setResolvedTheme(resolveTheme(initialMode));
    applyTheme(initialMode);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const syncSystem = () => {
      setResolvedTheme(resolveTheme(mode));
      applyTheme(mode);
    };

    media.addEventListener("change", syncSystem);
    return () => {
      media.removeEventListener("change", syncSystem);
    };
  }, [mode]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const nextMode = isThemeMode(event.newValue) ? event.newValue : "system";
      setModeState(nextMode);
      setResolvedTheme(resolveTheme(nextMode));
      applyTheme(nextMode);
    };

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    setResolvedTheme(resolveTheme(nextMode));

    try {
      localStorage.setItem(STORAGE_KEY, nextMode);
    } catch {
      // Ignore storage failures; the in-memory theme still updates.
    }

    applyTheme(nextMode);
  };

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
    }),
    [mode, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
