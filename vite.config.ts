import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
    // require: 'window',
  },
  // build: {
  //   outDir: "./build",
  //   // chunkSizeWarningLimit: 1600,
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes("node_modules")) {
  //           return id
  //             .toString()
  //             .split("node_modules/")[1]
  //             .split("/")[0]
  //             .toString();
  //         }
  //       },
  //       assetFileNames: (assetInfo) => {
  //         let extType = assetInfo?.name?.split(".").at(1);
  //         if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || "")) {
  //           extType = "img";
  //         }
  //         return `static/erp/${extType}/[name]-[hash][extname]`;
  //       },
  //       chunkFileNames: "static/js/[name]-[hash].js",
  //       entryFileNames: "static/js/[name]-[hash].js",
  //     },
  //   },
  // },
});
