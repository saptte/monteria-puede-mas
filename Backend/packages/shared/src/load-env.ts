import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function loadEnv() {
  let dir = process.cwd();
  for (let depth = 0; depth < 6; depth += 1) {
    const file = join(dir, ".env");
    if (existsSync(file)) {
      for (const line of readFileSync(file, "utf8").split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
      return;
    }
    const parent = dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
}
