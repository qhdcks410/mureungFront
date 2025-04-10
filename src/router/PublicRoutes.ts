import { defineAsyncComponent } from 'vue';

const PublicRoutes = {
  path: '/',
  component: defineAsyncComponent(() => import('@/layouts/blank/BlankLayout.vue')) ,
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Authentication',
      path: '/login',
      component: defineAsyncComponent(() => import('@/views/authentication/LoginPage.vue'))
    }
  ]
};

export default PublicRoutes;
