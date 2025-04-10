import axios from "axios";
import { router } from '@/router';
import { useCommonStore } from "@/stores/common";
axios.defaults.baseURL = 'http://localhost:5173'


// axios 인스턴스를 생성합니다.
const request = axios.create({
  baseURL: axios.defaults.baseURL,
  timeout: 50000, // 해당 timeout이 지나면 err가 발생합니다.
});

// request 인터셉터
request.interceptors.request.use(
  (config) => {

    useCommonStore().showProgressBar();
    // 스토리지에서 토큰을 가져온다.
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // 토큰이 있으면 요청 헤더에 추가한다.
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // Refresh 토큰을 보낼 경우 사용하고자 하는 커스텀 인증 헤더를 사용하면 된다.
    if (refreshToken) {
        config.headers['x-refresh-token'] = refreshToken;
    }

    return config;
  },
  (error) => {

    // 오류 요청을 보내기 전에 수행해야 할 일
    useCommonStore().hideProgressBar();
    return Promise.reject(error);
  }
);

// response 인터셉터
request.interceptors.response.use(
  (response) => {
    useCommonStore().hideProgressBar();
        // http status가 200인 경우 응답 바로 직전에 대해 작성.
        
    	return response;
  },
  (error) => {
    useCommonStore().hideProgressBar();
  	// http status가 200인 아닌 경우 응답 바로 직전에 대해 작성.
    if (error.response?.status === 401) {
    }else if(error.response?.status === 403){
      router.push('/login');
    }
    return Promise.reject(error)
  }
);

export default request;
