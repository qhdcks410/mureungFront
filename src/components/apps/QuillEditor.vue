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

// 이미지 URL -> Base64 변환 함수 (변경 없음)
async function picToBase64(src) {
  return new Promise(async (resolve, reject) => { // reject 추가
    try {
      const response = await fetch(src);
      if (!response.ok) { // 응답 상태 확인
         throw new Error(`HTTP error! status: ${response.status} for ${src}`);
      }
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject; // 에러 처리 추가
      reader.readAsDataURL(blob);
    } catch (error) {
       console.error("Failed to fetch or convert image:", src, error);
       reject(error); // 에러 발생 시 reject 호출
    }
  });
}

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
      if (op.insert && typeof op.insert === 'object' && op.insert.image && imgIndex < props.imgFiles.length) {

        // imgFiles 배열에서 현재 순서에 맞는 파일 ID 사용
        const fileInfo = props.imgFiles[imgIndex];
        if (!fileInfo || !fileInfo.fileId) {
           console.warn(`Skipping image at index ${imgIndex}: Invalid fileInfo or missing fileId.`);
           imgIndex++; // 다음 파일 정보로 넘어감
           continue; // 다음 op로 넘어감
        }

        const url = `${import.meta.env.VITE_API_URL}/api/file/image/view/${fileInfo.fileId}`;
        console.log(`Processing image op, index: ${imgIndex}, url: ${url}`);

        // picToBase64 비동기 함수를 호출하고, 결과(base64)를 받으면
        // 해당 op의 이미지 소스를 업데이트하는 Promise 생성
        const promise = picToBase64(url)
          .then(base64Value => {
            console.log(`Successfully converted image at index ${imgIndex} to Base64`);
            // 중요: op 객체는 참조이므로, 여기서 값을 변경하면 원본 delta 객체에 반영됨
            op.insert.image = base64Value;
          })
          .catch(error => {
            // 에러 발생 시 콘솔에 로그 남기고, 원본 이미지 소스(op.insert.image)는 그대로 둘 수 있음
            // 또는 에러 표시용 이미지 URL로 대체할 수도 있음
            console.error(`Failed to process image at index ${imgIndex} (URL: ${url}):`, error);
            // 예: op.insert.image = '/path/to/error-image.png';
          });

        promises.push(promise); // 생성된 Promise를 배열에 추가
        imgIndex++; // 다음 imgFiles 항목을 사용하기 위해 인덱스 증가
      }
    }

    try {
      // 배열에 담긴 모든 Promise가 완료될 때까지 기다림
      console.log(`Waiting for ${promises.length} image processing promises...`);
      await Promise.all(promises);
      console.log("All image processing finished.");

      // 모든 이미지 처리가 완료된 후, 수정된 delta로 에디터 내용을 업데이트
      // 'silent' 옵션은 이 변경으로 인해 'text-change' 이벤트가 발생하지 않도록 함
      quill.setContents(delta, 'silent');
      console.log("Quill content updated with processed images.");

    } catch (error) {
      // Promise.all 자체에서 발생할 수 있는 에러 (거의 없지만) 또는 개별 Promise 중 하나라도 reject되면 여기로 옴
      console.error("Error during Promise.all execution:", error);
    }

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
