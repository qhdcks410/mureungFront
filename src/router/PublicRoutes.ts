import { defineAsyncComponent } from 'vue';

const PublicRoutes = {
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
};

export default PublicRoutes;
