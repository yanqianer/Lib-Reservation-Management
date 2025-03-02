import { fileURLToPath, URL } from 'node:url'

import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    define: {
      // 定义全局变量
      __API_URL__: JSON.stringify(env.VITE_API_BASE_URL || 'http://127.0.0.1:3000')
    },
    plugins: [
      vue(),
      vueDevTools(),
    ],
    server:{
      host: '0.0.0.0', // 允许所有 IP 访问
      port: Number(env.VITE_PORT) || 5173,
      disableHostCheck: true, // 禁用主机检查
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
