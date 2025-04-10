<template >
    <v-progress-linear
        :active="props.isShow"
        indeterminate
        color="deep-purple-accent-4"
        location="top"
    ></v-progress-linear>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// v-model을 사용하기 위해 'modelValue'라는 이름의 prop을 정의합니다.
const props = defineProps({
  isShow: Boolean
})

</script>