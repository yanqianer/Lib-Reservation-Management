import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import type { AdminDto, ArticleDto } from '@/orval-test/client.schemas'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const AdminStore = defineStore('admin', () => {
  // const admin:AdminDto =reactive({} as AdminDto) 
  const admin = reactive<Partial<AdminDto>>({});
  const setAdminDto = (adminDto: AdminDto) => {
    Object.assign(admin, adminDto)
  }
  watch(admin, () => {
    localStorage.setItem('admin', JSON.stringify(admin)); // ✅ 转换为字符串
  })
  return { admin, setAdminDto }
})
export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    document.documentElement.classList.toggle('dark', theme.value === 'dark');
  };

  return { theme, toggleTheme };
});
export const ArticleStore = defineStore('article', () => {
  const article = ref<ArticleDto[]>([])
  const setArticle = (articleDto: ArticleDto[]) => {
    article.value = articleDto
  }
  return { article, setArticle }
})