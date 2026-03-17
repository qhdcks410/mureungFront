<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/api/request';
import { ChevronRightIcon, CheckIcon, PhoneIcon, ClockIcon, CashIcon, Receipt2Icon } from 'vue-tabler-icons';

/**
 * 1. 상태 관리 (State)
 */
const router = useRouter();
const allOrders = ref<any[]>([]); 
const displayOrders = ref<any[]>([]); 
const initialLoading = ref(true);
const loadingMore = ref(false);
const page = ref(1);
const itemsPerPage = 5; 

// 오늘 날짜 (YYYY-MM-DD)
const todayStr = new Date().toLocaleDateString('en-CA');

/**
 * 2. 데이터 로드 (API)
 */
const loadRecentOrders = async () => {
  initialLoading.value = true;
  try {
    const res = await request.post('/api/customer/getOrderList', {});
    
    if (res.data) {
      allOrders.value = res.data
        .filter((item: any) => item.ordDate?.replace(/[^0-9]/g, '').includes(todayStr.replace(/[^0-9]/g, '')))
        .sort((a: any, b: any) => {
          // [1순위] compYn 정렬: 'N'이 'Y'보다 먼저 오도록 (오름차순)
          if (a.compYn !== b.compYn) {
            return a.compYn === 'N' ? -1 : 1;
          }
          // [2순위] 시간 정렬: 시간 정보가 있을 경우 이른 시간 우선
          if (a.ordTime && b.ordTime) return a.ordTime.localeCompare(b.ordTime);
          return new Date(b.ordDate).getTime() - new Date(a.ordDate).getTime();
        });
    }
    page.value = 1; 
    updateDisplay();
  } catch (e) {
    console.error('주문 로드 실패', e);
  } finally {
    initialLoading.value = false;
  }
};

const updateDisplay = () => {
  displayOrders.value = allOrders.value.slice(0, page.value * itemsPerPage);
};

const loadMore = () => {
  loadingMore.value = true;
  setTimeout(() => {
    page.value++;
    updateDisplay();
    loadingMore.value = false;
  }, 500);
};

/**
 * 3. 이벤트 핸들러
 */
const handleScroll = (e: any) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    if (displayOrders.value.length < allOrders.value.length && !loadingMore.value) {
      loadMore();
    }
  }
};

const emit = defineEmits(['refresh']);

const completePickup = async (item: any) => {
  try {
    const res = await request.post('/api/customer/updateCompYn', {
      orderNo: item.orderNo,
      cusPhone: item.cusPhone,
      ordDate: item.ordDate,
      compYn: 'Y'
    });
    if (res.status === 200) emit('refresh');
  } catch (e) {
    console.error('픽업 처리 오류:', e);
  }
};

const goToDetail = (order: any) => {
  router.push({ 
    path: '/customer', 
    query: { orderNo: order.orderNo, cusPhone: order.cusPhone, ordDate: order.ordDate } 
  });
};

onMounted(() => loadRecentOrders());
</script>

