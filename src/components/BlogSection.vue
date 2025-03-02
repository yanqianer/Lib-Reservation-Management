
<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900">
    <header class="py-6 text-center text-3xl font-semibold tracking-wide">这是什么？</header>
    <div class="container mx-auto px-4 md:px-16 py-10 grid gap-10 md:grid-cols-3">
      <div v-for="blog in article" :key="blog.id" class="group cursor-pointer flex items-stretch border rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 h-60" @click="goToPost(blog.id)">
        <div class="w-4/5 p-4 flex flex-col justify-between">
          <h2 class="text-2xl font-bold group-hover:text-gray-700 mt-0  dark:text-gray-100">{{ blog.title }}</h2>
          <p class="text-gray-600 line-clamp-2 flex-grow tracking-wide leading-relaxed dark:text-gray-400">{{ truncateText(blog.content, 70) }}</p>
          <p class="text-gray-500 text-sm mb-0 ">{{ formatDate(blog.createTime) }}</p>
        </div>
        <div class="w-2/5 h-full">
          <img :src="blog.image" alt="Blog Cover" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import router from '@/router'
import { get } from '@/orval-test/client';
import type { ArticleDto } from '@/orval-test/client.schemas';
import { ArticleStore } from '@/stores/counter';
const controller = get()
const articlePromise = controller.articleControllerFindAll()
const article = ref<ArticleDto[]>([])
articlePromise.then((res)=>{
    res.data?.forEach((_res)=>{
      article.value.unshift(_res)
    })
})
ArticleStore().setArticle(article.value)
console.log(ArticleStore().article)
const goToPost = (id:number) => {
  router.push({ name: 'PostDetail', params: { id } });
};
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
}
</style>
