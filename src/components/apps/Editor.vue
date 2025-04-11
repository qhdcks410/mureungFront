<template>
  <ckeditor
    :editor="editor"
    :modelValue="modelValue"  
    @update:modelValue="handleInput" 
    :config="editorConfig"
    @ready="onEditorReady"
  ></ckeditor>
  </template>

<script setup>
import { ref, shallowRef, defineProps, defineEmits, computed } from 'vue';

// CKEditor 및 빌드, 언어팩 가져오기
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko'; // 한국어

// Props 정의: modelValue (v-model을 위해) 와 config (설정 객체)
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  config: {
    type: Object,
    default: () => ({ // 기본 설정 객체
      language: 'ko',
      placeholder: '내용을 입력하세요...'
    })
  }
});

// Emits 정의: update:modelValue (v-model을 위해)
const emit = defineEmits(['update:modelValue', 'ready']); // ready 이벤트도 emit 하도록 추가

// 사용할 에디터 정의
const editor = shallowRef(ClassicEditor);

// 에디터 설정을 props로부터 받음
const editorConfig = ref(props.config);

// CKEditor의 @update:modelValue 이벤트를 처리하여 부모에게 다시 emit
const handleInput = (value) => {
  // 부모 컴포넌트로 update:modelValue 이벤트 발생
  emit('update:modelValue', value);
};

// 에디터 준비 완료 시 이벤트 핸들러
const onEditorReady = (editorInstance) => {
  console.log('MyEditor: Editor is ready!', editorInstance);
  // 부모 컴포넌트에도 ready 이벤트를 전달할 수 있음
  emit('ready', editorInstance);
};

// CKEditor 컴포넌트 변수 할당 (템플릿에서 사용하기 위해)
const ckeditor = CKEditor.component;

/* // 만약 <ckeditor v-model="editorContent"> 방식을 사용한다면:
// computed 속성을 사용하여 props.modelValue와 emit을 연결
const editorContent = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
*/
</script>

<style>
/* 필요시 스타일 추가 */
.ck-editor__editable {
  min-height: 250px;
}
</style>