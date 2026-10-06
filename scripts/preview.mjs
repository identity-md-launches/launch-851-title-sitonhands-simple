import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

export async function startPreview(port = 0) {
  const root = resolve("dist");
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
  };
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      if (!pathname.startsWith("/preview/")) {
        response.writeHead(404).end();
        return;
      }
      const file = resolve(
        root,
        pathname.slice("/preview/".length) || "index.html",
      );
      if (file !== root && !file.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      if (!(await stat(file)).isFile()) {
        response.writeHead(404).end();
        return;
      }
      response.writeHead(200, {
        "Content-Type": types[extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(port, "0.0.0.0", resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}/preview/` };
}
if (process.argv.includes("--inspect")) {
  const { server, url } = await startPreview(5173);
  console.log(url);
  const timer = setTimeout(() => server.close(), 20 * 60_000);
  process.on("SIGINT", () => {
    clearTimeout(timer);
    server.close();
    process.exit(0);
  });
}
