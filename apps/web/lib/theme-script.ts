const STORAGE_KEY = "rajagobalan-theme";

export function themeBootScript() {
  return `
(() => {
  const key = ${JSON.stringify(STORAGE_KEY)};
  const valid = new Set(["light", "dark", "system"]);
  let mode = "system";
  try {
    const stored = localStorage.getItem(key);
    if (valid.has(stored)) mode = stored;
  } catch (_) {}
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const theme = dark ? "dark" : "light";
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
`;
}
