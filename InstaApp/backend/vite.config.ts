import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // include source maps

    coverage: {
      provider: "istanbul", // or 'c8',
    },
    testTimeout: 1000,
  },
});
