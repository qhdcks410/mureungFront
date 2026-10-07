<template>
  <div class="logo-display">
    <RouterLink to="/" class="d-block text-decoration-none">
      <!-- 
        가장 확실한 경로인 public 폴더(/logo.png)를 사용합니다. 
        어떠한 환경에서도 이미지가 노출되도록 인라인 스타일을 강화했습니다.
      -->
      <img 
        src="/logo.png" 
        alt="무릉방앗간" 
        class="img-fluid"
        style="height: 70px !important; width: auto !important; display: block !important; margin: 0 auto !important; visibility: visible !important;" 
      />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.logo-display {
  width: 100%;
  display: block;
  text-align: center;
}
.img-fluid {
  max-width: 100%;
  image-rendering: -webkit-optimize-contrast;
}
</style>
