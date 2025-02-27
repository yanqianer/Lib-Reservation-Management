<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useThemeStore } from '@/stores/counter';
import 'animate.css'; // 引入 Animate.css
import AppFooter from '@/components/AppFooter.vue';

const themeStore = useThemeStore();

onMounted(() => {
  if (themeStore.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <transition
    enter-active-class="animate__animated animate__backInDown"
    leave-active-class="animate__animated animate__backOutDown"
    mode="out-in"
  >
    <div :key="$route.fullPath" class="content-wrapper">
      <router-view />
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
</style>
