import { fileURLToPath, URL } from 'node:url'

import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), ''); // 指定加载前缀为空字符串
  

  return{

    plugins: [
      vue(),
      vueDevTools(),
    ],
    server:{
      port: Number(env.VITE_PORT) || 5173,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
 
})
