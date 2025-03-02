<template>
  <div class="min-h-screen w-full  dark:bg-gray-800">
    <Navbar />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-10 text-center ">
      <div class="flex flex-col items-center">
        <!-- 头像 -->
        <img
          :src="avatar"
          alt="Avatar"
          :class="['w-32 h-32 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300', { 'animate__animated animate__bounce': isBouncing }]"
          @click="bounceAvatar"
        />
        <h2 class="mt-4 text-2xl font-medium text-gray-800 dark:text-gray-100">萌萌的政政</h2>
        <p class="text-gray-600 dark:text-gray-400">游戏糕手 | 代码低手</p>
      </div>
    </div>

    <!-- 博客部分 -->
    <transition
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
      mode="out-in"
    >
      <BlogSection :key="$route.fullPath" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BlogSection from '@/components/BlogSection.vue';
import Navbar from '@/components/Navbar.vue';
import { useRoute } from 'vue-router';
import 'animate.css'; // 引入 Animate.css

const theme = ref(localStorage.getItem('theme') || 'light');
const avatar = ref('/avatar.jpg');
const route = useRoute();
const isBouncing = ref(false); // 控制是否触发 bounce 动画

// 点击头像时触发 bounce 动画
const bounceAvatar = () => {
  isBouncing.value = true; // 添加动画类
  setTimeout(() => {
    isBouncing.value = false; // 动画结束后移除动画类
  }, 1000); // 1 秒后移除动画类（与动画持续时间一致）
};

onMounted(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark');
  }
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}


</style>  