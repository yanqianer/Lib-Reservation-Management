<template>
    <div class="p-4 border rounded-lg shadow-sm w-full max-w-2xl mt-4 ">
        <div class="text-left w-full">
            <p class="text-4xl mb-3">评论</p>
        </div>
        <div class="flex space-x-4">
            <img :src="avatarUrl" class="w-20 h-20 rounded-full border" alt="avatar" />
            <div class="flex flex-col w-full space-y-2">
                <div class="flex space-x-2">
                    <input v-model="email" type="email" placeholder="电子邮件" class="border p-2 rounded w-1/3"
                        @blur="validateEmail" />
                    <input v-model="name" type="text" placeholder="昵称" class="border p-2 rounded w-1/3" />
                </div>
                <p v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</p>
                <textarea v-model="comment" placeholder="Comment" class="border p-2 rounded w-full"></textarea>
                <div class="flex items-center justify-between">
                    <button @click="emojiPickerVisible = !emojiPickerVisible" class="p-2">😊</button>
                    <button @click="submitComment" class="bg-red-500 text-white px-4 py-2 rounded">✍️ 发送</button>
                </div>
                <!-- Emoji 选择器 -->
                <div v-if="emojiPickerVisible" class="mt-2">
                    <Vue3EmojiPicker  :group-names="group" :native="true" @select="onSelectEmoji" />
                </div>
            </div>
        </div>
        <!-- 评论列表 -->
        <div class="mt-4">
            <div v-for="(c, index) in comments" :key="index" class="border-t pt-4 mt-4">
                <div class="flex space-x-4">
                    <img :src="c.avatar" class="w-10 h-10 rounded-full border" alt="avatar" />
                    <div>
                        <p class="font-bold">{{ c.name }}</p>
                        <p class="text-gray-600 text-sm">{{ c.content }}</p>
                        <p class="text-gray-400 text-xs">{{ formatTime(c.createTime) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { get } from '@/orval-test/client';
import { useRoute } from 'vue-router';
import type { AnonymousDto } from '@/orval-test/client.schemas';
import Vue3EmojiPicker from 'vue3-emoji-picker'; // 引入 vue3-emoji-picker
import 'vue3-emoji-picker/css'; // 引入样式

interface Comment extends AnonymousDto {
    avatar: string;
}

const email = ref('');
const name = ref('');
const comment = ref('');
const emojiPickerVisible = ref(false);
const avatarUrl = ref('');
const comments = ref<Comment[]>([]);
const controller = get();
const route = useRoute();
const emailError = ref('');

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
// 生成头像
const generateAvatar = () => {
    avatarUrl.value = createAvatar(adventurer, { seed: name.value }).toDataUri();
};
watch(name, generateAvatar, { immediate: true });

// 处理 Emoji 选择
const onSelectEmoji = (emoji: any) => {
    comment.value += emoji.i;
};

// 验证邮箱
const validateEmail = () => {
    if (!email.value) {
        emailError.value = '邮箱不能为空';
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.value = '请输入有效的电子邮件地址';
        return false;
    }
    emailError.value = ''; // 清空错误信息
    return true;
};

// 提交评论
const submitComment = async () => {
    if (!name.value || !comment.value) {
        alert('昵称和评论不能为空');
        return;
    }
    if (!validateEmail()) return;

    try {
        await controller.anonymousControllerCreate({
            name: name.value,
            content: comment.value,
            email: email.value,
            targetId: parseInt(route.params.id as string),
        });

        // 添加新评论到列表
        comments.value.unshift({
            id: Date.now(), // 临时 ID
            name: name.value,
            content: comment.value,
            avatar: avatarUrl.value,
            createTime: new Date().toISOString(),
            email: email.value,
        });

        // 清空输入框
        comment.value = '';
        email.value = '';
        name.value = '';
    } catch (error) {
        alert(error);
    }
};

// 格式化时间
const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
};

// 获取所有评论
const getAnonymous = async () => {
    const result = await controller.anonymousControllerFindAllByArticleId(parseInt(route.params.id as string));
    result.data!.forEach((res) => {
        comments.value.unshift({
            ...res,
            avatar: createAvatar(adventurer, { seed: res.name }).toDataUri(),
        });
    });
};

onMounted(async () => {
    await getAnonymous();
});
</script>

<style scoped>
button {
    cursor: pointer;
}

.emoji-picker {
    max-height: 200px;
    overflow-y: auto;
}
</style>