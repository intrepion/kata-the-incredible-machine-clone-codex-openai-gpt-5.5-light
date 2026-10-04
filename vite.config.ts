import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/browser/**"],
  },
  server: {
    host: "127.0.0.1",
    port: 4177,
  },
  preview: {
    host: "127.0.0.1",
    port: 4178,
  },
});
