import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
  },
});
