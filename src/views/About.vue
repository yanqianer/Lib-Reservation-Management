<template>

    <div class="w-full min-h-screen">
        <Navbar />
        <div class="flex  flex-col">
            <div class=" text-center mt-5 text-4xl border-b-2  mx-10 pb-5">
                关于本站
            </div>
            <div class=" min-h-[500px]  mx-40 rounded-2xl shadow-lg mt-10  border p-4 text-xl">
                前端vue3,后端nestjs,全程使用typescript,ai帮忙写了前端页面。目前还有很多bug和地方没修没做。
            </div>


        </div>
      

    </div>

</template>

<script setup lang='ts'>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue';
</script>
<style></style>