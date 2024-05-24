import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 0 // 你想要的新端口号
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@ddei': fileURLToPath(new URL('./plugins', import.meta.url)),
      // 'ddei-framework': fileURLToPath(new URL('/Users/hoslay/work/ddei/ddei-framework/dist/ddei-framework.js', import.meta.url)),
    }
  },

  build: {
    minify: false,
    // 这里配置打包，打包时要排除Vue的依赖，因为我们使用组件库时本地肯定是vue 环境，否则会报isCE 的错误
    rollupOptions: {
      external: ["vue", "three", "lodash"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    }, 
    cssCodeSplit:true,
    lib: {
      entry: "./src/editor/index.ts",
      name: "ddei-editor",
      formats: ['umd'],
    },
  },
})
