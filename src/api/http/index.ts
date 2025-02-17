import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { setupInterceptors } from './interceptors'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 配置拦截器
// setupInterceptors(http)

export default http
