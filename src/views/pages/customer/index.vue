<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import request from '@/api/request';
import type { AxiosResponse } from 'axios';
import Dialogs from '@/components/apps/Dialogs.vue';
import QuillEditor from '@/components/apps/QuillEditor.vue';

 const rowData = ref();
 const isActive = ref(false);
 const isRegiter = ref(false);
 const connValue = ref();

 const search = reactive({
      valid: false,
      orderNo: '',
      ordDate: '',
      cusNm: '',
      cusPhone:''
    }
 )

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

 const saveItem = reactive({
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
 )

 const headers = ref([
    { align: 'center', key: 'orderNo', sortable: 'false', title: '주문번호', minWidth:'120px'},
    { align: "center", key: 'compYn',title:'픽업상태', minWidth:'120px'},
    { align: 'center', key: 'conDate', title: '주문일자' , minWidth:'200px'},
    { align: 'center', key: 'ordDate', title: '픽업일자', minWidth:'200px'},
    { align: 'center', key: 'payMd', title: '결제수단', minWidth:'120px'},
    { align: 'center', key: 'payNt', title: '결제여부', minWidth:'120px'},
    { align: 'center', key: 'ordAmt', title: '기타금액', minWidth:'200px'},
    { align: 'center', key: 'cusChnnel', title: '주문채널' , minWidth:'200px'},
    { align: 'center', key: 'cusNm', title: '고객명' , minWidth:'120px'},
    { align: 'center', key: 'cusPhone', title: '전화번호' , minWidth:'150px'},
    { align: 'center', key: 'conn', title: '상담내용', value:"conn" , minWidth:'100px'},
    { align: 'center', key: 'regDate', title: '등록일자' , minWidth:'200px'},
    { align: 'center', key: 'regNm', title: '등록자' , minWidth:'150px'},
    { align: 'center', key: 'updDate', title: '수정일자' , minWidth:'200px'},
    { align: 'center', key: 'updNm', title: '수정자' , minWidth:'150px'}
 ] as any[]);


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
      rowData.value = data;
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

 const showSave = () => {
  isRegiter.value = true
 }

 const setUpdateConn = (value :any) => {
  saveItem.conn = value;
 }

 const saveOrder = () => {

  const param = {
    ...saveItem
  }  

  console.log(param)
  request.post('/api/customer/insertCustomer',param).then((response : AxiosResponse<any, any>) => {
      if(response.status == 200){
          alert('등록되었습니다.')
          getOrerList()
          isRegiter.value = false
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
         
        <!-- <v-date-input
          v-model="search.ordData"
          label="Select range"
          multiple="range"
        ></v-date-input> -->
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
      <v-btn variant="tonal" color="secondary" class="ml-2" @click="getOrerList">
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
              <v-btn variant="outlined" class="ml-2">
                  <!-- <v-icon left>mdi-download</v-icon> -->
                  삭제
              </v-btn>
            </v-col>
        </v-row>
          <v-data-table
          variant="outlined"
          color="secondary"            
          :headers=headers
          :items=rowData
          items-per-page="10"
          items-per-page-text=""
          show-select
          :fixed-header="true"
          hover
          class="scrollable-table"
          height="500px">
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
</template>

<style scoped>
.scrollable-table {
  width: 100%; 
  overflow-x:auto;
}
</style>
