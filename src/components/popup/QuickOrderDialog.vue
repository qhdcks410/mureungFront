<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import request from '@/api/request';
import QuillEditor from '@/components/apps/QuillEditor.vue';
import CustomerPopup from '@/components/popup/CustomerPopup.vue';

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue', 'success']);

/**
 * 1. 상태 관리
 */
const loading = ref(false);
const isCustomerPopup = ref(false);
const hourPart = ref('09');
const minPart = ref('00');
const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

// 로컬 시간 기준 오늘 날짜 구하기 (YYYY-MM-DD)
const getTodayDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const inintSaveItem = {
  orderNo: '',
  prodNm: '',
  compYn: 'N',
  conDate: '',
  ordDate: getTodayDate(),
  cusChnnel: '',
  cusNm: '',
  cusPhone: '',
  conn: '',
  payMd: '',
  payNt: '',
  ordAmt: '',
  ordOtherAmt: '',
  ordTime: ''
};
const saveItem = reactive({ ...inintSaveItem });
const imageFiles = ref([]);

/**
 * 2. 상수 데이터
 */
const cusChnnel = [
  { lable: '선택', value: '' },
  { lable: '카카오', value: 'C1' },
  { lable: '네이버플레이스', value: 'C2' },
  { lable: '네이버톡톡', value: 'C3' },
  { lable: '전화문자', value: 'C4' },
  { lable: '인스타그램', value: 'C5' }
];
const payMd = [
  { lable: '선택', value: '' },
  { lable: '카드', value: 'P1' },
  { lable: '계좌이체', value: 'P2' },
  { lable: '현금', value: 'P3' },
  { lable: '네이버페이', value: 'P4' }
];
const payNt = [
  { lable: '선택', value: '' },
  { lable: '완납', value: 'N1' },
  { lable: '예약금', value: 'N2' }
];

/**
 * 3. 계산된 속성 및 유틸리티
 */
const formatCurrency = (val: any) => (val ? new Intl.NumberFormat('ko-KR').format(val) : '');
const formatPhone = (val: string) => {
  if (!val) return '';
  const num = val.replace(/[^\d]/g, '');
  if (num.length <= 3) return num;
  if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
};

const formattedAmt = computed({
  get: () => formatCurrency(saveItem.ordAmt),
  set: (val) => { saveItem.ordAmt = val.replace(/[^\d]/g, ''); }
});
const formattedOtherAmt = computed({
  get: () => formatCurrency(saveItem.ordOtherAmt),
  set: (val) => { saveItem.ordOtherAmt = val.replace(/[^\d]/g, ''); }
});

const selectCustomer = (customer: any) => {
  saveItem.cusNm = customer.cusNm;
  saveItem.cusPhone = customer.cusPhone;
};

/**
 * 4. 액션 처리
 */
const close = () => emit('update:modelValue', false);

const replaceImageUrl = (html: string, url: string) => {
  if (!html || typeof document === 'undefined') return html;
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('img').forEach((img) => img.setAttribute('src', url));
  return div.innerHTML;
};

const saveOrder = async () => {
  const requiredFields = [
    { key: 'cusChnnel', label: '상담채널' },
    { key: 'payMd', label: '결제수단' },
    { key: 'payNt', label: '결제방법' },
    { key: 'cusNm', label: '고객이름' },
    { key: 'ordDate', label: '픽업날짜' },
    { key: 'prodNm', label: '상품명' }
  ];

  for (const field of requiredFields) {
    if (!saveItem[field.key as keyof typeof saveItem]) {
      alert(`${field.label}을(를) 입력해주세요.`);
      return;
    }
  }

  const totalAmt = Number(saveItem.ordAmt || 0);
  const depositAmt = Number(saveItem.ordOtherAmt || 0);
  if (depositAmt > totalAmt) {
    alert('예치금이 총 금액보다 클 수 없습니다. 금액을 다시 확인해주세요.');
    return;
  }

  loading.value = true;
  saveItem.ordTime = `${hourPart.value}:${minPart.value}`;
  
  const fd = new FormData();
  imageFiles.value.forEach((img: any, idx: number) => {
    fd.append('editorFiles', base64toFile(img, `img${idx}`));
  });

  // 이미지 URL 치환 처리
  const processedData = { 
    ...saveItem, 
    conn: replaceImageUrl(saveItem.conn, 'serverUrl') 
  };
  fd.append('saveData', JSON.stringify(processedData));

  try {
    const res = await request.post('/api/customer/insertCustomer', fd);
    if (res.status === 200) {
      alert('등록되었습니다.');
      emit('success');
      close();
    }
  } catch (e) {
    console.error(e);
    alert('등록 중 오류가 발생했습니다.');
  } finally {
    loading.value = false;
  }
};

