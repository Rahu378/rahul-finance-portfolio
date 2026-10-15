import { copyFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * GitHub Pages cannot rewrite unknown paths to index.html, so a client-side
 * route such as /skills 404s on a hard refresh or a shared link. Shipping a
 * byte-identical 404.html means Pages serves the app for those paths instead,
 * and React Router takes it from there.
 */
export function spaFallback(): Plugin {
  return {
    name: "spa-fallback",
    apply: "build",
    async closeBundle() {
      const out = path.resolve(process.cwd(), "dist");
      await copyFile(path.join(out, "index.html"), path.join(out, "404.html"));
    },
  };
}
