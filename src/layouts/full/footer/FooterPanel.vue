<script setup lang="ts">
import { shallowRef } from 'vue';

const footerLink = shallowRef([
  {
    title: '스마트플레이스',
    url: 'https://new.smartplace.naver.com/'
  },
  {
    title: '스마트스토어',
    url: 'https://smartstore.naver.com/youngstay'
  },
  {
    title: '블로그',
    url: 'https://blog.naver.com/mureung_dessert'
  }
]);
</script>
<template>
  <v-footer class="px-0 py-4 bg-transparent">
    <v-container fluid>
      <v-row no-gutters align="center">
        <v-col cols="12" class="text-center">
          <p class="text-caption font-weight-medium color-lightText opacity-70">
            &copy; {{ new Date().getFullYear() }} <span class="text-primary">무릉방앗간</span> &middot; 스마트 관리 시스템 v1.3.0
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
<style scoped>
.color-lightText {
  color: #64748b;
}
.opacity-70 {
  opacity: 0.7;
}
</style>
