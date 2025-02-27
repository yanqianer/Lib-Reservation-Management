<template>
    <div class="w-full min-h-screen flex flex-col">
        <Navbar />
        <div class="flex flex-col flex-grow">
            <!-- 标题：手机端缩小边距和字体 -->
            <div class="text-center mt-3 md:mt-5 text-3xl md:text-4xl border-b-2 mx-5 md:mx-10 pb-3 md:pb-5">
                关于本站
            </div>
            
            <!-- 内容区：手机端缩小边距/字体/圆角 -->
            <div class="flex-grow mx-5 md:mx-20 lg:mx-40 my-5 md:my-10 
                       rounded-lg md:rounded-2xl shadow-md md:shadow-lg 
                       border p-3 md:p-6 
                       text-base md:text-lg lg:text-xl
                       break-words overflow-auto">
                <p class="mb-3 md:mb-4">
                    前端 Vue3 + TypeScript，后端 NestJS + TypeScript
                </p>
                <p class="text-gray-600 text-sm md:text-base">
                    AI 辅助开发前端页面，当前版本仍在持续优化改进中，部分功能正在逐步完善。
                    不要用手机点开，没适配手机页面。
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Navbar from '@/components/Navbar.vue';
</script>

<style>
/* 移动端优化：小于 640px 时微调 */
@media (max-width: 640px) {
    .text-3xl {
        font-size: 1.5rem; /* 24px */
        line-height: 2rem; /* 32px */
    }
    .rounded-lg {
        border-radius: 0.5rem; /* 8px */
    }
}
</style>