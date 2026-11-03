import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/engagement/", // important for GitHub Pages
  assetsInclude: ["**/*.weba", "**/*.mp3", "**/*.wav"],
});
