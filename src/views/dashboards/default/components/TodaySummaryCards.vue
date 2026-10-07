<script setup lang="ts">
import { ref, onMounted } from 'vue';
import request from '@/api/request';

// 상태 관리
const stats = ref({
  todOrdCnt: 0,
  pickCnt: 0,
  todAmt: 0,
  deQy: 0,
});

const loadStats = async () => {
  try {
    const response = await request.post('/api/dashBoard/getDashBoardList');
    if (response.data && response.data.length > 0) {
      const data = response.data[0];
      stats.value.todOrdCnt = data.todOrdCnt || 0;
      stats.value.pickCnt = data.pickCnt || 0;
      stats.value.todAmt = data.todAmt || 0;
      stats.value.deQy = data.deQy || 0;
    }
  } catch (e) {
    console.error('Stats load failed', e);
  }
};

onMounted(() => loadStats());
</script>

<template>
  <v-row>
    <!-- 오늘 주문 건수 -->
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="0" class="with-border bg-primary overflow-hidden bubble-shape shadow-modern rounded-lg">
        <v-card-text class="pa-5">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-white text-h6 opacity-80 mb-1">오늘 주문</p>
              <h2 class="text-white text-h3 font-weight-bold">{{ stats.todOrdCnt.toLocaleString() }}건</h2>
            </div>
            <v-avatar size="48" color="white" class="opacity-20 rounded-md">
              <v-icon icon="$accountSearch" size="28" color="primary" />
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- 픽업 대기 -->
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="0" class="with-border bg-secondary overflow-hidden bubble-shape shadow-modern rounded-lg">
        <v-card-text class="pa-5">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-white text-h6 opacity-80 mb-1">픽업 대기</p>
              <h2 class="text-white text-h3 font-weight-bold">{{ stats.pickCnt.toLocaleString() }}건</h2>
            </div>
            <v-avatar size="48" color="white" class="opacity-20 rounded-md">
              <v-icon icon="$calendarClock" size="28" color="secondary" />
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- 당일 매출 -->
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="0" class="with-border bg-success overflow-hidden bubble-shape shadow-modern rounded-lg">
        <v-card-text class="pa-5 text-white">
          <p class="text-h6 opacity-80 mb-1">당일 매출</p>
          <div class="d-flex align-end">
            <h2 class="text-h3 font-weight-bold">₩{{ stats.todAmt.toLocaleString() }}</h2>
            <span class="text-caption ml-2 mb-1 opacity-70">예약금 합계</span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- 배송 수량 -->
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="0" class="with-border bg-info overflow-hidden bubble-shape shadow-modern rounded-lg">
        <v-card-text class="pa-5 text-white">
          <p class="text-h6 opacity-80 mb-1">배송 수량</p>
          <h2 class="text-h3 font-weight-bold">{{ stats.deQy.toLocaleString() }}건</h2>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
/* 전역 bubble-shape 클래스 사용으로 컴포넌트 내 스타일 제거 */
</style>
