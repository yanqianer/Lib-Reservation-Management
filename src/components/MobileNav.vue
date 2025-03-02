<template>

<div class="md:hidden w-full flex justify-between items-center px-4 py-4  dark:bg-gray-800 bg-white shadow-sm mb-4 sticky top-[60px] z-30">
                <button @click="toggleArticleList" class="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <button @click="toggleOutline" class="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <div 
            v-show="showArticleList"
            class="md:hidden fixed left-0 top-0 h-screen w-[80%] bg-white z-50 p-4 shadow-lg transform transition-transform duration-300 mt-5 dark:bg-gray-800"
            :class="showArticleList ? 'translate-x-0' : '-translate-x-full'"
        >
            <div class="flex justify-between items-center mb-4">
                <h2 class="font-semibold text-xl">目录</h2>
                <button @click="showArticleList = false" class="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <ul class="space-y-2">
                <li v-for="item in article" :key="item.id">
                    <router-link 
                        :to="'/blog/' + item.id" 
                        :class="['block rounded-lg hover:bg-gray-100 transition text-sm text-slate-500', 
                                  { 'bg-blue-100 text-blue-600': item.id === post.id }]"
                        @click="showArticleList = false"
                    >
                        {{ item.title }}
                    </router-link>
                </li>
            </ul>
        </div>
        <div 
            v-show="showOutline"
            class="md:hidden fixed right-0 top-0 h-screen w-[80%]  dark:bg-gray-800 bg-white z-50 p-4 shadow-lg transform transition-transform duration-300  mt-5"
            :class="showOutline ? 'translate-x-0' : 'translate-x-full'"
        >
            <div class="flex justify-between items-center mb-4">
                <h2 class="font-semibold text-xl">大纲</h2>
                <button @click="showOutline = false" class="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <ul class="space-y-2">
                <li v-for="(anchor, index) in titles" :key="index">
                    <a 
                        @click="handleAnchorClick(anchor); showOutline = false;" 
                        :class="['block cursor-pointer hover:bg-gray-100 transition text-sm text-slate-500 rounded-lg', 
                                 { 'bg-blue-100 text-blue-600': activeAnchor === anchor.lineIndex }]"
                        :style="{ paddingLeft: `${anchor.indent * 15}px` }">
                        {{ anchor.title }}
                    </a>
                </li>
            </ul>
        </div>
</template>

<script setup lang='ts'>
import {ref,watch,onMounted} from 'vue'
import type { ArticleDto } from '@/orval-test/client.schemas';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import { PreviewStore } from '@/stores/counter';
import { ActiveAnchoStore } from '@/stores/counter';
const showArticleList = ref(false);
const showOutline = ref(false);

const activeAnchor = ref<string | null>(null);
interface Anchor {
    title: string;
    lineIndex: string | null;
    indent: number;
}
const preview = ref<InstanceType<typeof VMdPreview> | null>(PreviewStore().preview);


const titles = ref<Anchor[]>([]);
const props = defineProps({
    post: {
        type: ref<ArticleDto>,
        require: true
    },
    article:{
        type:ref<ArticleDto[]>,
        require:true
    }
})
const article = ref<ArticleDto[]>([])
const post = ref<ArticleDto>({} as ArticleDto)
    watch(() => props.post, (newVal) => {
    if (newVal) {
        post.value = newVal.value!
    }
}, { immediate: true })
watch(() => props.article, (newVal) => {
    if (newVal) {
        article.value = newVal.value!
    }
}, { immediate: true })
// 关闭所有侧边栏
const closeAllSidebars = () => {
    showArticleList.value = false;
    showOutline.value = false;
};
const toggleArticleList = () => {
    showOutline.value = false; // 确保另一个侧边栏关闭
    showArticleList.value = !showArticleList.value;
};

// 切换大纲侧边栏
const toggleOutline = () => {
    showArticleList.value = false; // 确保另一个侧边栏关闭
    showOutline.value = !showOutline.value;
};
const handleAnchorClick = (anchor: Anchor) => {
    if (!preview.value || !anchor.lineIndex) return;

    const heading = preview.value.$el.querySelector(`[data-v-md-line="${anchor.lineIndex}"]`);

    if (heading) {
        preview.value.scrollToTarget({
            target: heading,
            scrollContainer: window,
            top: 60,
        });
        PreviewStore().setPreview(preview.value)
    }
};

const generateTOC = () => {
    if (!preview.value) return;

    const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
    const titlesArray = Array.from(anchors).filter((title: any) => !!title.textContent?.trim());

    if (!titlesArray.length) {
        titles.value = [];
        return;
    }

    const hTags = Array.from(new Set(titlesArray.map((title: any) => title.tagName))).sort();

    titles.value = titlesArray.map((el: any) => ({
        title: el.textContent || '',
        lineIndex: el.getAttribute('data-v-md-line'),
        indent: hTags.indexOf(el.tagName),
    }));
};
watch(()=>PreviewStore().preview,(newVal)=>{
    if(newVal){
       
        preview.value = PreviewStore().preview
        generateTOC()
    }
},{immediate:true})
watch(()=>ActiveAnchoStore().activeAncho,(newVal)=>{
  
    if(newVal){
        activeAnchor.value = ActiveAnchoStore().activeAncho

    }
},{immediate:true})

onMounted(()=>{
    generateTOC();

})
</script>
<style>

</style>