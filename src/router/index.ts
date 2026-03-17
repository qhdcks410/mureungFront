import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import { defineAsyncComponent } from 'vue';
import Cookies from 'js-cookie';
import { useLoginStore } from '@/stores/login';

export const router =createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    MainRoutes,
    {
      path: '/',
      component: defineAsyncComponent(() => import('@/layouts/blank/BlankLayout.vue')) ,
      meta: {
        requiresAuth: false
      },
      children: [
        {
          name: 'login',
          path: '/login',
          component: () => import('@/views/authentication/LoginPage.vue')
        }
      ]
    },
  ]
});



router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = !!Cookies.get('accessToken'); // 토큰 존재 여부를 boolean으로 변환
  const loginRouteName = 'login';

  // 1. 로그인이 필요한 페이지인데 토큰이 없는 경우
  if (to.name !== loginRouteName && !isAuthenticated) {
    next({
      name: loginRouteName,
      query: { redirect: to.fullPath } // state 대신 query를 쓰면 URL 유지에 유리함
    });
  } 
  // 2. 이미 로그인했는데 로그인 페이지로 가려는 경우
  else if (to.name === loginRouteName && isAuthenticated) {
    next({ name: 'Default' }); // 대시보드(Default) 페이지로 리다이렉트
  } 
  // 3. 그 외 모든 경우 (정상 통과)
  else {
    next();
  }
});
