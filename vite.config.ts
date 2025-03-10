import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000,
    }
  },
  base: "/rei_nande_concentration/",
});
