<template>
  <div class="relative flex h-screen items-center justify-center overflow-hidden w-full">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient"></div>
    <div class="absolute inset-0 bg-white opacity-20 mix-blend-overlay"></div>
    <div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl animate-fade-in">
      <h2 class="mb-6 text-center text-2xl font-semibold text-gray-900 animate-slide-down">登录</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">用户名</label>
          <input v-model="email" type="txt" required
            class="mt-1 w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-black focus:ring-black transition-transform transform hover:scale-105" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">密码</label>
          <input v-model="password" type="password" required
            class="mt-1 w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-black focus:ring-black transition-transform transform hover:scale-105" />
        </div>
        <button type="submit"
          class="w-full rounded-lg bg-black p-3 text-white transition hover:bg-gray-800 active:scale-95"
          :disabled="loading"> <span v-if="!loading">立即登录</span>
          <span v-else>登录中...</span></button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-500 animate-fade-in">还没有账号？<a href="http://localhost:5173/register"
          class="text-black hover:underline">注册</a></p>
          <p class="mt-4 text-center text-sm text-gray-500 animate-fade-in"><a href="http://localhost:5173/" 
          class="text-black hover:underline">跳过登录</a></p>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { get } from '@/orval-test/client'
import router from '@/router'
import { AdminStore } from '@/stores/counter'
const email = ref('');
const password = ref('');
const loading = ref(false)
const handleLogin = async () => {
  try {
    loading.value = true
    const controller = get()
    const result = await controller.adminControllerDoLogin({
      name: email.value,
      password: password.value
    })
    if (result.code == 200) {
      alert('登录成功');
      const data = result.data!
      const adminStore = AdminStore()
      adminStore.setAdminDto(data.user)
      localStorage.setItem('jwt_token', data.access_token);
      console.log(data.access_token)
      console.log(adminStore.admin.createTime)
      router.push('/')
    }
  } catch (error: any) {
    alert('登录失败，用户名或密码错误');
  }
  finally {
    await new Promise(resolve => setTimeout(resolve, 1500))
    loading.value = false
  }

};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-down {
  animation: slideDown 0.8s ease-out;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}

input {
  transition: all 0.2s ease-in-out;
}
</style>
