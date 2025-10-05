// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    assetsInclude: "**/*.hdr",
    plugins: [
      // @ts-expect-error something wrong with types here
      tailwindcss(),
    ],
  },
});
