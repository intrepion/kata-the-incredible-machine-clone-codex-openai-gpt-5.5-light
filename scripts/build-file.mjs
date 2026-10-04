import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("file-dist", { recursive: true });

await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "iife",
  outfile: "file-dist/game.js",
  loader: {
    ".css": "css",
  },
  minify: false,
});

await writeFile(
  "file-dist/index.html",
  `<!doctype html>
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
`,
);
