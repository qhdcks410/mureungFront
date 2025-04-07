import {defineStore} from "pinia";
import request from "@/api/request";

export const useLoginStore = defineStore({
  id: 'useLoginStore',
  state: () => ({
    accessToken: '',
    refreshToken: '',
    userId: '',
    username: '',
    userRole: ''
  }),
  getters: {
  },
  actions: {
    async setAccessToken (token: string){
      this.accessToken = token;
    },
    async setRefreshToken(token: string){
      this.refreshToken = token;
    },
    async getAccessToken(){
      return this.accessToken
    },
    async getRefreshToken(){
      return this.accessToken
    },  
    //유저 정보
    async getUserInfo(loginDto: { id: string; pw: string; }){
      try {

          const param = {id : loginDto.id}
          await request.post('/api/member/getMember',param).then((response) => {
            const data = response.data;
            this.userId = data.id
            this.username = data.username
            this.userRole = data.roles
          })
          //role.value = response.data.data.role;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
          localStorage.removeItem('accessToken');
      }
  }
  }
})
