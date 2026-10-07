<script setup lang="ts">
import AuthLogin from './authForms/AuthLogin.vue';
import { useCommonStore } from '@/stores/common';
import ProgressBar from '@/components/apps/ProgressBar.vue';

const common = useCommonStore();
</script>

<template>
  <ProgressBar :is-show="common.isShowProgress" />
  <div class="login-wrapper">
    <!-- Grain Texture Overlay -->
    <div class="grain-overlay"></div>
    
    <!-- Animated background elements -->
    <div class="bg-blob bg-blob-1"></div>
    <div class="bg-blob bg-blob-2"></div>
    <div class="bg-blob bg-blob-3"></div>
    
    <v-row class="h-screen ma-0 content-container" no-gutters>
      <!-- Left Part: Branding -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center branding-section">
        <v-container>
          <div class="text-center px-10 branding-content animate-fade-up">
            <div class="logo-glow-wrapper mb-8">
              <img src="/logo.png" alt="무릉방앗간" class="login-logo-large" />
            </div>
            <h1 class="text-h2 font-weight-bold mb-4 branding-title">무릉방앗간</h1>
            <div class="title-underline mb-6"></div>
            <p class="text-h5 font-weight-regular branding-subtitle">
              정성을 담은 전통의 맛,<br/>
              <span class="highlight-text">더 스마트한 관리</span>로 함께합니다.
            </p>
          </div>
        </v-container>
      </v-col>

      <!-- Right Part: Login Form -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center form-section">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" sm="8" lg="7" xl="6" class="animate-fade-up delay-1">
              <v-card elevation="24" rounded="xl" class="login-card pa-4 pa-sm-10">
                <v-card-text>
                  <!-- Logo for Mobile -->
                  <div class="d-md-none text-center mb-10">
                    <img src="/logo.png" alt="무릉방앗간" class="mb-4 login-logo-mobile" />
                    <h2 class="text-h4 font-weight-bold color-dark">로그인</h2>
                  </div>
                  
                  <div class="d-none d-md-block mb-10">
                    <h2 class="text-h3 font-weight-bold mb-2 color-dark">Welcome back</h2>
                    <p class="text-subtitle-1 text-lightText">오늘도 활기찬 하루 되세요!</p>
                  </div>

                  <!-- Login Form -->
                  <AuthLogin />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.login-wrapper {
  position: relative;
  min-height: 100vh;
  background-color: #f8f9fa;
  background-image: radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.5) 0, transparent 50%), 
                    radial-gradient(at 50% 0%, rgba(238, 242, 255, 0.5) 0, transparent 50%);
  overflow: hidden;
}

/* Grainy texture for organic feel */
.grain-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.03;
  pointer-events: none;
  z-index: 2;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3column%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Floating Blobs Animation */
@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.4;
  animation: float 20s infinite ease-in-out;
}

.bg-blob-1 {
  width: 600px; height: 600px;
  background: #ffe3e3;
  top: -200px; left: -100px;
  animation-delay: 0s;
}

.bg-blob-2 {
  width: 700px; height: 700px;
  background: #e0e7ff;
  bottom: -200px; right: -100px;
  animation-delay: -5s;
}

.bg-blob-3 {
  width: 500px; height: 500px;
  background: #dcfce7;
  top: 30%; left: 20%;
  animation-delay: -10s;
}

/* Entrance Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  animation: fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.delay-1 { animation-delay: 0.2s; opacity: 0; }

.content-container { position: relative; z-index: 3; }

.branding-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.branding-title {
  color: #1a1a1a;
  letter-spacing: -2px;
  font-size: 4rem !important;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: #1e88e5;
  margin: 0 auto;
  border-radius: 2px;
}

.branding-subtitle {
  color: #4a4a4a;
  line-height: 1.6;
}

.highlight-text {
  color: #1e88e5;
  font-weight: 700;
}

.login-card {
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  
  &:hover {
    transform: translateY(-10px) scale(1.01);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1) !important;
  }
}

.logo-glow-wrapper {
  position: relative;
  display: inline-block;
  &::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(30, 136, 229, 0.15) 0%, transparent 70%);
    z-index: -1;
  }
}

.login-logo-large {
  height: 140px;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.08));
}

.login-logo-mobile { height: 80px; }
.color-dark { color: #1a1a1a !important; }
</style>
