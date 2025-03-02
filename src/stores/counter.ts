import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import type { AdminDto, ArticleDto } from '@/orval-test/client.schemas'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
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

export const ArticleStore = defineStore('article', () => {
  const article = ref<ArticleDto[]>([])
  const setArticle = (articleDto: ArticleDto[]) => {
    article.value = articleDto
  }
  return { article, setArticle }
})

export const NowArticleStore = defineStore('NowArticle',()=>{
  const NowArticle = ref<ArticleDto>({} as ArticleDto)
  const setNowArticle = (articleDto: ArticleDto) => {
    NowArticle.value = articleDto
  }
  return { NowArticle, setNowArticle }
})
export const PreviewStore  =defineStore('preview',()=>{
  const preview = ref<InstanceType<typeof VMdPreview> | null>(null);
  const setPreview  =(previews:InstanceType<typeof VMdPreview> | null)=>{
      preview.value = previews
  }
  return {preview,setPreview}
})

export const ActiveAnchoStore = defineStore('activeAncho',()=>{
  const activeAncho = ref<string | null>(null);
  const setActiveAncho = (ancho:string | null)=>{
    activeAncho.value = ancho
  }
  return {activeAncho,setActiveAncho}
})