import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import VitePlugRequire from "vite-plugin-require-transform";

export default defineConfig({
  plugins: [vue(), VitePlugRequire()],
  server: {
    host: "0.0.0.0",
    port: 8888,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  base: "/vue-design-editor",
  build: {
    cssCodeSplit: false, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
    sourcemap: false, // 构建后是否生成 source map 文件。如果为 true，将会创建一个独立的 source map 文件
    target: "esnext", // 设置最终构建的浏览器兼容目标。默认值是一个 Vite 特有的值——'modules'  还可设置为 'es2015' 'es2016'等
    minify: "esbuild", // 'terser' 相对较慢，但大多数情况下构建后的文件体积更小。'esbuild' 最小化混淆更快但构建后的文件相对更大。
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
});
