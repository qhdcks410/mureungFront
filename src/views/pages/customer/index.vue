<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import request from '@/api/request';
import type { AxiosResponse } from 'axios';
import Dialogs from '@/components/apps/Dialogs.vue';
import Editor from '@/components/apps/Editor.vue';

 const rowData = ref();
 const isActive = ref(false);
 const isRegiter = ref(false);
 const connValue = ref();

 const search = reactive({
      valid: false,
      orderNo: '',
      ordDate: '',
      cusNm: '',
    }
 )

 const items = [
    { lable:'카카오', value :  'A'},
    { lable:'네이버플레이스', value :  'B'},
    { lable:'직접', value :  'C'}
  ]

 const saveItem = reactive({
      orderNo: '',
      prodNm: '',
      compYn: '',
      conDate: '',
      ordDate: '',
      cusChnnel: 'A',
      cusNm: '',
      cusPhone: '',
      conn: '',
      regDate: '',
      regNm: '',
      updDate: '',
      updNm: ''
    }
 )


 const headers = ref([
    { align: 'center', key: 'orderNo', sortable: 'false', title: '주문번호' },
    { align: "center", key: 'compYn',title:'픽업상태'},
    { align: 'center', key: 'conDate', title: '주문일자' },
    { align: 'center', key: 'ordDate', title: '픽업일자'},
    { align: 'center', key: 'cusChnnel', title: '주문채널' },
    { align: 'center', key: 'cusNm', title: '고객명' },
    { align: 'center', key: 'cusPhone', title: '전화번호' },
    { align: 'center', key: 'conn', title: '상담내용', value:"conn" },
    { align: 'center', key: 'regDate', title: '등록일자' },
    { align: 'center', key: 'regNm', title: '등록자' },
    { align: 'center', key: 'updDate', title: '수정일자' },
    { align: 'center', key: 'updNm', title: '수정자' },
    { align: 'center', title: '버튼' ,value:'comp'},
 ] as any[]);

 const getOrerList = () => {

    const param = {
      ...search
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.post('/api/customer/getCustomerList',param).then((response : AxiosResponse<any, any>) => {
      const data = response.data;
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

 const saveOrder = () => {

  const param = {
    ...saveItem
  }  

  request.post('/api/customer/insertCustomer',param).then((response : AxiosResponse<any, any>) => {
      if(response.status == 200){
          alert('등록되었습니다.')
          getOrerList()
          isRegiter.value = false
      }
    });

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
            v-model="search.orderNo"
            label="주문번호"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="search.cusNm"
            label="고객이름"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
        <v-text-field
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

  <v-row justify="end">
    <v-col cols="2" md="2">
      <v-btn @click="showSave">등록</v-btn>&nbsp;&nbsp;
      <v-btn @click="getOrerList">검색</v-btn>
    </v-col>    
  </v-row>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="주문정보">
        <v-data-table
          :headers=headers
          :items=rowData
          items-per-page="10"
          items-per-page-text=""
          filter-mode="every"
          height="500px">
          <template v-slot:item.conn="{item}">
            <td>
              <v-btn @click="handleClickEvent(item)">상세보기</v-btn>
            </td>
          </template>      
          <template v-slot:item.comp="{item}">
            <td v-if="(item as any).compYn == 'N'">
              <v-btn @click="handleCompEvent(item)">픽업완료</v-btn>
            </td>

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
          v-model="saveItem.cusChnnel"
          :items="items"
          item-title="lable"
          item-value="value"
          label="상담채널"
        ></v-select>

        <v-text-field
            v-model="saveItem.cusNm"
            label="고객이름"
        ></v-text-field>

        <v-text-field
            v-model="saveItem.cusPhone"
            label="전화번호"
        ></v-text-field>        

        <v-text-field
            v-model="saveItem.ordDate"
            label="픽업날짜"
            type="date"
        ></v-text-field>    

        <v-text-field
            v-model="saveItem.prodNm"
            label="상품명"
        ></v-text-field>  
        
        <Editor />
        <!-- <v-textarea v-model="saveItem.conn" label="상담내용" rows="20"></v-textarea> -->
      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="isRegiter = false">
          취소
        </v-btn>            
        <v-btn @click="saveOrder">
          확인
        </v-btn>
      </template>
    </v-card>
  </template> 
  </v-dialog>
</template>