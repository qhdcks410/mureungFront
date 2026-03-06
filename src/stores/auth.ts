import { defineStore } from 'pinia';
import { router } from '@/router';
import { useLoginStore } from '@/stores/login';
import request from '@/api/request';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth',{
  state: () => ({
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
     const loginStore  = useLoginStore();
     //로그인 에서 보던 화면 그대로 넘어오기
     const {redirect} = history.state;

      const loginDto = {
        id: username,
        pw: password
      }
      const response = await request.post('/api/member/login',loginDto);

      if (response.status === 200) {

          await loginStore.setAccessToken(response.data.accessToken)
          await loginStore.setRefreshToken(response.data.refreshToken)

          Cookies.set('accessToken', response.data.accessToken, { expires: 1 / 48 });
          Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });
          loginStore.setUserInfo(loginDto);

          router.push(redirect || '/customer');
      }
      
    },
    async logout() {
      const loginStore  = useLoginStore();
      const loginDto = {
        id: loginStore.userId
      }
      const response = await request.post('/api/member/logOut',loginDto);

      if (response.status === 200) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        useLoginStore().$reset()
        router.push('/login');
      }
    }
  }
});

