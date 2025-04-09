<template>
  <div class="text-center pa-4">
    <v-dialog
      :model-value="props.modelValue" @update:modelValue="closeDialog" max-width="800" >
    
      <template v-slot:default>
        <v-card title="상담내용">
        <template v-slot:text>
          <v-textarea :model-value="props.connValue" label="" rows="20"></v-textarea>
        </template>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog(false)">
            확인
          </v-btn>
        </template>
      </v-card>
    </template> 
    </v-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// v-model을 사용하기 위해 'modelValue'라는 이름의 prop을 정의합니다.
const props = defineProps({
  modelValue: Boolean, // Boolean 타입의 modelValue prop (v-model="상태" 에서 '상태'가 전달됨)
  connValue: String
})

// v-model을 사용하기 위해 'update:modelValue' 이벤트를 정의합니다.
const emit = defineEmits(['update:modelValue'])


// 다이얼로그를 닫아야 할 때 호출되는 함수
// 이 함수는 부모 컴포넌트에 'update:modelValue' 이벤트를 발생시켜 상태 변경을 알립니다.
function closeDialog(value) {
  // 부모에게 'modelValue'를 'value'(주로 false)로 업데이트하라고 알립니다.
  emit('update:modelValue', value)
}

</script>