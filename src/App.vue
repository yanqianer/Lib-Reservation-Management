<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/counter';
import 'animate.css'; // 引入 Animate.css
const themeStore = useThemeStore();

onMounted(()=>{

  if (themeStore.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})
</script>
<template>
  <transition
      enter-active-class="animate__animated animate__backInDown"
      leave-active-class="animate__animated animate__backOutDown"
      mode="out-in"
    >
      <router-view :key="$route.fullPath" />
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
</style>
