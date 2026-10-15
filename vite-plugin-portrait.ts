import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Dev-only endpoint so the portrait can be dropped straight into the running
 * site instead of copied by hand. Never registered in a production build.
 */
export function portraitUpload(): Plugin {
  return {
    name: "portrait-upload",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__portrait", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("POST only");
          return;
        }
        const chunks: Buffer[] = [];
        let size = 0;
        req.on("data", (c: Buffer) => {
          size += c.length;
          if (size > 25 * 1024 * 1024) {
            res.statusCode = 413;
            res.end(JSON.stringify({ error: "File too large (max 25MB)" }));
            req.destroy();
            return;
          }
          chunks.push(c);
        });
        req.on("end", async () => {
          if (res.writableEnded) return;
          try {
            const { dataUrl } = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            const m = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i.exec(dataUrl ?? "");
            if (!m) throw new Error("Expected a JPEG, PNG or WebP image");

            const dir = path.resolve(server.config.root, "public");
            await mkdir(dir, { recursive: true });
            // always land as portrait.jpg so the app has one stable path
            await writeFile(path.join(dir, "portrait.jpg"), Buffer.from(m[2], "base64"));

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, path: "public/portrait.jpg" }));
            server.config.logger.info("  ➜  saved public/portrait.jpg");
          } catch (e: any) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: e?.message ?? "Save failed" }));
          }
        });
      });
    },
  };
}
