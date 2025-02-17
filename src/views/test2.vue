<template>
    <div class="min-h-screen flex text-gray-900">
        <!-- 左侧导航栏 - 文章列表 -->
        <div class="fixed left-40 top-60 h-screen p-0 border-gray-200 w-[225px] bg-white overflow-y-auto border-solid rounded-lg">
            <h2 class="font-semibold mb-4 text-2xl">目录</h2>
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
        </div>

        <!-- 文章详情 -->
        <div class="flex-1 ml-[400px] mr-[400px] p-6 flex flex-col items-center">
            <Navbar />
            <div v-if="post" class="w-full max-w-6xl px-6">
                <h1 class="text-4xl font-semibold text-center">{{ post.title }}</h1>
                <p class="text-gray-500 text-sm mt-2 text-center">{{ formatDate(post.createTime) }}</p>
                <img :src="post.image" alt="Blog Cover"
                    class="w-full h-[500px] object-cover rounded-lg my-6 shadow-md" />

                <!-- Markdown 文章内容 -->
                <v-md-preview v-if="post.content" :text="post.content" 
                    class="prose max-w-none mt-6 text-gray-700 leading-relaxed" ref="preview"></v-md-preview>
                <p v-else class="text-gray-500 mt-4">暂无内容</p>

                <!-- 评论 -->
                <div class="mt-10 w-full">
                    <h2 class="text-2xl font-semibold">评论</h2>
                    <div class="mt-4 flex items-start gap-4">
                        <img src="../../public/male.png" alt="User Avatar" class="w-10 h-10 rounded-full" />
                        <div class="flex-1">
                            <textarea v-model="newComment"
                                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="写一条评论吧..."></textarea>
                            <button @click="addComment"
                                class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                提交
                            </button>
                        </div>
                    </div>

                    <!-- 评论列表 -->
                    <div v-if="comments.length" class="mt-6 space-y-4">
                        <div v-for="(comment, index) in comments" :key="index"
                            class="flex items-start gap-4 bg-white p-4 rounded-lg shadow">
                            <img :src="`../public/${comment.admin.gender}.png`" alt="User Avatar"
                                class="w-10 h-10 rounded-full" />
                            <div class="flex-1">
                                <div class="flex items-center justify-between">
                                    <p class="font-semibold text-gray-800">{{ comment.admin.name }}</p>
                                    <span class="text-sm text-gray-500">{{ formatDate(comment.createTime) }}</span>
                                </div>
                                <p class="text-gray-700 mt-1">{{ comment.content }}</p>
                            </div>
                        </div>
                    </div>

                    <p v-else class="text-gray-500 mt-4">一条评论也没有呢</p>
                </div>
            </div>
            <div v-else class="text-center text-xl font-semibold">Post not found</div>
        </div>

        <!-- 右侧导航栏 - 文章小目录 -->
        <div class="fixed right-40 top-60 h-screen pl-1 border-gray-200 w-[240px] bg-white overflow-y-auto">
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
import router from '@/router';
import { useRoute } from 'vue-router';
import { ArticleStore } from '@/stores/counter';
import type { ArticleDto, CommentDto } from '@/orval-test/client.schemas';
import { get } from '@/orval-test/client';
import Navbar from '@/components/Navbar.vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

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

// 监听路由参数变化
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await getArticleById(newId as string);
      refreshComments();
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

const comments = ref<CommentDto[]>([]);
const newComment = ref('');

const addComment = async () => {
    if (!localStorage.getItem('jwt_token')) {
        router.push('/login');
        alert('您尚未登录，请登录后评论');
        return;
    }

    if (newComment.value.trim()) {
        await get().commentControllerCreate({
            content: newComment.value.trim(),
            adminId: 1,
            targetId: Number(route.params.id)
        });
        newComment.value = '';
        refreshComments();
    }
};

const refreshComments = () => {
    get().commentControllerFindAllByArticleId(Number(route.params.id)).then(res => {
        comments.value = res.data || [];
    });
};

onMounted(async () => {
    refreshComments();
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