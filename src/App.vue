<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

import 'animate.css'; // 引入 Animate.css
import AppFooter from '@/components/AppFooter.vue';




</script>

<template>
  <transition
    enter-active-class="animate__animated animate__backInDown"
    leave-active-class="animate__animated animate__backOutDown"
    mode="out-in"
  >
    <div :key="$route.fullPath" class="content-wrapper dark:text-gray-100 dark:bg-gray-800">
      <router-view  />
      <AppFooter />
    </div>  
  </transition>
</template>

<style>
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  max-width: 100vw;
  align-items: center;
  flex-direction: column;
}

.content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 添加暗模式支持 */
body {
  background-color: white; /* 默认背景 */
  color: black; /* 默认文本颜色 */
}

body.dark {
  background-color: #1a202c; /* 暗模式背景 */
  color: white; /* 暗模式文本颜色 */
}
</style>
