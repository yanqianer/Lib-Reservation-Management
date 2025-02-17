/// <reference types="vite/client" />
declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
    interface ImportMetaEnv {
        readonly VITE_PORT: string;
        readonly VITE_API_BASE_URL: string;
        // 可以在这里继续添加你的环境变量
      }
      
      interface ImportMeta {
        readonly env: ImportMetaEnv;
      }
    
}
interface ImportMetaEnv {
    readonly VITE_PORT: string;
    readonly VITE_API_BASE_URL: string;
    // 可以在这里继续添加你的环境变量
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
