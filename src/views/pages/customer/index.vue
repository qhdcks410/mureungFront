<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import request from '@/api/request';
import type { AxiosResponse } from 'axios';
import Dialogs from '@/components/apps/Dialogs.vue';
import QuillEditor from '@/components/apps/QuillEditor.vue';

 const rowData = ref([]);
 const isActive = ref(false);
 const isRegiter = ref(false);
 const isModify = ref(false);
 const connValue = ref();
 const selectedItems = ref([]);
 const searchImageFiles = ref([]);
 const imageFiles = ref([])


const initSearch = {
  valid: false,
  orderNo: '',
  ordDate: '',
  cusNm: '',
  cusPhone:''
}

const search = reactive({...initSearch})

 const cusChnnel = [
    { lable:'선택', value :  ''},
    { lable:'카카오', value :  'C1'},
    { lable:'네이버플레이스', value :  'C2'},
    { lable:'네이버톡톡', value :  'C3'},
    { lable:'전화문자', value :  'C4'},
    { lable:'인스타그램', value :  'C5'}
  ]

const payMd = [
    { lable:'선택', value :  ''},
    { lable:'카드', value :  'P1'},
    { lable:'계좌이체', value :  'P2'},
    { lable:'현금', value :  'P3'},
    { lable:'네이버페이', value :  'P4'}
]

const payNt = [
    { lable:'선택', value :  ''},
    { lable:'완납', value :  'N1'},
    { lable:'예약금', value :  'N2'},
] 

