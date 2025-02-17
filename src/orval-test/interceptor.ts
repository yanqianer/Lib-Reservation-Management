import { AXIOS_INSTANCE } from "./custom-instance";
import router from "@/router";
// 添加请求拦截器
export const setupAxiosInterceptor = () => {
  AXIOS_INSTANCE.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwt_token'); // 从本地存储获取 Token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // 添加 JWT 认证头
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  //添加响应拦截器（可选）
  AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.warn('身份验证失败，重定向到登录页');
        // 这里可以触发登出逻辑，比如清除本地存储并跳转到登录页
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('admin');
      }
      return Promise.reject(error);
    }
  );
};
