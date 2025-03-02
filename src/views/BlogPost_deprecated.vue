<template>
    <div class="min-h-screen flex text-gray-900 flex-row justify-start items-center">
        <!-- 遮罩层 -->
        <div 
            v-if="showArticleList || showOutline" 
            class="fixed inset-0 bg-black bg-opacity-50 z-40"
            @click="closeAllSidebars"
        ></div>

        <!-- 左侧导航栏 - 文章列表 (桌面端) -->
        <div class="hidden md:fixed md:block  top-60 h-screen p-0 border-gray-200 w-[225px] dark:bg-gray-800 bg-white overflow-y-auto border-solid rounded-lg">
            <h2 class="font-semibold mb-4 text-2xl">目录</h2>
            <Transition
                enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut"
                mode="out-in"
            >
            <ul class="space-y-2">
                <li v-for="item in article" :key="item.id"> 
                    <router-link 
                        :to="'/blog/' + item.id" 
                        :class="['block rounded-lg hover:bg-gray-100 transition text-sm text-slate-500', 
                                  { 'bg-blue-100 text-blue-600': item.id === post.id }]">
                        {{ item.title }}
                    </router-link>
                </li>
            </ul>
        </Transition>
        </div>

        <!-- 移动端侧边栏 - 文章列表 -->
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

        <!-- 移动端侧边栏 - 文章大纲 -->
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

        <!-- 文章详情 -->
        <div class="flex-1 md:ml-[400px] md:mr-[400px] md:p-6 flex flex-col items-center px-6 pt-0">
            <Navbar />
            <!-- 移动端副导航栏 -->
            <div class="md:hidden w-full flex justify-between items-center px-4 py-2 pt-4  dark:bg-gray-800 bg-white shadow-sm mb-4 sticky top-[60px] z-30">
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
            
            <!-- 文章内容 -->
            <div v-if="post" class="w-full max-w-6xl  px-0 md:px-6 dark:bg-gray-800">
                <h1 class="text-4xl font-semibold text-center dark:text-white">{{ post.title }}</h1>
                <p class="text-gray-500 text-sm mt-2 text-center">{{ formatDate(post.createTime) }}</p>
                <img :src="post.image" alt="Blog Cover"
                    class="w-full h-[500px] object-cover rounded-lg my-6 shadow-md" />

                <!-- Markdown 文章内容 -->
                <v-md-preview v-if="post.content" :text="post.content" :default-show-toc="true" :toc-nav-position-right="true" :include-level="[3, 4]"   
                    class="prose max-w-none mt-6 text-gray-800 leading-relaxed px-0 dark:bg-gray-800 "  ref="preview" preview-class="vuepress-markdown-body"></v-md-preview>
                <p v-else class="text-gray-500 mt-4">暂无内容</p>
            </div>
            <div v-else class="text-center text-xl font-semibold">Post not found</div>
            <Comment></Comment>
        </div>

        <!-- 右侧导航栏 - 文章小目录 (桌面端) -->
        <div class="hidden md:fixed md:block right-40 top-60 h-screen pl-1  dark:bg-gray-800 border-gray-200 w-[240px] bg-white overflow-y-auto">
            <h2 class="text-2xl font-semibold mb-4">大纲</h2>
            <ul class="space-y-2">
                <li v-for="(anchor, index) in titles" :key="index">
                    <a 
                        @click="handleAnchorClick(anchor)" 
                        :class="['block cursor-pointer hover:bg-gray-100 transition text-sm text-slate-500 rounded-lg', 
                                 { 'bg-blue-100 text-blue-600': activeAnchor === anchor.lineIndex }]"
                        :style="{ paddingLeft: `${anchor.indent * 15}px` }">
                        {{ anchor.title }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { ArticleDto } from '@/orval-test/client.schemas';
import { get } from '@/orval-test/client';
import Navbar from '@/components/Navbar.vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import Comment from '@/components/Comment.vue';
interface Anchor {
    title: string;
    lineIndex: string | null;
    indent: number;
}

const article = ref<ArticleDto[]>([]);
const post = ref<ArticleDto>({} as ArticleDto);
const controller = get();
const route = useRoute();
const articleContent = ref<HTMLElement | null>(null);
const titles = ref<Anchor[]>([]);
const preview = ref<InstanceType<typeof VMdPreview> | null>(null);
const activeAnchor = ref<string | null>(null);

// 修改侧边栏控制逻辑
const showArticleList = ref(false);
const showOutline = ref(false);

// 关闭所有侧边栏
const closeAllSidebars = () => {
    showArticleList.value = false;
    showOutline.value = false;
};

// 切换文章列表侧边栏
const toggleArticleList = () => {
    showOutline.value = false; // 确保另一个侧边栏关闭
    showArticleList.value = !showArticleList.value;
};

// 切换大纲侧边栏
const toggleOutline = () => {
    showArticleList.value = false; // 确保另一个侧边栏关闭
    showOutline.value = !showOutline.value;
};

// 监听路由参数变化
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await getArticleById(newId as string);
      generateTOC();
    }
  },
  { immediate: true } // 立即执行一次
);

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

const handleAnchorClick = (anchor: Anchor) => {
    if (!preview.value || !anchor.lineIndex) return;

    const heading = preview.value.$el.querySelector(`[data-v-md-line="${anchor.lineIndex}"]`);

    if (heading) {
        preview.value.scrollToTarget({
            target: heading,
            scrollContainer: window,
            top: 60,
        });
    }
};

const handleScroll = () => {
    if (!preview.value) return;

    const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    for (let i = anchors.length - 1; i >= 0; i--) {
        const anchor = anchors[i] as HTMLElement;
        const lineIndex = anchor.getAttribute('data-v-md-line');

        if (lineIndex && anchor.offsetTop <= scrollTop + 100) {
            activeAnchor.value = lineIndex;
            break;
        }
    }
};

onMounted(async () => {
    await getArticleById(route.params.id as string);
    await getAllArticle();
    generateTOC();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const getArticleById = async (id: string) => {
    try {
        const result = await controller.articleControllerFindOneById(id);
        post.value = result.data!;
    } catch (error) {
        alert(error);
    }
};

const getAllArticle = async () => {
    try {
        const result = await controller.articleControllerFindAll();
        article.value = result.data!;
    } catch (error) {
        alert(error);
    }
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
</script>

<style>
/* 全局样式 */
:deep(.vuepress-markdown-body) {
    padding: 0 !important;
}

/* 移除 markdown-body 的 padding */
:deep(.markdown-body) {
    padding: 0 !important;
}

/* 移动端特别处理 vuepress-markdown-body 的 padding */
@media (max-width: 768px) {
    :deep(.v-md-editor-preview) .vuepress-markdown-body {
        padding: 0 !important;
    }
    
    :deep(.v-md-editor-preview) {
        padding: 0 !important;
    }
}

/* 防止侧边栏打开时页面滚动 */
body.sidebar-open {
    overflow: hidden;
}

/* 遮罩层动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.dark .vuepress-markdown-body {
  background-color: #1f2937 !important; /* 深色背景 */
  color: #cbd5e1 !important; /* 浅色文字 */
}
</style>