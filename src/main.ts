import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { setupAxiosInterceptor } from './orval-test/interceptor'
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import lazy from './directives/lazy'; // 引入自定义指令
VueMarkdownEditor.use(vuepressTheme, {
    Prism,
  });

VMdPreview.use(vuepressTheme,{
  Prism,
  config:{
    toc: {
      includeLevel: [3, 4],
    },
  }
})
const app = createApp(App)
setupAxiosInterceptor()
app.directive('lazy', lazy); // 注册指令
app.use(createPinia())
app.use(VueMarkdownEditor);
app.use(VMdPreview)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
