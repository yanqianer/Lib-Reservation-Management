import type { AdminDto } from '@/orval-test/client.schemas';
import { createRouter, createWebHistory } from 'vue-router'
import { get } from '@/orval-test/client';
const controller = get()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue'),
      children: [
        {
          path: '/admin/adminManage',
          component: () => import('../views/AdminManagementView.vue')
        },
        {
          path: '/admin/blogManage',
          component: () => import('../views/BlogManagement.vue')
        },
        {
          path: '', // 默认子路由，进入 /admin 时重定向到 /admin/users
          name:'redirect',
          redirect: '/admin/adminManage',
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: {
        NoAuth: true
      }
    },
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue')

    },
    {
      path: '/blog/:id',
      name: 'PostDetail',
      component: () => import('../views/BolgPost.vue')
    },
    {
      path: '/login',
      name: 'UserLogin',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/test',
      component: () => import('../views/test2.vue')
    },
    {
      path: '/post',
      component: () => import('../views/Invitation.vue')
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: () => import('../views/Forbidden.vue'),
    },
    {
      path:'/about',
      component:()=>import('../views/About.vue')
    }

  ],
})
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('jwt_token');


//   if (!token && to.path !== '/login') {
//     if(to.meta.NoAuth){
//       next();
//     }
//     else{
//       next('/login'); // 只在访问非登录页时重定向
//     }
//   }else if(token&&to.path=='/login'){
//     next('/index')
//   } 
//   else {
//     next(); // 继续访问目标页面
//   }
// });
router.beforeEach( async (to, from, next) => {
  const token = localStorage.getItem('jwt_token');// TODO:不能这样判断，太简单了，不然当token过期了也进不去登录页面
  const adminString = localStorage.getItem('admin'); // 获取字符串
  const admin = adminString ? JSON.parse(adminString) : null; //必须要用json parse解析，如果用as强制类型转换是不行的，能拿出来字符串但是拿不到属性
  

  // const loginStatus = 
  // try{
    

  // }catch(error){



  // }

  if (token && to.path == '/login') {// 不许登录之后访问login
    next('/')
  }
  else if (to.path.startsWith('/admin')) {
    try{
      if((await controller.appControllerGetAuth()).code!=200){
        alert('请登录后尝试')
        next('/login')
    }else if((await controller.appControllerGetRole()).code!=200){
      next('/forbidden')
    }
    else{
       next()
    } 
    }catch(error){
      next('/forbidden')
    }
   
  }
  else { //其他请求统统放行
    next()
  }
})
function checkPermission() {
  // 这里可以根据实际需求检查用户权限
  // 例如从 Vuex 或 localStorage 中获取用户角色
  const admin = localStorage.getItem('admin') as unknown as AdminDto// 假设用户角色存储在 localStorage
  return admin.role === 'SuperAdmin'; // 只有角色为 admin 的用户可以访问
}

export default router
