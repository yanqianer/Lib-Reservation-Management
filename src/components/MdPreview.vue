<template>


    <div v-if="post" class="w-full max-w-6xl  px-0 md:px-6 dark:bg-gray-800">
        <h1 class="text-4xl font-semibold text-center dark:text-white">{{ post.title }}</h1>
        <p class="text-gray-500 text-sm mt-2 text-center">{{ formatDate(post.createTime) }}</p>
        <img :src="post.image" alt="Blog Cover" class="w-full h-[500px] object-cover rounded-lg my-6 shadow-md" />

        <!-- Markdown 文章内容 -->
        <v-md-preview v-if="post.content" :text="post.content" :default-show-toc="true" :toc-nav-position-right="true"
            :include-level="[3, 4]" class="prose max-w-none mt-6 text-gray-800 leading-relaxed px-0 dark:bg-gray-800 "
            ref="preview" preview-class="vuepress-markdown-body"></v-md-preview>
        <p v-else class="text-gray-500 mt-4">暂无内容</p>
    </div>


</template>

<script setup lang='ts'>
import { computed, onMounted, ref, nextTick, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { ArticleDto } from '@/orval-test/client.schemas';
import { get } from '@/orval-test/client';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import { ArticleStore, NowArticleStore } from '@/stores/counter';
import { PreviewStore } from '@/stores/counter';
import { ActiveAnchoStore } from '@/stores/counter';
const props = defineProps({
    post: {
        type: ref<ArticleDto>,
        require: true
    },
})
const activeAnchor = ref<string | null>(null);
const post = ref<ArticleDto>(props.post?.value!)
const preview = ref<InstanceType<typeof VMdPreview> | null>(null);

watch(() => props.post, (newVal) => {
    if (newVal) {
        // 这里可以执行初始化操作
        post.value = newVal.value!
        if(preview.value){
            PreviewStore().setPreview(preview.value)
        }
    }

},


{ immediate: true })
watch(()=>PreviewStore().preview,(newVal)=>{
    if(newVal){
        preview.value = PreviewStore().preview.value
    }
},{immediate:true})

    const handleScroll = () => {
    if (!preview.value) return;

    const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    for (let i = anchors.length - 1; i >= 0; i--) {
        const anchor = anchors[i] as HTMLElement;
        const lineIndex = anchor.getAttribute('data-v-md-line');

        if (lineIndex && anchor.offsetTop <= scrollTop + 100) {
            ActiveAnchoStore().setActiveAncho(lineIndex)
            break;
        }
    }
};

onMounted(async () => {
    window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

</script>
<style>

.dark .vuepress-markdown-body {
  background-color: #1f2937 !important; /* 深色背景 */
  color: #cbd5e1 !important; /* 浅色文字 */
}

</style>