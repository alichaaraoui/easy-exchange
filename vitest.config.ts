import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const fileEnv = loadEnv("test", process.cwd(), "");
const testDatabaseUrl = process.env.TEST_DATABASE_URL ?? fileEnv.TEST_DATABASE_URL;
const productionUrls = [fileEnv.DATABASE_URL, fileEnv.DATABASE_URL_UNPOOLED].filter(Boolean);

if (!testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL is not set. Add it to .env.local (see .env.example).");
}
if (productionUrls.includes(testDatabaseUrl)) {
  throw new Error("TEST_DATABASE_URL must point at a separate test database, not DATABASE_URL.");
}

process.env.TEST_DATABASE_URL = testDatabaseUrl;

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "node",
    fileParallelism: false,
    globalSetup: "./tests/global-setup.ts",
    env: {
      DATABASE_URL: testDatabaseUrl,
      DATABASE_URL_UNPOOLED: testDatabaseUrl,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
