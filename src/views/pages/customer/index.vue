<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { AgGridVue } from "ag-grid-vue3";

 // Row Data: The data to be displayed.

 const rowData = ref([
   { make: "Tesla", model: "Model Y", price: 64950, electric: true },
   { make: "Ford", model: "F-Series", price: 33850, electric: false },
   { make: "Toyota", model: "Corolla", price: 29600, electric: false },
   { make: "Toyota", model: "Corolla", price: 29600, electric: false },
   { make: "Toyota", model: "Corolla", price: 29600, electric: false },
   { make: "Toyota", model: "Corolla", price: 29600, electric: false },
 ]);

 // Column Definitions: Defines the columns to be displayed.
 const colDefs = ref([
   { field: "주문번호" },
   { field: "주문일자" },
   { field: "픽업일자" },
   { field: "주문채널" },
   { field: "고객명" },
   { field: "전화번호" },
   { field: "상담내용" },
 ]);

 
</script>

<template>
  <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="주문정보">
          <AgGridVue
            :rowData="rowData"
            :columnDefs="colDefs"
            style="height: 500px"
            :pagination="true"
          >
          </AgGridVue>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
