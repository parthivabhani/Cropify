// Vite configuration for Cropify (TanStack Start + React + Tailwind v4).
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  server: { port: 5173 },
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-query", "@tanstack/query-core"],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    // src/server.ts wraps TanStack Start's server entry with an SSR error page.
    tanstackStart({ server: { entry: "server" } }),
    // Production server output. Defaults to Vercel's Build Output API (.vercel/output);
    // set NITRO_PRESET (e.g. "node-server") to target another host.
    ...(command === "build" ? [nitro({ preset: process.env["NITRO_PRESET"] ?? "vercel" })] : []),
    viteReact(),
  ],
}));
