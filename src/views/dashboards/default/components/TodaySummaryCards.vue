<script setup lang="ts">
import { ref, onMounted } from 'vue';
import request from '@/api/request';
import type { AxiosResponse } from 'axios';

// 상태 관리
const stats = ref({
  todOrdCnt: 0,
  pickCnt: 0,
  todAmt: 0,
  deQy: 0,
});

const loadStats = async () => {
  try {
    request.post('/api/dashBoard/getDashBoardList').then((response: AxiosResponse) => {
      stats.value.todOrdCnt = response.data[0]?.todOrdCnt
      stats.value.pickCnt = response.data[0]?.pickCnt
      stats.value.todAmt = response.data[0]?.todAmt
    });
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
      <v-card elevation="10" class="bg-primary overflow-hidden bubble-shape">
        <v-card-text class="pa-5">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-white text-h6 opacity-80 mb-1">오늘 주문</p>
              <h2 class="text-white text-h3 font-weight-bold">{{ stats.todOrdCnt.toLocaleString() }}건</h2>
            </div>
            <v-avatar size="54" color="white" class="opacity-20">
              <v-icon icon="$accountSearch" size="32" color="primary" />
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- 픽업 대기 -->
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="bg-secondary overflow-hidden bubble-shape-2">
        <v-card-text class="pa-5">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-white text-h6 opacity-80 mb-1">픽업 대기</p>
              <h2 class="text-white text-h3 font-weight-bold">{{ stats.pickCnt.toLocaleString() }}건</h2>
            </div>
            <v-avatar size="54" color="white" class="opacity-20">
              <v-icon icon="$calendarClock" size="32" color="secondary" />
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- 당일 매출 -->
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="bg-success overflow-hidden">
        <v-card-text class="pa-5 text-white">
          <p class="text-h6 opacity-80 mb-1">당일 매출</p>
          <div class="d-flex align-end">
            <h2 class="text-h3 font-weight-bold">₩{{ stats.todAmt.toLocaleString() }}</h2>
            <span class="text-caption ml-2 mb-1">예약금 합계</span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- 배송 수량 -->
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="bg-info overflow-hidden">
        <v-card-text class="pa-5 text-white">
          <p class="text-h6 opacity-80 mb-1">배송 수량</p>
          <h2 class="text-h3 font-weight-bold">{{ stats.deQy.toLocaleString() }}건</h2>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.bubble-shape {
  position: relative;
}
.bubble-shape::after {
  content: "";
  position: absolute;
  width: 210px;
  height: 210px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -125px;
  right: -15px;
}
.bubble-shape-2::after {
  content: "";
  position: absolute;
  width: 210px;
  height: 210px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -160px;
  right: -130px;
}
</style>