const inintSaveItem = {
      orderNo: '',
      prodNm: '',
      compYn: '',
      conDate: '',
      ordDate: '',
      cusChnnel: '',
      cusNm: '',
      cusPhone: '',
      conn: '',
      regDate: '',
      regNm: '',
      updDate: '',
      updNm: '',
      payMd:'',
		  payNt:'',
			ordAmt:'',
      ordTime:''      
}
const saveItem = reactive({ ...inintSaveItem });

 const headers = ref([
    { align: 'center', key: 'orderNo', sortable: 'false', title: '주문번호', minWidth:'120px'},
    { align: "center", key: 'compYn',title:'픽업상태', minWidth:'120px'},
    { align: 'center', key: 'conDate', title: '주문일자' , minWidth:'200px'},
    { align: 'center', key: 'ordDate', title: '픽업일자', minWidth:'200px'},
    { align: 'center', key: 'ordTime', title: '픽업시간', minWidth:'200px'},
    { align: 'center', key: 'cusChnnel', title: '주문채널' , minWidth:'200px'},
    { align: 'center', key: 'payMd', title: '결제수단', minWidth:'120px'},
    { align: 'center', key: 'payNt', title: '결제여부', minWidth:'120px'},
    { align: 'center', key: 'ordAmt', title: '기타금액', minWidth:'200px'},
    { align: 'center', key: 'cusNm', title: '고객명' , minWidth:'120px'},
    { align: 'center', key: 'cusPhone', title: '전화번호' , minWidth:'150px'},
    { align: 'center', key: 'conn', title: '상담내용', value:"conn" , minWidth:'100px'},
    { align: 'center', key: 'regDate', title: '등록일자' , minWidth:'200px'},
    { align: 'center', key: 'regNm', title: '등록자' , minWidth:'150px'},
    { align: 'center', key: 'updDate', title: '수정일자' , minWidth:'200px'},
    { align: 'center', key: 'updNm', title: '수정자' , minWidth:'150px'}
 ] as any[]);

 const resetSeach = () => {
  Object.assign(search,initSearch);
 }


 const formatCurrency = (value :any) => {
  if (value === null || value === undefined) {
        return '';
      }
      return new Intl.NumberFormat('ko-KR').format(value);
 }

 const getOrerList = () => {

    const param = {
      ...search
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.post('/api/customer/getCustomerList',param).then((response : AxiosResponse<any, any>) => {
      const data = response.data;
      console.log(data)
      const ddd= data.map((item:any) => {
          item.orderNo = Number(item.orderNo)
          return item
      });
      rowData.value = ddd

      console.log('API 응답 데이터:', data);
    if (Array.isArray(data) && data.length > 0) {
        console.log('첫 번째 항목 구조:', data[0]);
        console.log('첫 번째 항목 orderNo 값:', data[0]?.orderNo); // 대소문자, 존재 여부 확인!
        console.log('orderNo 속성 타입:', typeof data[0]?.orderNo); // string? number?
        const orderNos = data.map(item => item.orderNo);
        const uniqueOrderNos = new Set(orderNos);
        console.log('orderNo 고유성:', orderNos.length === uniqueOrderNos.size); // true여야 함!
    } else {
        console.log('API 응답이 배열이 아니거나 비어 있습니다.');
    }

    });

 }

 const handleClickEvent = (item : any) => {
  connValue.value = item.conn
  isActive.value = true
 }

 const handleCompEvent = (item : any) => {
  const param = {
    orderNo : item.orderNo,
    compYn : 'Y'
  }
  request.post('/api/customer/updateCompYn',param).then((response : AxiosResponse<any, any>) => {
      if(response.status == 200){
          alert('처리되었습니다.')
          getOrerList()
      }
    });
 }

 const selectRefFileList = (selectRowData : any) => {

    const param = {
      refNo : selectRowData.orderNo
    }

    request.post('/api/file/selectRefFileList',param).then((response : AxiosResponse<any, any>) => {
      const data = response.data;
      searchImageFiles.value = [...data] as any;
      console.log(selectRowData);
      Object.assign(saveItem, selectRowData)
      isModify.value = true      
    });

  }
 
 const showSave = () => {
  Object.assign(saveItem, inintSaveItem)
  isRegiter.value = true
 }

//  const showModify = ({ item } : any) => {
//   selectRefFileList(item);
//  }

 const setUpdateConn = (html :any,images: any) => {
  saveItem.conn = html;
  imageFiles.value = images;
 }

 //등록
 const saveOrder = () => {
  const param = {
    ...saveItem
  } 

  param.conn = replaceImageUrl(param.conn,"serverUrl");

  // 2. FormData 객체 생성
  const formData = new FormData() as any;

  // 3. FormData에 데이터 추가
  //여러 파일 추가: FileList를 순회하며 동일한 키로 append
  imageFiles.value.forEach((img : any,index : number) => {
      const file = base64toFile(img,`img${index}`);
      formData.append('editorFiles', file, file.name);
    })
  //수정할 파일 
  formData.append('saveData',JSON.stringify(param))

  // FormData 내용 확인 (디버깅용)
  //console.log("FormData 내용:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value); // JSON 데이터는 문자열 형태로 출력됨
  }

  request.post('/api/customer/insertCustomer',formData).then((response : AxiosResponse<any, any>) => {
      if(response.status == 200){
          alert('등록되었습니다.')
          getOrerList()
          isRegiter.value = false
      }
    });

 }

 //수정
 const modifyOrder = () => {

    const param = {
      ...saveItem
    } 
    param.conn = replaceImageUrl(param.conn,"serverUrl");

    // 2. FormData 객체 생성
     const formData = new FormData() as any;

    // 3. FormData에 데이터 추가
    //여러 파일 추가: FileList를 순회하며 동일한 키로 append
    imageFiles.value.forEach((img : any,index : number) => {
       const file = base64toFile(img,`img${index}`);
      formData.append('editorFiles', file, file.name);
    })
    //수정할 파일 
    formData.append('saveData',JSON.stringify(param))

     // FormData 내용 확인 (디버깅용)
    //console.log("FormData 내용:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value); // JSON 데이터는 문자열 형태로 출력됨
    }


    request.post('/api/customer/modifyOrader',formData).then((response : AxiosResponse<any, any>) => {
      if(response.status == 200){
          alert('수정되었습니다.')
          getOrerList()
          isModify.value = false
      }
    });

}

const replaceImageUrl = (htmlString : any, replacementUrl :string) => {
  // 입력값이 유효한지, DOM 환경인지 기본적인 확인
  if (!htmlString || typeof document === 'undefined' || typeof document.createElement !== 'function') {
    console.warn("입력된 HTML 문자열이 비어있거나 DOM 환경이 아닙니다.");
    return htmlString;
  }

  try {
    // 1. 임시 div 요소를 만듭니다.
    const tempDiv = document.createElement('div');

    // 2. HTML 문자열을 임시 요소의 innerHTML로 설정하여 DOM 구조로 파싱합니다.
    tempDiv.innerHTML = htmlString;

    // 3. 'src' 속성이 'data:image/'로 시작하는 모든 <img> 태그를 선택합니다.
    const images = tempDiv.querySelectorAll('img');

    // 4. 선택된 각 이미지에 대해 반복합니다.
    images.forEach(img => {
      // 5. 'src' 속성을 지정된 replacementUrl로 설정합니다.
      img.setAttribute('src', replacementUrl);
    });

    // 6. 변경된 내용이 반영된 HTML 문자열을 반환합니다.
    return tempDiv.innerHTML;

  } catch (error) {
    console.error("HTML 처리 중 오류 발생:", error);
    // 오류 발생 시 원본 HTML을 반환하여 예기치 않은 중단을 방지합니다.
    return htmlString;
  }
}

