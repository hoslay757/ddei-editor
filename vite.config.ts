import { fileURLToPath, URL } from 'node:url'
import viteCompression from "vite-plugin-compression";

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import px2rem from "postcss-px2rem"
import path from 'path'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    viteCompression({
      // gzip静态资源压缩
      threshold: 5120, //压缩前最小文件大小
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@ddei': fileURLToPath(new URL('./plugins', import.meta.url)),
      'ddei-framework': fileURLToPath(new URL('/Users/hoslay/work/ddei/ddei-framework/dist/ddei-framework.js', import.meta.url)),
    }

  },
  css: {
    postcss: {
      plugins: [
        px2rem({
          remUnit: 192,
        })
      ]
    },
  }
  




  // [vite库模式配置](https://cn.vitejs.dev/guide/build.html#library-mode)
  // build: {
  //   outDir: 'lib',
  //   lib: {
  //     entry: resolve(__dirname, './packages/index.ts'),
  //     name: 'WebVue',
  //     fileName: 'web-vue'
  //   },
  //   rollupOptions: {
  //     // 确保外部化处理那些你不想打包进库的依赖
  //     external: ['vue'],
  //     output: {
  //       // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
  //       globals: {
  //         vue: 'Vue'
  //       }
  //     }
  //   }
  // }
})
