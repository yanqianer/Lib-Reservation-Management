<template>
    <div class="min-h-screen flex bg-gray-50 w-full">
      <!-- 左侧菜单 -->
      <div class="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav class="mt-6">
          <router-link
            to="/admin/adminManage"
            class="block px-6 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-600"
            >用户管理</router-link
          >
          <router-link
            to="/admin/blogManage"
            class="block px-6 py-2 text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-600"
            >博客管理</router-link
          >
        </nav>
      </div>
  
      <!-- 右侧工作区 -->
      <div class="flex-1 p-8 overflow-y-auto h-screen">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </template>
  
  <script setup>
  import { RouterLink, RouterView } from 'vue-router'
  </script>
  
  <style>
  /* 添加页面切换动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>