const base64toFile = (base_data : any, filename : any) => {

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

 const handleSelectionUpdate = (newSelection :any) => {
  selectedItems.value = newSelection; // 상태 업데이트
};

const handleRowClick = ( item : any) => {
    selectRefFileList(item);
  };

//삭제
 const removeOrder = () => {
  const param = [...selectedItems.value]

  if(!confirm('삭제하시겠습니까?')){
    return;
  }

  request.post('/api/customer/deleteOrader',param).then((response : AxiosResponse<any, any>) => {
      if(response.status == 200){
          alert('삭제되었습니다.')
          getOrerList();
      }
    });

 }

 const getLabel = (obj : any,code: any) => {
  return obj.find((i :any) => i.value === code)?.lable ?? '';
 }

 onMounted(async() =>{
  await getOrerList();
 })

</script>
<template>
  <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->

  <v-form>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            variant="outlined"
            color="secondary"            
            v-model="search.cusNm"
            label="고객명"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            variant="outlined"
            color="secondary"          
            v-model="search.cusPhone"
            label="고객전화번호"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
        <v-text-field
            variant="outlined"
            color="secondary"
            v-model="search.ordDate"
            label="픽업날짜"
            type="date"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  <v-row justify="end" class="pa-2 px-4 ma-0">
    <v-col cols="auto">
      <v-btn variant="tonal" color="secondary" class="ml-2" @click="getOrerList">
          <!-- <v-icon left>mdi-plus</v-icon> -->
          검색
      </v-btn>      
      <v-btn variant="tonal" color="secondary" class="ml-2" @click="resetSeach">
          <!-- <v-icon left>mdi-plus</v-icon> -->
          초기화
      </v-btn>        
    </v-col> 
  </v-row>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="주문정보">
        <v-row justify="end" class="pa-2 px-4 ma-0">
            <v-col cols="auto"> 
              <v-btn variant="outlined" class="ml-2" @click="showSave">
                <!-- <v-icon left>mdi-plus</v-icon> -->
                등록
              </v-btn>         
              <v-btn variant="outlined" class="ml-2" @click="removeOrder">
                  <!-- <v-icon left>mdi-download</v-icon> -->
                  삭제
              </v-btn>
            </v-col>
        </v-row>
          <v-data-table
          :headers=headers
          :items=rowData
          :model-value="selectedItems" @update:modelValue="handleSelectionUpdate" item-value="orderNo"
          show-select
          hover
          height="500px">
          <template v-slot:item.orderNo="{item} : any">
            <td>
              <v-btn variant="text" @click="handleRowClick(item)">
                {{ item.orderNo }}            
              </v-btn>
             
            </td>
          </template>          
          <template v-slot:item.cusChnnel="{item}">
            <td>
              <v-btn variant="text">
                {{ getLabel(cusChnnel,(item as any).cusChnnel)}}
              </v-btn>              
            </td>
          </template>
          <template v-slot:item.payNt="{item}">
            <td>
              <v-btn variant="text">
                {{ getLabel(payNt,(item as any).payNt)}}
              </v-btn>
            </td>
          </template>
          <template v-slot:item.payMd="{item}">
            <td>
              <v-btn variant="text">
                {{ getLabel(payMd,(item as any).payMd)}}
              </v-btn>
            </td>
          </template>                              
          <template v-slot:item.compYn="{item}">
            <td v-if="(item as any).compYn == 'Y'" style="text-align: center;">
              <v-btn variant="text">
                완료
              </v-btn>
            </td>
            <td v-else>
              <v-btn variant="outlined" color="secondary" @click="handleCompEvent(item)">픽업완료</v-btn>
            </td>
          </template>         
          <template v-slot:item.conn="{item}">
            <td>
              <v-btn variant="outlined" color="secondary" @click="handleClickEvent(item)">상세보기</v-btn>
            </td>
          </template> 
          <template v-slot:item.ordAmt="{ item }">
              {{ formatCurrency((item as any).ordAmt) }}
          </template>                        
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
  <Dialogs v-model="isActive" :conn-value="connValue" />
  <v-dialog v-model="isRegiter" max-width="800" >
    <template v-slot:default>
      <v-card title="주문등록">
      <template v-slot:text>

        <v-select
          variant="outlined"
          color="secondary"         
          v-model="saveItem.cusChnnel"
          :items="cusChnnel"
          item-title="lable"
          item-value="value"
          label="상담채널"
        ></v-select>

        <v-select
          variant="outlined"
          color="secondary"         
          v-model="saveItem.payMd"
          :items="payMd"
          item-title="lable"
          item-value="value"
          label="결제수단"
        ></v-select>     
        
        <v-select
          variant="outlined"
          color="secondary"         
          v-model="saveItem.payNt"
          :items="payNt"
          item-title="lable"
          item-value="value"
          label="결제방법"
        ></v-select>
        
        <v-text-field
          variant="outlined"
          color="secondary"         
          v-model="saveItem.ordAmt"
          label="예약금"
          prefix="₩"
          suffix="원"
          mask="#,###"
          type="number"         
        ></v-text-field>       

        <v-text-field
            variant="outlined"
            color="secondary"         
            v-model="saveItem.cusNm"
            label="고객이름"
        ></v-text-field>

        <v-text-field
            variant="outlined"
            color="secondary"         
            v-model="saveItem.cusPhone"
            label="전화번호"
            mask="###-####-####"
        ></v-text-field>        

        <v-text-field
            variant="outlined"
            color="secondary"         
            v-model="saveItem.ordDate"
            label="픽업날짜"
            type="date"
        ></v-text-field>   
        
        <v-text-field
          variant="outlined"
          color="secondary"         
          label="픽업시간"
          v-model="saveItem.ordTime"
          type="text"
        ></v-text-field>        

        <v-text-field
            variant="outlined"
            color="secondary"         
            v-model="saveItem.prodNm"
            label="상품명"
        ></v-text-field>  
        <!-- <Editor  :v-model = "2132323"/> -->
         <!-- <v-textarea v-model="saveItem.conn" label="상담내용" rows="20"></v-textarea> -->

        <QuillEditor v-model:value="saveItem.conn" @update:model-value="setUpdateConn" />

      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="secondary" @click="isRegiter = false">
          취소
        </v-btn>            
        <v-btn variant="outlined" color="secondary" @click="saveOrder">
          확인
        </v-btn>
      </template>
    </v-card>
  </template> 
  </v-dialog>

  <v-dialog v-model="isModify" max-width="800" >
    <template v-slot:default>
      <v-card title="주문등록">
      <template v-slot:text>

        <v-select
          variant="outlined"
          color="secondary"         
          v-model="saveItem.cusChnnel"
          :items="cusChnnel"
          item-title="lable"
          item-value="value"
          label="상담채널"
        ></v-select>

        <v-select
          variant="outlined"
          color="secondary"         
          v-model="saveItem.payMd"
          :items="payMd"
          item-title="lable"
          item-value="value"
          label="결제수단"
        ></v-select>     
        
        <v-select
          variant="outlined"
          color="secondary"         
          v-model="saveItem.payNt"
          :items="payNt"
          item-title="lable"
          item-value="value"
          label="결제방법"
        ></v-select>
        
        <v-text-field
          variant="outlined"
          color="secondary"         
          v-model="saveItem.ordAmt"
          label="예약금"
          prefix="₩"
          suffix="원"
          mask="#,###"
          type="number"         
        ></v-text-field>       
       
        <v-text-field
            variant="outlined"
            color="secondary"         
            v-model="saveItem.ordDate"
            label="픽업날짜"
            type="date"
        ></v-text-field>   
        
        <v-text-field
          variant="outlined"
          color="secondary"         
          label="픽업시간"
          v-model="saveItem.ordTime"
          type="text"
        ></v-text-field>        

        <v-text-field
            variant="outlined"
            color="secondary"         
            v-model="saveItem.prodNm"
            label="상품명"
        ></v-text-field>  
        <!-- <Editor  :v-model = "2132323"/> -->
         <!-- <v-textarea v-model="saveItem.conn" label="상담내용" rows="20"></v-textarea> -->

        <QuillEditor v-model:value="saveItem.conn" :img-files="searchImageFiles" @update:model-value="setUpdateConn" />

      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="secondary" @click="isModify = false">
          취소
        </v-btn>            
        <v-btn variant="outlined" color="secondary" @click="modifyOrder">
          수정
        </v-btn>
      </template>
    </v-card>
  </template> 
  </v-dialog>  
</template>

<style scoped>
.scrollable-table {
  width: 100%; 
  overflow-x:auto;
}
.selected-row-by-checkbox {
  background-color: #C8E6C9 !important; /* 연한 녹색 */
}
</style>
