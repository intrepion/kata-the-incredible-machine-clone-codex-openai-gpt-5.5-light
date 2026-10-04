import { build } from "esbuild";
import { copyFile, mkdir, writeFile } from "node:fs/promises";

await mkdir("file-dist", { recursive: true });

await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "iife",
  outfile: "game.js",
  loader: {
    ".css": "css",
  },
  minify: false,
});

const directFileHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clockwork Mischief</title>
    <link rel="stylesheet" href="./game.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="./game.js"></script>
  </body>
</html>
`;

await writeFile("index.html", directFileHtml);
await copyFile("game.js", "file-dist/game.js");
await copyFile("game.css", "file-dist/game.css");
await writeFile("file-dist/index.html", directFileHtml);
