<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';


const show1 = ref(false);
const password = ref('test');
const username = ref('test');
/* eslint-disable @typescript-eslint/no-explicit-any */
function validate(_values: any, { setErrors }: any) {
  const authStore = useAuthStore();
  authStore.login(username.value, password.value).catch((error) => setErrors({ apiError: error }));
}

</script>

<template>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <div class="mb-6">
      <v-label class="font-weight-bold text-subtitle-2 mb-2 ml-1">아이디</v-label>
      <v-text-field
        v-model="username"
        placeholder="아이디를 입력해 주세요"
        required
        density="comfortable"
        hide-details="auto"
        variant="outlined"
        color="primary"
        prepend-inner-icon="$accountOutline"
        class="custom-input shadow-input"
      ></v-text-field>
    </div>
    
    <div class="mb-8">
      <v-label class="font-weight-bold text-subtitle-2 mb-2 ml-1">비밀번호</v-label>
      <v-text-field
        v-model="password"
        placeholder="비밀번호를 입력해 주세요"
        required
        density="comfortable"
        variant="outlined"
        color="primary"
        hide-details="auto"
        prepend-inner-icon="$lockOutline"
        :append-inner-icon="show1 ? '$eye' : '$eyeOff'"
        :type="show1 ? 'text' : 'password'"
        @click:append-inner="show1 = !show1"
        class="custom-input shadow-input"
      ></v-text-field>
    </div>

    <v-btn 
      color="primary" 
      :loading="isSubmitting" 
      block 
      class="login-btn py-7" 
      variant="flat" 
      size="large" 
      type="submit"
      rounded="xl"
    >
      <span class="text-h6 font-weight-bold">로그인</span>
      <div class="btn-shine"></div>
    </v-btn>
    
    <div v-if="errors.apiError" class="mt-4">
      <v-alert color="error" variant="tonal" density="compact" icon="$alertCircleOutline" class="rounded-lg">
        {{ errors.apiError }}
      </v-alert>
    </div>
  </Form>
  <div class="mt-10 text-center">
    <v-divider class="mb-4 opacity-10" />
    <p class="text-caption text-lightText font-weight-medium">
      &copy; {{ new Date().getFullYear() }} 무릉방앗간 &middot; <span class="text-primary">Admin Portal</span>
    </p>
  </div>
</template>
<style lang="scss">
.custom-input {
  .v-field {
    border-radius: 16px !important;
    background: rgba(255, 255, 255, 0.5) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-color: rgba(0,0,0,0.05) !important;
    
    &--focused {
      background: white !important;
      box-shadow: 0 10px 20px rgba(30, 136, 229, 0.1) !important;
      transform: translateY(-2px);
    }
    
    &:hover:not(.v-field--focused) {
      border-color: rgba(30, 136, 229, 0.3) !important;
    }
  }
}

.login-btn {
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(30, 136, 229, 0.4) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(30, 136, 229, 0.5) !important;
    
    .btn-shine {
      left: 100%;
      transition: all 0.6s ease-in-out;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }

  .btn-shine {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: all 0s;
  }
}

.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 600;
  }
}

.opacity-10 { opacity: 0.1; }
</style>
