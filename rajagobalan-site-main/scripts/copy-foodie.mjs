/**
 * Copies apps/foodie-app → dist/foodie and reuses discipline firebase-config.js.
 */
import { cpSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "apps", "foodie-app");
const dest = join(root, "dist", "foodie");
const cfgSrc = join(root, "apps", "discipline-app", "firebase-config.js");

if (!existsSync(src)) {
  console.error("copy-foodie: missing", src);
  process.exit(1);
}
mkdirSync(join(root, "dist"), { recursive: true });
cpSync(src, dest, { recursive: true });
if (existsSync(cfgSrc)) {
  cpSync(cfgSrc, join(dest, "firebase-config.js"));
}
console.log("copy-foodie: copied", src, "→", dest);
