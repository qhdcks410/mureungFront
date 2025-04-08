<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import request from '@/api/request';
import type { AxiosResponse } from 'axios';
import Dialogs from '@/components/apps/Dialogs.vue';

 const rowData = ref();
 const isActive = ref(false);
 const popValue = ref("sdfsdfdsfsdff");
 const headers = ref([
    { align: 'center', key: 'cusNo', sortable: 'false', title: '주문번호' },
    { align: 'center', key: 'conDate', title: '주문일자' },
    { align: 'center', key: 'ordData', title: '픽업일자'},
    { align: 'center', key: 'cusChnnel', title: '주문채널' },
    { align: 'center', key: 'cusNm', title: '고객명' },
    { align: 'center', key: 'cusPhone', title: '전화번호' },
    { align: 'center', key: 'conn', title: '상담내용' },
    { align: 'center', key: 'regDate', title: '등록일자' },
    { align: 'center', key: 'regNm', title: '등록자' },
    { align: 'center', key: 'updDate', title: '수정일자' },
    { align: 'center', key: 'updNm', title: '수정자' },
 ]);

 const getOrerList = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.post('/api/customer/getCustomerList').then((response : AxiosResponse<any, any>) => {
      const data = response.data;
      rowData.value = data;
    });

    isActive.value = true
 }

 onMounted(async() =>{
  await getOrerList();
 })

 
</script>

<template>
  <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->
  <v-row justify="end">
    <v-col cols="1" md="1">
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
          height="500px"

        ></v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>

  <Dialogs :is-active="isActive" />

  
</template>