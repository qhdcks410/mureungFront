<script setup lang="ts">
import { ref } from 'vue';
import TodaySummaryCards from './components/TodaySummaryCards.vue';
import RevenueGrowthChart from './components/RevenueGrowthChart.vue';
import RecentOrdersTable from './components/RecentOrdersTable.vue'; 

const refreshKey = ref(0);

/**
 * 대시보드 전체 데이터 리로드
 * refreshKey가 변경되면 :key를 가진 모든 자식 컴포넌트가 
 * 다시 마운트되면서 onMounted(데이터 로드)를 실행합니다.
 */
const refreshDashboard = () => {
  refreshKey.value += 1;
};
</script>

<template>
  <div class="dashboard-main-container">
    <!-- [1] 상단 요약 영역 -->
    <div class="flex-none mb-4">
      <TodaySummaryCards :key="`summary-${refreshKey}`" />
    </div>

    <!-- [2] 메인 차트 및 주문 내역 영역 -->
    <v-row class="flex-grow-1 overflow-hidden" no-gutters>
      <!-- 차트 영역 -->
      <v-col cols="12" md="6" class="pa-2 d-flex flex-column h-100">
        <RevenueGrowthChart :key="`chart-${refreshKey}`" class="flex-grow-1" />
      </v-col>

      <!-- 주문 내역 리스트 (여기서 refresh 이벤트를 보냄) -->
      <v-col cols="12" md="6" class="pa-2 d-flex flex-column h-100">
        <RecentOrdersTable 
          :key="`table-${refreshKey}`" 
          @refresh="refreshDashboard" 
          class="flex-grow-1" 
        />
      </v-col>
    </v-row>
  </div>
</template>
