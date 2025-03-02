<template >
    <Navbar></Navbar>
    <MobileNav :post="ref(post)" :article="ref(article)" ></MobileNav>
   <div class="flex w-full h-full  min-h-screen pt-[6px]  ">
    <div class="w-1/5 h-full min-h-screen bg-white fixed min-w-[220px] hidden md:block dark:bg-gray-800">
        <div class="w-full h-full flex flex-row-reverse ">
            <LeftNav :post="ref(post)" :article="ref(article)"></LeftNav>
        </div>

    </div>
    <div class="w-1/5 h-full min-h-screen bg-white  min-w-[220px]  hidden md:block"></div>
    <div class="grow h-full bg-white min-h-screen flex flex-col  items-center dark:bg-gray-800">
       <MdPreview class="pt-3" :post="ref(post)"></MdPreview>
       <Comment  ></Comment>
    </div>
    <div class="w-1/5 h-full  min-h-screen fixed right-0 hidden xl:block">
        <RightBav></RightBav>
    </div>
    <div class="w-1/5 h-full bg-white min-h-screen  right-0 hidden xl:block"></div>
   </div>
</template>

<script setup lang='ts'>
import MdPreview from '@/components/MdPreview.vue';
import { computed, onMounted, ref, nextTick, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { ArticleDto } from '@/orval-test/client.schemas';
import { get } from '@/orval-test/client';
import Navbar from '@/components/Navbar.vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import Comment from '@/components/Comment.vue';
import { NowArticleStore } from '@/stores/counter';
import LeftNav from '@/components/LeftNav.vue';
import RightBav from '@/components/RightBav.vue';
import MobileNav from '@/components/MobileNav.vue';

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


const getArticleById = async (id: string) => {
    try {
        const result = await controller.articleControllerFindOneById(id);
        post.value = result.data!;
        NowArticleStore().setNowArticle(post.value)
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
onMounted(async () => {
    await getArticleById(route.params.id as string);
    await getAllArticle();
});
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
</script>
<style>
/* 针对 Webkit 浏览器（Chrome, Edge, Safari） */
body::-webkit-scrollbar {
    display: none;
}

/* 针对 Firefox */
body {
    scrollbar-width: none;
}

/* 让页面仍然可以滚动 */
body {
    overflow: auto;
}
</style>