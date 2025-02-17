<template>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :background-color="theme.isDark ? '#333' : '#fff'"
      :text-color="theme.isDark ? '#fff' : '#333'"
      :active-text-color="theme.isDark ? '#ffd04b' : '#409EFF'"
    >
      <el-menu-item index="1" @click="toggleCollapse">
        <el-icon><i class="el-icon-menu"></i></el-icon>
        <span>Collapse</span>
      </el-menu-item>
      <el-menu-item index="2" @click="goToUserManagement">
        <el-icon><i class="el-icon-user"></i></el-icon>
        <span>User Management</span>
      </el-menu-item>
    </el-menu>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { routes } from 'vue-router/auto-routes';
  import { useThemeStore } from '@/stores/counter';
  
  const router = routes; 
  const theme = useThemeStore();
  const isCollapse = ref(false);
  const activeMenu = ref('1');
  
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };
  
  const goToUserManagement = () => {
    router.push('/user-management');
  };
  </script>
  
  <style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  </style>