<template>
  <v-card elevation="0" class="with-border bg-surface overflow-hidden d-flex flex-column h-100">
    <v-card-text class="pa-4 d-flex flex-column flex-grow-1 overflow-hidden">
      <!-- 헤더 섹션 -->
      <div class="flex-none mb-5">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="d-flex align-center mb-1">
              <v-chip color="primary" variant="flat" size="x-small" class="mr-2 px-2 font-weight-black">TODAY</v-chip>
              <span class="text-caption text-medium-emphasis font-weight-bold">{{ todayStr }}</span>
            </div>
            <h4 class="text-h4 font-weight-black text-grey-darken-4">실시간 픽업 현황</h4>
          </div>
          <v-avatar color="primary-lighten-5" size="48" class="rounded-xl">
            <ClockIcon size="28" class="text-primary" />
          </v-avatar>
        </div>
      </div>

      <!-- 리스트 영역 -->
      <div class="scroll-container overflow-y-auto pr-1 flex-grow-1" @scroll="handleScroll">
        <div v-if="initialLoading" class="d-flex justify-center py-10">
          <v-progress-circular indeterminate color="primary" size="40" />
        </div>

        <div v-else-if="allOrders.length === 0" class="text-center py-12">
          <v-avatar color="grey-lighten-4" size="80" class="mb-4">
            <Receipt2Icon size="40" class="text-grey-lighten-1" />
          </v-avatar>
          <p class="text-subtitle-1 text-grey-darken-1 font-weight-bold">오늘 예정된 픽업이 없습니다.</p>
        </div>

        <div v-else>
          <div v-for="(item, i) in displayOrders" :key="i" class="mb-4">
            <v-card 
              :class="['order-card rounded-xl border-all shadow-sm', item.compYn === 'Y' ? 'completed-card bg-grey-lighten-5' : 'bg-white']"
              @click="goToDetail(item)"
            >
              <div :class="['card-side-bar', item.compYn === 'Y' ? 'bg-grey-lighten-1' : 'bg-primary']" />

              <v-card-text class="pa-4">
                <!-- 상단: 시간 및 기본정보 -->
                <div class="d-flex align-center mb-3">
                  <div :class="item.compYn === 'Y' ? 'bg-grey-lighten-3 text-grey' : 'bg-primary-lighten-5 text-primary'" class="px-3 py-1 rounded-lg font-weight-black text-h6 mr-3">
                    {{ item.ordTime || '시간미정' }}
                  </div>
                  <div class="flex-grow-1 overflow-hidden">
                    <h4 :class="['text-h6 font-weight-black text-truncate', item.compYn === 'Y' ? 'text-grey text-decoration-line-through' : 'text-grey-darken-4']">
                      {{ item.prodNm || '상품명 없음' }}
                    </h4>
                  </div>
                  <v-chip v-if="item.compYn === 'Y'" color="success" size="small" variant="tonal" class="font-weight-black">완료</v-chip>
                  <v-chip v-else color="primary" size="small" variant="outlined" class="font-weight-black">대기</v-chip>
                </div>

                <v-divider class="mb-3 opacity-50" />

                <!-- 하단: 금액 상세 및 액션 -->
                <div class="d-flex justify-space-between align-end">
                  <div class="d-flex flex-column gap-1">
                    <div class="d-flex align-center text-caption text-grey-darken-1 mb-1">
                      <span class="font-weight-bold text-grey-darken-3 mr-2">{{ item.cusNm || '익명' }}</span>
                      <PhoneIcon size="12" class="mr-1" /> {{ item.cusPhone || '-' }}
                    </div>
                    
                    <!-- 금액 상세 레이아웃 -->
                    <div class="d-flex align-center bg-grey-lighten-5 rounded-lg px-3 py-2 border-all">
                      <div class="text-center px-2">
                        <div class="text-overline text-grey" style="font-size: 8px !important; line-height: 1;">총금액</div>
                        <div class="text-caption font-weight-bold text-grey-darken-2">₩{{ Number(item.ordAmt || 0).toLocaleString() }}</div>
                      </div>
                      <span class="text-grey-lighten-2 mx-1">-</span>
                      <div class="text-center px-2">
                        <div class="text-overline text-grey" style="font-size: 8px !important; line-height: 1;">예치금</div>
                        <div class="text-caption font-weight-bold text-primary">₩{{ Number(item.ordOtherAmt || 0).toLocaleString() }}</div>
                      </div>
                      <span class="text-grey-lighten-2 mx-1">=</span>
                      <div class="text-center px-2 bg-white rounded border-all shadow-sm">
                        <div class="text-overline text-error font-weight-black" style="font-size: 8px !important; line-height: 1;">결제잔금</div>
                        <div class="text-subtitle-1 font-weight-black text-error">₩{{ (Number(item.ordAmt || 0) - Number(item.ordOtherAmt || 0)).toLocaleString() }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="ml-2">
                    <v-btn
                      v-if="item.compYn !== 'Y'"
                      color="success"
                      variant="elevated"
                      rounded="pill"
                      class="pickup-btn px-5 font-weight-black"
                      height="44"
                      elevation="4"
                      @click.stop="completePickup(item)"
                    >
                      <template v-slot:prepend><CheckIcon size="20" stroke-width="3" /></template>
                      픽업완료처리
                    </v-btn>
                    <v-avatar v-else color="success-lighten-5" size="44">
                      <v-icon color="success" size="32">mdi-check-decagram</v-icon>
                    </v-avatar>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
          <div v-if="loadingMore" class="d-flex justify-center py-2">
            <v-progress-circular indeterminate size="24" color="primary" stroke-width="3" />
          </div>
        </div>
      </div>

      <!-- 하단 전체보기 -->
      <div class="flex-none mt-3">
        <v-btn block variant="tonal" color="primary" class="font-weight-black text-subtitle-2 py-7" to="/customer" rounded="xl">
          전체 주문 내역 상세보기
          <template v-slot:append><ChevronRightIcon size="20" /></template>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* 추가적인 미세 조정 스타일 */
.gap-1 { gap: 4px; }
.border-all { border: 1px solid #f0f0f0 !important; }
.shadow-glow { box-shadow: 2px 0 10px rgba(var(--v-theme-primary), 0.2); }
</style>
