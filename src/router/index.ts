import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import { defineAsyncComponent } from 'vue';

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

interface User {
  id: number;
  name: string;
}

// Assuming you have a type/interface for your authentication store
interface AuthStore {
  user: User | null;
  returnUrl: string | null;
  login(username: string, password: string): Promise<void>;
  logout(): void;
}


router.beforeEach(async (to, from, next) => {

  // isAuth가 토큰 자체인지, boolean인지 명확히 가정. 여기서는 boolean으로 가정.
  const isAuthenticated = localStorage.getItem('accessToken'); // 예시: 인증 상태 boolean 반환 메서드

  // 로그인 라우트 이름 확인 (예: 'login')
  const loginRouteName = 'login';
  // 로그인 후 리디렉션될 기본 라우트 이름 (예: 'DashboardHome')
  const main = 'custom';

  if (to.name !== loginRouteName && !isAuthenticated) {
    // 로그인이 필요한 페이지 + 로그인 안됨 => 로그인 페이지로 리디렉션
    console.log('Redirecting to login page.');
    next({
      name: 'login',
      state: { redirect: to.fullPath } // 로그인 후 돌아갈 경로 전달
    });
  } else if (to.name === loginRouteName && isAuthenticated) {
    // 로그인 페이지에서 다른 곳으로 리디렉션할 때는 redirect 쿼리 불필요
    next({ name: main });
  } else {

    next();
  }
});
