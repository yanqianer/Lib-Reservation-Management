<template>
    <nav
        class="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md py-4 px-8 flex justify-between items-center transition-colors duration-300 z-50">
        <span class="text-2xl font-bold text-gray-800 dark:text-gray-100 cursor-pointer" @click="() => router.push('/')">
            IM ZZ
        </span>
        <ul class="flex space-x-6">
            <li>
                <router-link to="/"
                    class="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300 text-base"
                    active-class="text-blue-500 border-b-2 border-blue-500">
                    主页
                </router-link>
            </li>
            <li>
                <router-link to="/about"
                    class="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300 text-base"
                    active-class="text-blue-500 border-b-2 border-blue-500">
                    关于
                </router-link>
            </li>
            <li>
                <router-link to="/post"
                    class="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300 text-base"
                    active-class="text-blue-500 border-b-2 border-blue-500">
                    动态
                </router-link>
            </li>
        </ul>
        <button @click="theme"
            class="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded text-gray-800 dark:text-gray-200">
            {{ themeStore.theme === 'light' ? '暗色模式' : '亮色模式' }}
        </button>
    </nav>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/counter'; // 确保路径正确
import { useRouter } from 'vue-router';

const themeStore = useThemeStore();
const router = useRouter();


const theme=()=>[
alert('别点，没写好呢')

]
</script>

<style>
/* 确保内容不会被导航栏遮挡 */
body {
    padding-top: 64px;
    /* 64px = 导航栏的高度 */
}
</style>