const base64toFile = (base64: string, filename: string) => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
};

const setUpdateConn = (html: any, images: any) => {
  saveItem.conn = html;
  imageFiles.value = images;
};

watch(() => props.modelValue, (val) => {
  if (val) {
    Object.assign(saveItem, inintSaveItem);
    hourPart.value = '09';
    minPart.value = '00';
  }
});
</script>

<template>
  <v-dialog :model-value="modelValue" @update:modelValue="close" max-width="800" scrollable>
    <v-card class="rounded-xl overflow-hidden">
      <v-card-title class="pa-5 d-flex justify-space-between align-center bg-primary text-white">
        <span class="text-h5 font-weight-black">상세 주문 등록</span>
        <v-btn icon color="white" variant="text" @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" sm="4">
            <v-select v-model="saveItem.cusChnnel" :items="cusChnnel" item-title="lable" item-value="value" label="상담채널 *" variant="outlined" color="primary" density="comfortable" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select v-model="saveItem.payMd" :items="payMd" item-title="lable" item-value="value" label="결제수단 *" variant="outlined" color="primary" density="comfortable" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select v-model="saveItem.payNt" :items="payNt" item-title="lable" item-value="value" label="결제방법 *" variant="outlined" color="primary" density="comfortable" />
          </v-col>
          
          <v-col cols="12" sm="6">
            <v-text-field v-model="formattedOtherAmt" label="예약금" prefix="₩" variant="outlined" color="primary" density="comfortable" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="formattedAmt" label="금액" prefix="₩" variant="outlined" color="primary" density="comfortable" />
          </v-col>

          <v-col cols="12">
            <v-label class="text-subtitle-2 mb-2 font-weight-bold">고객 정보 *</v-label>
            <v-btn block variant="outlined" color="primary" height="56" class="justify-start px-4" @click="isCustomerPopup = true">
              <v-icon start icon="mdi-account-search" />
              <div v-if="saveItem.cusNm" class="text-left">
                <div class="text-body-1 font-weight-bold">{{ saveItem.cusNm }} ({{ formatPhone(saveItem.cusPhone) }})</div>
              </div>
              <span v-else>고객을 선택하거나 직접 입력하세요</span>
            </v-btn>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field v-model="saveItem.ordDate" label="픽업날짜 *" type="date" variant="outlined" color="primary" density="comfortable" />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="d-flex gap-2">
              <v-select v-model="hourPart" :items="hourOptions" label="시 *" variant="outlined" color="primary" density="comfortable" suffix="시" />
              <v-select v-model="minPart" :items="minOptions" label="분 *" variant="outlined" color="primary" density="comfortable" suffix="분" />
            </div>
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="saveItem.prodNm" label="상품명 *" placeholder="상품명을 입력하세요" variant="outlined" color="primary" density="comfortable" />
          </v-col>

          <v-col cols="12">
            <v-label class="text-subtitle-2 mb-2 font-weight-bold">상담 내용 및 이미지</v-label>
            <QuillEditor v-model:value="saveItem.conn" @update:model-value="setUpdateConn" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-5">
        <v-spacer />
        <v-btn variant="text" color="grey" @click="close" class="px-6">취소</v-btn>
        <v-btn variant="elevated" color="primary" @click="saveOrder" :loading="loading" class="px-10 font-weight-black" rounded="pill">주문 저장하기</v-btn>
      </v-card-actions>
    </v-card>

    <CustomerPopup v-model="isCustomerPopup" @selected="selectCustomer" />
  </v-dialog>
</template>
