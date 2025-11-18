import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  base: '/xqw-blog/', // 设置为GitHub仓库名
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  inject:{
    data:{
      title:'星期wu~'
    }
  }
})
