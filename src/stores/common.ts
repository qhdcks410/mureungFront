import { defineStore } from 'pinia';

export const useCommonStore = defineStore({
  id: 'useCommonStore',
  state: () => ({
    isShowProgress : false
  }),
  getters: {
  },
  actions: {
    showProgressBar() {
      this.isShowProgress = true;
    },
    hideProgressBar() {
      this.isShowProgress = false;
    }
  }
});