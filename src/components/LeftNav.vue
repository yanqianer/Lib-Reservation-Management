<template>

    <div
        class="hidden left-0 md:block  h-screen p-0 border-gray-200  dark:bg-gray-800 bg-white overflow-y-auto border-solid rounded-lg w-max-[220px] pt-20">
        <h2 class="font-semibold mb-4 text-2xl">目录</h2>
        <Transition enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut" mode="out-in">
            <ul class="space-y-2">
                <li v-for="item in article" :key="item.id">
                    <router-link :to="'/blog/' + item.id" :class="['block rounded-lg hover:bg-gray-100 transition text-sm text-slate-500',
                        { 'bg-blue-100 text-blue-600': item.id === post.id }]">
                        {{ item.title }}
                    </router-link>
                </li>
            </ul>
        </Transition>
    </div>
    

</template>

<script setup lang='ts'>
import { ref, watch } from 'vue'
import type { ArticleDto } from '@/orval-test/client.schemas';
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
</script>
<style></style>