<template>
<RouterView />
</template>

<script  setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import { RouterView } from 'vue-router';

const error = ref();

onErrorCaptured(e => {
    error.value = e
    console.log(error.value)
    return true
})
</script>

<style scoped>
.loading-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
