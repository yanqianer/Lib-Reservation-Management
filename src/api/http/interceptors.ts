import type { AxiosInstance } from 'axios'

export function setupInterceptors(instance: AxiosInstance) {
  // 请求拦截
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // 响应拦截
  instance.interceptors.response.use(
    response => {
      // 统一处理业务成功状态
      if (response.data.code === 200) return response.data
      return Promise.reject(response.data)
    },
    error => {
      // 统一处理错误
      const status = error.response?.status
      switch (status) {
        case 401:
          handleUnauthorized()
          break
        case 403:
          handleForbidden()
          break
        default:
          console.error(`API Error: ${error.message}`)
      }
      return Promise.reject(error)
    }
  )
}

function handleUnauthorized() {
  // 跳转登录页等操作
}

function handleForbidden() {
  // 显示权限不足提示
}
