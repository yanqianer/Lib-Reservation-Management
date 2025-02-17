<template>
  <div class="max-w-2xl mx-auto p-4 bg-white text-black relative overflow-hidden w-full min-h-screen">
    <!-- 发帖区域 -->
    <div class="border-b border-gray-300 pb-4 relative z-10">
      <h1 class="text-xl font-bold">Home</h1>
    </div>

    <!-- 输入框 -->
    <div class="border-b border-gray-300 py-4 flex gap-4 relative z-10">
      <img class="w-10 h-10 rounded-full" src="../../public/male.png" alt="User Avatar" />
      <div class="w-full">
        <textarea v-model="newPostContent" placeholder="What’s happening?"
          class="w-full bg-transparent text-black border-b border-gray-300 p-2 focus:outline-none"></textarea>

        <!-- 图片上传和实时预览 -->
        <div class="mt-2 flex items-center gap-4">
          <input type="file" @change="handleImageUpload" class="hidden" accept="image/*" multiple ref="fileInput" />
          <button @click="triggerFileInput" class="text-gray-600 hover:text-blue-500 transition">
            <img src="../assets/file-image-line.svg" width="24" height="24" viewBox="0 0 24 24">
            <path :d="imageIconPath" fill="currentColor" />
            </img>
          </button>

          <!-- Emoji Picker -->
          <button @click="emojiPickerVisible = !emojiPickerVisible" class="p-2">😊</button>
          <button @click="addPost" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Post
        </button>
        </div>
        <div v-if="emojiPickerVisible" class="mt-2">
          <Vue3EmojiPicker :group-names="group" :native="true" @select="onSelectEmoji" class=" " />
        </div>

        <!-- 图片预览 -->
        <div v-if="newPostImages.length > 0" class="mt-4 flex flex-wrap gap-2">
          <div v-for="(image, index) in newPostImages" :key="index" class="relative">
            <img :src="image" alt="Preview" class="w-24 h-24 object-cover rounded-lg" />
            <button @click="removeImage(index)"
              class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
              &times;
            </button>
          </div>
        </div>


      </div>
    </div>

    <!-- 帖子列表 -->
    <div v-for="(post, index) in posts" :key="index" class="border-b border-gray-300 py-4 flex gap-4 relative z-10">
      <img class="w-10 h-10 rounded-full" :src="post.avatar" alt="User Avatar" />
      <div class="w-full">
        <div class="flex justify-between items-center">
          <div>
            <span class="font-bold">{{ post.username }}</span>
            <span class="text-gray-500 text-sm"> @{{ post.handle }} · {{ post.time }}</span>
          </div>
        </div>
        <p class="text-black mt-1">{{ post.content }}</p>

        <!-- 帖子中的图片 -->
        <div v-if="post.images && post.images.length > 0" class="mt-2 grid grid-cols-2 gap-2">
          <img v-for="(image, imgIndex) in post.images" :key="imgIndex" v-lazy="image" alt="Post Image"
            class="w-full h-48 object-cover rounded-lg" data-src="placeholder.jpg" />
        </div>
      </div>
    </div>

    <!-- 分页加载 -->
    <div id="load-more" class="text-center py-4">
      <span v-if="isLoading">Loading...</span>
      <span v-else-if="!hasMore">No more posts</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { compressImage } from '@/utils/compressImage';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import imageIconPath from '../assets/file-image-line.svg';
import Vue3EmojiPicker from 'vue3-emoji-picker'; // 引入 vue3-emoji-picker
import 'vue3-emoji-picker/css'; // 引入样式

const newPostContent = ref('');
const newPostImages = ref([]);
const fileInput = ref(null);
const posts = ref([]);
const page = ref(1);
const isLoading = ref(false);
const hasMore = ref(true);
const emojiPickerVisible = ref(false);

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click();
};

// 处理图片上传
const handleImageUpload = async (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPostImages.value.push(e.target.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Image compression failed:', error);
      }
    }
  }
};

// 移除图片
const removeImage = (index) => {
  newPostImages.value.splice(index, 1);
};

// 插入Emoji
const onSelectEmoji = (emoji) => {
  newPostContent.value += emoji.i;
};

// 发布帖子
const addPost = () => {
  if (newPostContent.value.trim() === '' && newPostImages.value.length === 0) return;
  posts.value.unshift({
    username: 'You',
    handle: 'yourhandle',
    avatar: '../../public/male.png',
    time: 'Just now',
    content: newPostContent.value,
    images: [...newPostImages.value],
  });
  newPostContent.value = '';
  newPostImages.value = [];
};

// 分页加载
const loadPosts = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;

  const newPosts = await fetchPosts(page.value);
  if (newPosts.length > 0) {
    posts.value.push(...newPosts);
    page.value++;
  } else {
    hasMore.value = false;
  }

  isLoading.value = false;
};

// 模拟 API 请求
const fetchPosts = async (page) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPosts = Array.from({ length: 5 }, (_, i) => ({
        username: 'User',
        handle: 'user',
        avatar: '../../public/male.png',
        time: '1h',
        content: `This is post ${page * 5 + i + 1}`,
        images: ['https://via.placeholder.com/300'],
      }));
      resolve(mockPosts);
    }, 1000);
  });
};

// 监听页面滚动
const observer = ref(null);
onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadPosts();
      }
    },
    { threshold: 0.1 }
  );
  observer.value.observe(document.querySelector('#load-more'));
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style>
/* 自定义样式 */
</style>