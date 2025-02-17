<template>
  <div class="desktop-login-container">
    <!-- 左侧品牌区 -->
    <div class="brand-section">
      <div class="brand-logo">
        <LockIcon class="logo-icon" />
      </div>
      <h1 class="brand-title">企业级管理系统</h1>
      <div class="security-features">
        <div class="feature-item">
          <ShieldCheckIcon class="feature-icon" />
          <span>ISO 27001认证</span>
        </div>
        <div class="feature-item">
          <ServerIcon class="feature-icon" />
          <span>私有化部署</span>
        </div>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-section">
      <div class="login-wrapper">
        <h2 class="login-title">账户登录</h2>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>企业邮箱</label>
            <input
              type="txt"
              v-model="form.email"
              placeholder="name"
              class="form-input"
            
            >
          </div>

          <div class="form-group">
            <div class="password-header">
              <label>登录密码</label>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>
            <input
              type="password"
              v-model="form.password"
              placeholder="••••••••"
              class="form-input"
              required
            >
          </div>

          <button type="submit" :disabled="loading" class="login-button">
            <span v-if="!loading">立即登录</span>
            <span v-else>登录中...</span>
          </button>
        </form>

        <div class="sso-login">
          <div class="sso-divider">
            <span>其他登录方式</span>
          </div>
          <div class="sso-buttons">
            <button class="sso-button">
              <WeChatIcon class="sso-icon" />
              微信登录
            </button>
            <button class="sso-button">
              <GitHubIcon class="sso-icon" />
              GitHub登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LockIcon from '@/components/icons/LockIcon.vue'
//import ShieldCheckIcon from '@/components/icons/ShieldCheckIcon.vue'
//import ServerIcon from '@/components/icons/ServerIcon.vue'
import WeChatIcon from '@/components/icons/WeChatIcon.vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'
import { get } from '@/orval-test/client'
import router from '@/router'
import { AdminStore } from '@/stores/counter'
const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    // 这里添加实际的登录逻辑
    const controller =  get()
    const result = controller.adminControllerDoLogin({
      name:form.value.email,
      password:form.value.password
    })
   
    result.then((res)=>{
        const data = res.data
        if(res.code==200){
          const adminStore = AdminStore()
          adminStore.setAdminDto(data.user)
          localStorage.setItem('jwt_token', data.access_token);
          console.log( data.access_token)
          console.log(adminStore.admin.createTime)
          router.push('/index')
          
        }
    })
    await new Promise(resolve => setTimeout(resolve, 1500))
  } finally {
    loading.value = false
  }
}
</script>

<style>
.desktop-login-container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #f8fafc;
}

.brand-section {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  padding: 80px;
  color: white;
  display: flex;
  flex-direction: column;
}

.brand-logo {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
}

.logo-icon {
  width: 48px;
  height: 48px;
}

.brand-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 40px;
}

.security-features {
  margin-top: auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 24px;
}

.feature-icon {
  width: 24px;
  height: 24px;
}

.login-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
}

.login-wrapper {
  width: 480px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 60px;
  color: #1e293b;
}

.form-group {
  margin-bottom: 32px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.form-input {
  width: 100%;
  padding: 16px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  color: #4f46e5;
  font-size: 14px;
  text-decoration: none;
}

.login-button {
  width: 100%;
  padding: 18px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.login-button:hover {
  background: #4338ca;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sso-divider {
  margin: 40px 0;
  position: relative;
  text-align: center;
  color: #94a3b8;
}

.sso-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid #e2e8f0;
  z-index: 1;
}

.sso-divider span {
  position: relative;
  background: white;
  padding: 0 16px;
  z-index: 2;
}

.sso-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.sso-button {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s;
}

.sso-button:hover {
  border-color: #4f46e5;
  background: #f8fafc;
}

.sso-icon {
  width: 20px;
  height: 20px;
}
</style>
