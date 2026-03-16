<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import request from '@/api/request';
import type { AxiosResponse } from 'axios';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'selected']);

// 상태 관리
const tab = ref(0); // 0: 검색, 1: 직접입력
const customerList = ref([]);
const loading = ref(false);
const customerSearch = ref('');

// 신규 직접 입력용 상태
const newName = ref('');
const newPhone = ref('');

// 전화번호 포맷터 (내부용)
const formatPhone = (val: string) => {
  if (!val) return '';
  const num = val.replace(/[^\d]/g, '');
  if (num.length <= 3) return num;
  if (num.length <= 6) return `${num.slice(0, 3)}-${num.slice(3)}`;
  if (num.length <= 10) {
    if (num.startsWith('02')) return `${num.slice(0, 2)}-${num.slice(2, 6)}-${num.slice(6)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
  }
  if (num.startsWith('02')) return `${num.slice(0, 2)}-${num.slice(2, 6)}-${num.slice(6, 10)}`;
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
};

// 신규 입력 전화번호 자동 포맷팅 감시
watch(newPhone, (val) => {
  newPhone.value = formatPhone(val);
});

// 고객 목록 조회 API
const getMemberList = () => {
  loading.value = true;
  request.post('/api/customer/getCustomerList', {}).then((res: AxiosResponse) => {
    customerList.value = res.data;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

// 팝업 초기화
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    getMemberList();
    customerSearch.value = '';
    newName.value = '';
    newPhone.value = '';
    tab.value = 0;
  }
});

const uniqueCustomers = computed(() => {
  const seen = new Set();
  const searchStr = customerSearch.value.trim().toLowerCase();
  
  return customerList.value
    .filter((item: any) => {
      const phone = item.cusPhone || '';
      const duplicate = seen.has(phone);
      seen.add(phone);
      return !duplicate;
    })
    .filter((item: any) => 
      (item.cusNm || '').toLowerCase().includes(searchStr) || 
      (item.cusPhone || '').includes(searchStr)
    );
});

const selectCustomer = (customer: any) => {
  emit('selected', customer);
  closePopup();
};

const selectTypedCustomer = () => {
  if (!newName.value) {
    alert('이름을 입력해주세요.');
    return;
  }
  emit('selected', { cusNm: newName.value, cusPhone: newPhone.value.replace(/[^\d]/g, '') });
  closePopup();
};

const closeDialog = (val: boolean) => {
  emit('update:modelValue', val);
};

const closePopup = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <v-dialog :model-value="props.modelValue" @update:modelValue="closeDialog" max-width="450" scrollable>
    <v-card class="customer-popup-card">
      <v-card-title class="pa-5 d-flex justify-space-between align-center border-bottom bg-white">
        <div>
          <span class="text-h6 font-weight-black text-grey-darken-4">고객 정보 입력</span>
          <div class="text-caption text-grey">검색하거나 신규 정보를 입력해주세요</div>
        </div>
        <v-btn variant="flat" color="grey-lighten-4" icon size="32" @click="closePopup">
          <v-icon icon="mdi-close" size="20" color="grey-darken-2" />
        </v-btn>
      </v-card-title>

      <!-- 탭 메뉴 -->
      <v-tabs v-model="tab" color="primary" grow>
        <v-tab :value="0">기존 고객 검색</v-tab>
        <v-tab :value="1">신규 직접 입력</v-tab>
      </v-tabs>
      
      <v-window v-model="tab">
        <!-- [탭 0] 기존 고객 검색 -->
        <v-window-item :value="0">
          <v-card-text class="pa-0 bg-grey-lighten-5">
            <!-- 검색바 영역 (상단 고정 느낌) -->
            <div class="pa-4 pb-2">
              <v-text-field
                v-model="customerSearch"
                placeholder="이름 또는 전화번호 검색"
                variant="solo"
                flat
                hide-details
                prepend-inner-icon="mdi-magnify"
                rounded="xl"
                class="search-bar"
              />
            </div>

            <!-- 스크롤 영역: 카드 3개(약 280px) 초과 시 스크롤 발생 -->
            <div class="customer-scroll-area px-4 pb-4">
              <v-list class="bg-transparent pa-0">
                <v-list-item
                  v-for="(customer, index) in uniqueCustomers"
                  :key="index"
                  class="customer-item mb-3"
                  @click="selectCustomer(customer)"
                >
                  <template v-slot:prepend>
                    <div class="avatar-box mr-4">
                      <v-icon icon="mdi-account" color="primary" />
                    </div>
                  </template>
                  <v-list-item-title class="text-body-1 font-weight-bold text-grey-darken-4">
                    {{ customer.cusNm }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-2 text-primary mt-1 font-weight-medium">
                    {{ formatPhone(customer.cusPhone) }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-icon icon="mdi-chevron-right" size="small" color="grey-lighten-1" />
                  </template>
                </v-list-item>

                <!-- 검색 결과 없음 -->
                <div v-if="uniqueCustomers.length === 0" class="empty-state pa-10 text-center">
                  <v-icon icon="mdi-account-search-outline" size="64" color="grey-lighten-2" class="mb-3" />
                  <div class="text-body-1 text-grey-darken-1 font-weight-medium">일치하는 고객이 없습니다.</div>
                </div>
              </v-list>
            </div>
          </v-card-text>
        </v-window-item>

        <!-- [탭 1] 신규 직접 입력 -->
        <v-window-item :value="1">
          <v-card-text class="pa-6 bg-white">
            <div class="text-subtitle-1 font-weight-bold mb-4">새로운 고객 정보를 입력하세요</div>
            
            <v-text-field
              v-model="newName"
              label="고객명"
              variant="outlined"
              color="primary"
              class="mb-4"
              prepend-inner-icon="mdi-account-outline"
              hide-details
            />
            
            <v-text-field
              v-model="newPhone"
              label="전화번호"
              variant="outlined"
              color="primary"
              placeholder="010-0000-0000"
              class="mb-6"
              prepend-inner-icon="mdi-phone-outline"
              hide-details
            />

            <v-btn
              block
              color="primary"
              size="large"
              rounded="xl"
              elevation="2"
              height="56"
              class="text-h6 font-weight-bold"
              @click="selectTypedCustomer"
            >
              입력 정보로 선택하기
            </v-btn>

            <div class="mt-4 text-center text-caption text-grey">
              입력하신 정보가 등록 화면에 자동으로 채워집니다.
            </div>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.customer-popup-card {
  border-radius: 24px !important;
}

.border-bottom {
  border-bottom: 1px solid #f0f0f0;
}

/* 스크롤 핵심 스타일: 카드 약 3.5개 높이로 제한 */
.customer-scroll-area {
  max-height: 320px;
  overflow-y: auto;
}

/* 스크롤바 디자인 슬림화 */
.customer-scroll-area::-webkit-scrollbar {
  width: 4px;
}
.customer-scroll-area::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 10px;
}

.search-bar :deep(.v-field) {
  background-color: white !important;
  border: 1px solid #eeeeee !important;
}

.customer-item {
  background-color: white !important;
  border-radius: 16px !important;
  border: 1px solid #f0f0f0 !important;
  transition: all 0.2s ease;
  padding: 12px 16px !important;
  min-height: 80px;
}

.customer-item:active {
  transform: scale(0.98);
  background-color: #f5f5f5 !important;
}

.avatar-box {
  width: 44px;
  height: 44px;
  background-color: #e3f2fd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
