<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/api/request';
import { ChevronRightIcon } from 'vue-tabler-icons';

const router = useRouter();
const orders = ref([]);

const loadRecentOrders = async () => {
  try {
    const res = await request.post('/api/customer/getCustomerList', {});
    orders.value = res.data.slice(0, 6);
  } catch (e) {
    console.error(e);
  }
};

const goToDetail = (order: any) => {
  router.push({ 
    path: '/customer', 
    query: { 
      orderNo: order.orderNo,
      cusPhone: order.cusPhone,
      ordDate: order.ordDate
    } 
  });
};

onMounted(() => loadRecentOrders());
</script>

<template>
  <v-card elevation="10" class="with-border">
    <v-card-text class="pa-5">
      <div class="d-flex align-center justify-space-between mb-5">
        <h4 class="text-h5 font-weight-bold">최근 주문 내역</h4>
      </div>
      
      <v-list class="pa-0">
        <v-list-item
          v-for="(order, i) in orders"
          :key="i"
          class="px-0 mb-3 cursor-pointer"
          @click="goToDetail(order)"
        >
          <template v-slot:prepend>
            <v-avatar color="lightprimary" class="mr-3" size="40">
              <span class="text-primary font-weight-bold">{{ order.cusNm.substring(0,1) }}</span>
            </v-avatar>
          </template>
          
          <v-list-item-title class="font-weight-bold text-body-1">
            {{ order.prodNm }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ order.cusNm }} | {{ order.ordDate }}
          </v-list-item-subtitle>
          
          <template v-slot:append>
            <div class="text-right">
              <div class="text-body-2 font-weight-bold">₩{{ Number(order.ordAmt).toLocaleString() }}</div>
              <v-chip
                :color="order.compYn === 'Y' ? 'success' : 'warning'"
                size="x-small"
                variant="flat"
                class="mt-1"
              >
                {{ order.compYn === 'Y' ? '완료' : '대기' }}
              </v-chip>
            </div>
          </template>
        </v-list-item>
      </v-list>
      
      <v-btn block variant="tonal" color="primary" class="mt-4" to="/customer">
        전체 보기
        <template v-slot:append>
          <ChevronRightIcon size="18" />
        </template>
      </v-btn>
    </v-card-text>
  </v-card>
</template>
