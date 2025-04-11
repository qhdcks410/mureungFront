<template>
    <quill-editor class="ql-editor"
    v-model:value="state.content"
    :options="state.editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    @change="onEditorChange($event)"
  />    

</template>

<script setup>
import { reactive,defineProps } from 'vue'

  // v-model을 사용하기 위해 'modelValue'라는 이름의 prop을 정의합니다.
  const props = defineProps({
    modelValue: Boolean, // Boolean 타입의 modelValue prop (v-model="상태" 에서 '상태'가 전달됨)
  })

  const state = reactive({
    content: '',
    _content: '',
    editorOption:{
        placeholder: '   내용을 입력해주세요...', // placeholder 설정
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        },
        // more options
      },
  })
  const onEditorBlur = (quill) => {
    console.log('editor blur!', quill)
  }
  const onEditorFocus = (quill) => {
    console.log('editor focus!', quill)
  }
  const onEditorReady = (quill) => {
    console.log('editor ready!', quill)
  }
  const onEditorChange = ({ quill, html, text }) => {
    console.log('editor change!', quill, html, text)
    state._content = html
  }
</script>
<style scoped>
.ql-editor{ 
  height: 400px !important;
  overflow: hidden;
  overflow-y: scroll;
  overflow-x: scroll;
}
</style>
