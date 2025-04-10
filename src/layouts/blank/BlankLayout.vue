// ===============================|| Blank Layout ||=============================== //
<template>
  <v-app>
    <RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 메인 컨텐츠 -->
          <component :is="Component"></component>

          <!-- 로딩 상태 -->
          <template #fallback>
            로딩중...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
  </v-app>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
