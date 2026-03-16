<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 개편된 비즈니스 컴포넌트 임포트
import TodaySummaryCards from './components/TodaySummaryCards.vue';
import RevenueGrowthChart from './components/RevenueGrowthChart.vue';
import RecentOrdersTable from './components/RecentOrdersTable.vue'; // 기존 PopularStocks 대체 가능

</script>

<template>
  <v-row>
    <!-- [1] 상단 요약 영역: 오늘 주문, 픽업, 배송 현황 -->
    <v-col cols="12">
      <TodaySummaryCards />
    </v-col>

    <!-- [2] 메인 차트 영역: 매출 분석 (당일/월별) -->
    <v-col cols="12" md="8">
      <RevenueGrowthChart />
    </v-col>

    <!-- [3] 사이드 영역: 최근 주문 또는 주요 알림 -->
    <v-col cols="12" md="4">
      <RecentOrdersTable title="최근 주문 내역" />
    </v-col>
  </v-row>
</template>
