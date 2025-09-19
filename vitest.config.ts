// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["./test/golden-state/vitest.init.ts"], // <-- runs at start
  },
});
