<template>
    <RouterView v-slot="{ Component }">
      <Suspense timeout="0">
        <template #default>
        <component :is="Component"></component>
        </template>
        <template #fallback>
          <v-app>
            <v-row class="h-screen" no-gutters>
              <v-col cols="12" class="d-flex align-center bg-lightprimary">
                <v-container>
                  <div class="suspense-loading">
                    <div class="spinner"></div>
                    <p>페이지 로딩 중...</p>
                  </div>                  
                </v-container>  
              </v-col>  
            </v-row>
          </v-app>
        </template>
      </Suspense>
    </RouterView>
</template>

<script  setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<style scoped>
/* Suspense Fallback 로딩 스타일 (내부 정렬은 이미 중앙) */
.suspense-loading {
  display: flex;
  flex-direction: column; /* 스피너와 텍스트를 수직으로 배치 */
  align-items: center; /* 수평 중앙 정렬 */
  justify-content: center; /* 수직 중앙 정렬 (div 자체 높이 내에서) */
  padding: 40px; /* 내부 콘텐츠와 테두리 사이의 여백 */
  text-align: center;
  color: #555;
  /* background-color: rgba(255, 0, 0, 0.1); */ /* 영역 확인용 임시 배경색 */
}

/* 간단한 CSS 스피너 */
.spinner {
  width: 100px; /* 크기 조정 */
  height: 100px;
  position: relative;
  margin-bottom: 15px;
}

.spinner::before,
.spinner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 6px solid transparent; /* 두께 조정 */
  box-sizing: border-box; /* 테두리 포함 크기 계산 */
}

.spinner::before {
  border-top-color: #42b983; /* Vue 녹색 */
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner::after {
  border-bottom-color: #3498db; /* 다른 색상 추가 (예: 파란색) */
  animation: spin 0.8s linear infinite reverse; /* 반대 방향, 다른 속도 */
  opacity: 0.6;
}

/* @keyframes spin 은 기존 것을 사용하거나 약간 수정 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
