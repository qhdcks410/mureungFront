import { defineStore } from 'pinia';
import { router } from '@/router';
import { useLoginStore } from '@/stores/login';
import request from '@/api/request';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
     const loginStore  = useLoginStore();

      const loginDto = {
        id: username,
        pw: password
      }
      const response = await request.post('/api/member/login',loginDto);

      if (response.status === 200) {

          await loginStore.setAccessToken(response.data.accessToken)
          await loginStore.setRefreshToken(response.data.refreshToken)

          localStorage.setItem('accessToken', response.data.accessToken)
          localStorage.setItem('refreshToken', response.data.refreshToken)
          await loginStore.getUserInfo(loginDto);

          router.push(this.returnUrl || '/dashboard/default');
      }

      // const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

      // // update pinia state
      // this.user = user;
      // // store user details and jwt in local storage to keep user logged in between page refreshes
      // localStorage.setItem('user', JSON.stringify(user));
      // // redirect to previous url or default to home page
      
    },
    logout() {
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    }
  }
});
