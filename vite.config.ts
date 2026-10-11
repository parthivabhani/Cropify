// TanStack Start Vite Configuration
// Bundles: TanStack Start, React, TailwindCSS, Nitro SSR wrapper, and tsConfigPaths.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Deploy target: Vercel (Build Output API in .vercel/output). Override with NITRO_PRESET.
  nitro: { preset: process.env.NITRO_PRESET ?? "vercel" },
});
