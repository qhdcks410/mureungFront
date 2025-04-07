<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue';

const headers = [
        {
          title: "번호",
          align: "start",
          sortable: false,
          key: "number",
        },
        { title: "상호명", align: "center", key: "name", sortable: false },
        { title: "아카데미 ID", align: "center", key: "id" },
        { title: "생성자", align: "center", key: "constructor" },
        { title: "최고관리자 계정", align: "center", key: "adminEmail" },
        {
          title: "최초생성일",
          align: "center",
          key: "createdAt",
          sortable: false,
        },
        {
          title: "서비스 이용상태",
          align: "center",
          key: "plan",
          sortable: false,
        },
        {
          title: "멤버 수",
          align: "center",
          key: "memberSize",
          sortable: false,
        },
]
const items = [] as unknown

</script>

<template>
  <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="주문정보">
        <template>
        <DataTable
            style="width: 100%"
            :headers="headers"
            :api="items"
        ></DataTable>
        </template>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
