<template>
    <div class="w-full min-h-screen flex flex-col">
        <Navbar />
        <div class="flex flex-col flex-grow dark:bg-gray-800">
            <!-- 标题：现代多彩风格 -->
            <div class="text-center mt-3 md:mt-5 text-3xl md:text-4xl border-b-2 mx-5 md:mx-10 pb-3 md:pb-5">
                <span class="modern-multicolor-text">关于本站</span>
            </div>
            
            <!-- 内容区 -->
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
                    
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Navbar from '@/components/Navbar.vue';
</script>

<style>
/* 现代多彩渐变文本 */
.modern-multicolor-text {
    font-weight: bold;
    background: linear-gradient(90deg, 
        #ff3cac, /* 粉色 */
        #784ba0, /* 紫色 */
        #2b86c5, /* 蓝色 */
        #ffb900, /* 黄色 */
        #ff6f61, /* 橙色 */
        #4caf50  /* 绿色 */
    );
    background-size: 400% 400%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: multicolorGradient 6s infinite linear;
}

/* 流畅的渐变动画 */
@keyframes multicolorGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
</style>
