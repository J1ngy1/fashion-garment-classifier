import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^react$/,
        replacement: fileURLToPath(
          new URL("./app/node_modules/react/index.js", import.meta.url),
        ),
      },
      {
        find: /^react-dom$/,
        replacement: fileURLToPath(
          new URL("./app/node_modules/react-dom/index.js", import.meta.url),
        ),
      },
      {
        find: /^react-dom\/client$/,
        replacement: fileURLToPath(
          new URL("./app/node_modules/react-dom/client.js", import.meta.url),
        ),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: fileURLToPath(
          new URL("./app/node_modules/react/jsx-runtime.js", import.meta.url),
        ),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: fileURLToPath(
          new URL(
            "./app/node_modules/react/jsx-dev-runtime.js",
            import.meta.url,
          ),
        ),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    include: [
      "tests/unit/**/*.{test,spec}.{js,jsx}",
      "tests/integration/**/*.{test,spec}.{js,jsx}",
    ],
    exclude: ["tests/e2e/**"],
  },
});
