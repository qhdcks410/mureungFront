import axios from "axios";
import { router } from '@/router';
import { useCommonStore } from "@/stores/common";
import { useAuthStore } from "@/stores/auth";
import { useLoginStore } from "@/stores/login";
import Cookies from "js-cookie";
axios.defaults.baseURL = import.meta.env.VITE_API_URL


// axios 인스턴스를 생성합니다.
const request = axios.create({
  baseURL: axios.defaults.baseURL,
  timeout: 5000000, // 해당 timeout이 지나면 err가 발생합니다.
});

// request 인터셉터
request.interceptors.request.use(
  (config) => {

    useCommonStore().showProgressBar();
    // 스토리지에서 토큰을 가져온다.
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    console.log(accessToken)
    // 토큰이 있으면 요청 헤더에 추가한다.
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // Refresh 토큰을 보낼 경우 사용하고자 하는 커스텀 인증 헤더를 사용하면 된다.
    if (refreshToken) {
        config.headers['RrefreshToken'] = `Bearer ${refreshToken}`;
    }

    return config;
  },
  (error) => {

    // 오류 요청을 보내기 전에 수행해야 할 일
    useCommonStore().hideProgressBar();

  	// http status가 200인 아닌 경우 응답 바로 직전에 대해 작성.
    if (error.response?.status === 401) {
    }else if(error.response?.status === 403){
      router.push('/login');
    }

    return Promise.reject(error);
  }
);

// response 인터셉터
request.interceptors.response.use(
  (res) => {
    useCommonStore().hideProgressBar();
    return res;
  },
  async (error) => {
    useCommonStore().hideProgressBar();
    const { config, response } = error;
    //테스트
    // 401 에러이고 재시도한 적이 없을 때만 실행
    if (response?.status === 401 && !config._retry) {
      config._retry = true; // 재시도 표시 (무한루프 방지)

      try {
        const loginStore = useLoginStore();
        const refreshToken = Cookies.get("refreshToken");

        // 1. 토큰 갱신 요청
        const { data } = await axios.post("/api/member/auth/refresh", 
          { id: loginStore.userId },
          { headers: { Authorization: `Bearer ${refreshToken}` }, baseURL: axios.defaults.baseURL }
        );

        // 2. 새로운 토큰 저장
        loginStore.setAccessToken(data.accessToken);
        loginStore.setRefreshToken(data.refreshToken);
        Cookies.set('accessToken', data.accessToken, { expires: 1 / 48 });
        Cookies.set('refreshToken', data.refreshToken, { expires: 7 });

        // 3. 원래 실패했던 요청의 헤더를 새 토큰으로 교체 후 재실행
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(config); 
        
      } catch (refreshError) {
        // 리프레시 토큰마저 만료된 경우 로그아웃
        //useAuthStore().logout();
        router.push('/login');

        return Promise.reject(refreshError);
      }
    }

    if (response?.status === 403) alert("권한이 없습니다.");
    return Promise.reject(error);
  }
);

export default request;
