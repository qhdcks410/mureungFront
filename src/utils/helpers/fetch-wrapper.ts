import { useAuthStore } from '@/stores/auth';
import { useLoginStore } from '@/stores/login';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
};

interface temp {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

interface UserData {
  username: string;
  password: string;
}

function request(method: string) {
  return (url: string, body?: object) => {
    const requestOptions: temp = {
      method,
      headers: authHeader(url)
    };
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(url, requestOptions).then(handleResponse);
  };
}

// helper functions

function authHeader(url: string): Record<string, string> {
  // return auth header with jwt if user is logged in and request is to the api url
  const loginStore = useLoginStore(); 
  
  // 3. loginStore에 저장된 accessToken이 있는지 확인합니다.
  // (loginStore 내부의 토큰 상태 속성명에 맞게 필요시 수정하세요. 예: loginStore.accessToken)
  const isLoggedIn = !!loginStore.accessToken; 
  
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);

  if (isLoggedIn && isApiUrl) {
    // 4. Bearer 토큰 주입
    return { Authorization: `Bearer ${loginStore.accessToken}` };
  } else {
    return {};
  }
}

function handleResponse(response: Response): Promise<UserData> {
  return response.text().then((text: string) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const authStore = useAuthStore();
      const loginStore = useLoginStore();

      // 💡 이전의 user 대신 loginStore에 accessToken(또는 유저 정보)이 있는지 확인합니다.
      const isLoggedIn = !!loginStore.accessToken; 

      if ([401, 403].includes(response.status) && isLoggedIn) {
        // 401, 403 에러 발생 시 useAuthStore의 logout 액션을 실행합니다.
        authStore.logout();
      }

      const error: string = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    // Ensure data is of type UserData
    return data as UserData;
  });
}
