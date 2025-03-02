<template>
    <div class="max-w-2xl mx-auto p-4 bg-white text-black relative overflow-hidden w-full min-h-screen dark:bg-gray-800">
        <!-- 发帖区域 -->
        <!-- 输入框 -->
        <div class="border-b border-gray-300 py-4 flex gap-4 relative z-10"  v-if="loginStatus">
            <img class="w-10 h-10 rounded-full" src="/avatar.jpg" alt="User Avatar" />
            <div class="w-full">
                <textarea v-model="newPostContent" placeholder="What's happening?"
                    class="w-full bg-transparent text-black border-b border-gray-300 p-2 focus:outline-none"></textarea>

                <!-- 图片上传和实时预览 -->
                <div class="mt-2 flex items-center gap-4">
                    <input type="file" @change="handleImageUpload" class="hidden" accept="image/*" multiple
                        ref="fileInput" />
                    <button @click="triggerFileInput" class="text-gray-600 hover:text-blue-500 transition">
                        <img src="../assets/file-image-line.svg" width="24" height="24" viewBox="0 0 24 24">
                        <path :d="imageIconPath" fill="currentColor" />
                        </img>
                    </button>

                    <!-- Emoji Picker -->
                    <button @click="emojiPickerVisible = !emojiPickerVisible" class="p-2">😊</button>
                    <button @click="addPost"
                        class=" px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
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
                        <span class="font-bold">{{ post.name }}</span>
                        <span class="text-gray-500 text-sm"> @{{ post.handle }} · {{ formatTime(post.createTime) }}</span>
                    </div>
                </div>
                <p class="text-black mt-1">{{ post.content }}</p>

                <!-- 帖子中的图片 -->
                <div v-if="post.images && post.images.split(',').length > 0" class="mt-2 grid grid-cols-2 gap-2">
                    <img v-for="(image, imgIndex) in post.images.split(',')" :key="imgIndex" v-lazy="image" alt="Post Image"
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { compressImage } from '@/utils/compressImage';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import imageIconPath from '../assets/file-image-line.svg';
import Vue3EmojiPicker from 'vue3-emoji-picker'; // 引入 vue3-emoji-picker
import 'vue3-emoji-picker/css'; // 引入样式
import { get } from '@/orval-test/client';
import type { PostDto } from '@/orval-test/client.schemas';
interface PostDtoWithAvatar extends PostDto{
    avatar:string

}
const newPostContent = ref('');
const newPostImages = ref<string[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const posts = ref<PostDtoWithAvatar[]>([] as PostDtoWithAvatar[]);
const page = ref(1);
const isLoading = ref(false);
const hasMore = ref(true);
const emojiPickerVisible = ref(false);
const controller = get()
const group = {
    smileys_people: "黄豆人",
    animals_nature: "动物与自然",
    food_drink: "食物与饮料",
    activities: "活动",
    travel_places: "旅行与地点",
    objects: "物体",
    symbols: "符号",
    flags: "旗帜"
}
const loginStatus = ref(false)
const VITE_API_BASE_URL = __API_URL__

// 触发文件选择
const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

// 处理图片上传
const handleImageUpload = async (event: any) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const compressedFile = await compressImage(file);
                newPostImages.value.push(await UploadImages(compressedFile));  
                console.log(newPostImages.value.toString())
                const reader = new FileReader();
                // reader.onload = (e:any) => {
                //     newPostImages.value.push(e.target.result);
                // };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Image compression failed:', error);
            }
        }
    }
};

// 移除图片
const removeImage = (index:any) => {
    newPostImages.value.splice(index, 1);
};

// 插入Emoji
const onSelectEmoji = (emoji:any) => {
    newPostContent.value += emoji.i;
};

// 发布帖子
const addPost = async () => {
    if (newPostContent.value.trim() === '' && newPostImages.value.length === 0) return;

    try{
        const result = await controller.postControllerCreate({
            name:  '萌萌的政政',
            content:newPostContent.value,
            images:newPostImages.value.toString()
        })
    }
    catch(error){
        alert(error)
    }
    posts.value.unshift({
        id:1000,
        name: '萌萌的政政',
        handle: 'wzz',
        avatar: '/avatar.jpg',
        createTime: 'Just now',
        content: newPostContent.value,
        images: newPostImages.value.toString(),
    });
    newPostContent.value = '';
    newPostImages.value = [];
};

// 分页加载
const loadPosts = async () => {
    if (isLoading.value || !hasMore.value) return;
    isLoading.value = true;

    const result= (await controller.postControllerGetByPage(page.value)) ;


    if (result.data!.length > 0) {
        result.data?.forEach((res)=>{
            posts.value.push({
                ...res,
                avatar:'/avatar.jpg'
            });
        })
        page.value++;
    } else {
        hasMore.value = false;
    }

    isLoading.value = false;
};
const UploadImages = async (file: any) => {
    try {
        const result = await controller.uploadControllerUploadImage({
            file: file
        })
        return result.data?.imageUrl ? `${VITE_API_BASE_URL}${result.data.imageUrl}` : ''
    }
    catch (error) {
        alert('图片上传失败' + error)
    }
    return ''
}
// 监听页面滚动
const observer = ref<IntersectionObserver | null>(null);

onMounted(() => {
    getLoginStatus()
    observer.value = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                loadPosts();
            }
        },
        { threshold: 0.1 }
    );
    const loadMoreEl = document.querySelector('#load-more');
    if (loadMoreEl && observer.value) {
        observer.value.observe(loadMoreEl);
    }
});
const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
};
const getLoginStatus=async ()=>{
    try{
        await controller.appControllerGetAuth()

        loginStatus.value = true
    }catch(error){
     throw error

    }

}

onUnmounted(() => {

    if (observer.value) {
        observer.value.disconnect();
    }
});
</script>

<style>
/* 自定义样式 */
</style>