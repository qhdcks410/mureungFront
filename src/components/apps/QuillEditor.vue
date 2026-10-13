<template>
    <quill-editor
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
    readOnly: Boolean,
    imgFiles: Object
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
          toolbar: toolBarOption,
          imageResize: {
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
          }          
        },
        // more options
      },
  })

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
// *** Promise.all을 사용하도록 수정된 onEditorReady 함수 ***
const onEditorReady = async (quill) => {
  console.log('editor ready!', quill);
  console.log('Initial imgFiles:', props.imgFiles);

  const delta = quill.getContents(); // 현재 에디터 내용을 Delta 객체로 가져옴
  const promises = []; // 비동기 작업을 담을 배열

  if (delta && delta.ops && props.imgFiles && props.imgFiles.length > 0) {
    let imgIndex = 0; // props.imgFiles 배열의 인덱스

    // Delta의 각 operation을 순회
    for (const op of delta.ops) {
      // op가 이미지 삽입이고, 처리할 imgFiles 데이터가 남아 있는지 확인
      if (op.insert && typeof op.insert === 'object' 
                    && op.insert.image 
                    && imgIndex < props.imgFiles.length) {

        // imgFiles 배열에서 현재 순서에 맞는 파일 ID 사용
        const fileInfo = props.imgFiles[imgIndex];
        if (!fileInfo || !fileInfo.fileId) {
           console.warn(`Skipping image at index ${imgIndex}: Invalid fileInfo or missing fileId.`);
           imgIndex++; // 다음 파일 정보로 넘어감
           continue; // 다음 op로 넘어감
        }
        
        //인증정보 부치기
        const url = `${import.meta.env.VITE_API_URL}/api/file/image/view/${fileInfo.fileId}`;
        console.log(`Processing image op, index: ${imgIndex}, url: ${url}`);

        op.insert.image = url;
        imgIndex++; // 다음 imgFiles 항목을 사용하기 위해 인덱스 증가
      }
    }
    console.log(delta);
    quill.setContents(delta, 'silent');
    const html = quill.root.innerHTML;
    const images = getImagesFromQuillDelta(quill);
    emit('update:modelValue',html,images)

  } else {
     console.log("No image processing needed (Delta/ops missing or no imgFiles provided).");
  }
}
  const onEditorChange = ({ quill, html, text }) => {
    state._content = html
    const images = getImagesFromQuillDelta(quill);
    emit('update:modelValue',html,images)
  }

  

</script>
<style scoped>
.ql-container.ql-snow {
  border-style: none !important; /* 기본적으로 있는 border 지정. */
  height: 400px;
}
</style>
