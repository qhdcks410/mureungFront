<template>
    <quill-editor class="ql-editor"
    ref="editor"
    v-model:value="state.content"
    :options="state.editorOption"
    :disabled='props.readOnly'
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    @change="onEditorChange($event)"
  />    

</template>

<script setup>
import { reactive,defineProps, onMounted, onBeforeMount, ref } from 'vue'

  // v-model을 사용하기 위해 'modelValue'라는 이름의 prop을 정의합니다.
  const props = defineProps({
    modelValue: Boolean, // Boolean 타입의 modelValue prop (v-model="상태" 에서 '상태'가 전달됨)
    readOnly: Boolean
  })

  const emit = defineEmits(['update:modelValue'])

  let toolBarOption = [];

  if(!props.readOnly){
    toolBarOption = [
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
  }else{
    toolBarOption = false
  }

  const state = reactive({
    content: '',
    _content: '',
    editorOption:{
        placeholder: '   내용을 입력해주세요...', // placeholder 설정     
        readOnly: true,
        modules: {
          toolbar: toolBarOption
        },
        // more options
      },
  })

  const base64toFile = (base_data, filename) => {

      var arr = base_data.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, {type:mime});
  }

  const getImagesFromQuillDelta = (quillInstance) => {
    if (!quillInstance) {
      return [];
    }

    const delta = quillInstance.getContents(); // 에디터 내용을 Delta 객체로 가져옴
    const images = [];

    if (delta && delta.ops) {
      delta.ops.forEach(op => {
        // op.insert 객체가 있고, 그 안에 image 속성이 있는지 확인
        if (op.insert && typeof op.insert === 'object' && op.insert.image) {
          // op.insert.image 값이 이미지 소스(URL 또는 base64)
          images.push(op.insert.image);
        }
      });
    }

    return images;
  }

  const editor = ref(null)

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
    state._content = html
    const images = getImagesFromQuillDelta(quill).map((i,r) => base64toFile(i,"eImg" + r));
    emit('update:modelValue',html,images)
  }

  

</script>
<style scoped>
.ql-editor{ 
  height: 500px !important;
  overflow: hidden;
  overflow-y: scroll;
  overflow-x: scroll;
}
</style>
