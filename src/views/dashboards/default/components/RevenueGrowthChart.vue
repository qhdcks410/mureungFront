<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import request from '@/api/request';
import type { AxiosResponse } from 'axios';

// 1. 카테고리 데이터를 먼저 선언
const categories123 = ref(['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']);

// 2. 시리즈 데이터 초기화
const series = ref([
  {
    name: '매출',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
]);

// 3. chartOptions에서 categories123.value를 참조하도록 수정
const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  colors: ['#673ab7'],
  plotOptions: {
    bar: { horizontal: false, columnWidth: '20%', borderRadius: 4 },
  },
  dataLabels: { enabled: false },
  xaxis: {
    // 중요: .value를 반드시 붙여야 반응성이 작동합니다.
    categories: categories123.value, 
  },
  yaxis: {
    title: { text: '매출액 (만원)' }
  },
  tooltip: {
    y: { formatter: (val: number) => `₩ ${val.toLocaleString()} 만원` }
  }
}));

const loadChartData = async () => {
  try {
    // async/await 방식으로 통일
    const response = await request.post('/api/dashBoard/getDashBoardGraphList');
    
    if (response.data) {
      const categories = response.data.map((i: any) => i.dt);
      const totalAmts = response.data.map((i: any) => i.totalAmt);

      // 데이터 할당
      categories123.value = categories;
      series.value = [{
          name: "일별 매출",  
          data: totalAmts
      }];
    }
  } catch (e) {
    console.error('Stats load failed', e);
  }
};

onMounted(() => {
  loadChartData();
});
</script>

<template>
  <UiParentCard title="매출 분석 현황">
    <template v-slot:action></template>
    
    <div class="mt-4">
      <div class="d-flex align-center mb-5">
        <div>
          <h6 class="text-subtitle-1 text-grey-darken-1 mb-1">달별 매출액 합계</h6>
          <h3 class="text-h4 font-weight-bold">₩ 8,250,000</h3>
        </div>
        <v-chip color="success" size="small" class="ml-3">+12.5%</v-chip>
      </div>
      
      <!-- 차트 영역 -->
      <apexchart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </UiParentCard>
</template>
