<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useRoute } from 'vue-router';
import type { AxiosResponse } from 'axios';
import request from '@/api/request';

// 컴포넌트 임포트
import UiParentCard from '@/components/shared/UiParentCard.vue';
import Dialogs from '@/components/apps/Dialogs.vue';
import QuillEditor from '@/components/apps/QuillEditor.vue';
import CustomerPopup from '@/components/popup/CustomerPopup.vue';
import QuickOrderDialog from '@/components/popup/QuickOrderDialog.vue';

/**
 * 1. 상태 관리 (State)
 */
const { mobile } = useDisplay();
const route = useRoute();
const rowData = ref([]);
const selectedItems = ref([]);
const displayCount = ref(10); // 모바일 무한 스크롤 초기 개수

// 다이얼로그 제어
const isActive = ref(false);    // 상세 팝업
const isRegiter = ref(false);   // 등록 팝업 (QuickOrderDialog와 연결)
const isModify = ref(false);    // 수정 팝업 (기존 상세 수정 다이얼로그)
const isCustomerPopup = ref(false); // 고객 선택 팝업

const selectCustomer = (customer: any) => {
  saveItem.cusNm = customer.cusNm;
  saveItem.cusPhone = customer.cusPhone;
};

// 시간 선택용 상태
const hourPart = ref('00');
const minPart = ref('00');
const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

// 상세/편집 데이터
const connValue = ref('');
const searchImageFiles = ref([]);
const imageFiles = ref([]);

// 예약금 콤마용 상태
const formattedAmt = computed({
  get: () => formatCurrency(saveItem.ordAmt),
  set: (val) => {
    const num = val.replace(/[^\d]/g, '');
    saveItem.ordAmt = num;
  }
});

// 금액 콤마용 상태
const formattedOtherAmt = computed({
  get: () => formatCurrency(saveItem.ordOtherAmt),
  set: (val) => {
    const num = val.replace(/[^\d]/g, '');
    saveItem.ordOtherAmt = num;
  }
});

// 전화번호 하이픈용 상태
const formattedPhone = computed({
  get: () => formatPhone(saveItem.cusPhone),
  set: (val) => {
    const num = val.replace(/[^\d]/g, '');
    saveItem.cusPhone = num;
  }
});

// 검색 필드
const initSearch = {
  valid: false,
  orderNo: '',
  ordDate: '',
  cusNm: '',
  cusPhone: ''
};
const search = reactive({ ...initSearch });

// 저장/수정 필드
const inintSaveItem = {
  orderNo: '',
  prodNm: '',
  compYn: '',
  conDate: '',
  ordDate: '',
  cusChnnel: '',
  cusNm: '',
  cusPhone: '',
  conn: '',
  regDate: '',
  regNm: '',
  updDate: '',
  updNm: '',
  payMd: '',
  payNt: '',
  ordAmt: '',
  ordOtherAmt: '',
  ordTime: ''
};
const saveItem = reactive({ ...inintSaveItem });

/**
 * 2. 상수 데이터 (Constants)
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

const allHeaders = ref([
  { align: 'center', key: 'orderNo', sortable: false, title: '주문번호', minWidth: '100px' },
  { align: 'center', key: 'compYn', title: '픽업상태', minWidth: '100px' },
  { align: 'center', key: 'conDate', title: '주문일자', minWidth: '120px' },
  { align: 'center', key: 'ordDate', title: '픽업일자', minWidth: '120px' },
  { align: 'center', key: 'ordTime', title: '픽업시간', minWidth: '100px' },
  { align: 'center', key: 'cusChnnel', title: '주문채널', minWidth: '120px' },
  { align: 'center', key: 'payMd', title: '결제수단', minWidth: '100px' },
  { align: 'center', key: 'payNt', title: '결제여부', minWidth: '100px' },
  { align: 'center', key: 'ordAmt', title: '금액', minWidth: '120px' },
  { align: 'center', key: 'ordOtherAmt', title: '예약금', minWidth: '120px' },
  { align: 'center', key: 'cusNm', title: '고객명', minWidth: '100px' },
  { align: 'center', key: 'cusPhone', title: '전화번호', minWidth: '130px' },
  { align: 'center', key: 'conn', title: '상담내용', value: 'conn', minWidth: '100px' },
  { align: 'center', key: 'regDate', title: '등록일자', minWidth: '150px' },
  { align: 'center', key: 'regNm', title: '등록자', minWidth: '100px' },
  { align: 'center', key: 'updDate', title: '수정일자', minWidth: '150px' },
  { align: 'center', key: 'updNm', title: '수정자', minWidth: '100px' }
]);

/**
 * 3. 계산된 속성 (Computed)
 */
const headers = computed(() => {
  if (mobile.value) {
    return allHeaders.value.filter((h) => ['orderNo', 'cusNm', 'ordDate', 'compYn', 'conn'].includes(h.key));
  }
  return allHeaders.value;
});

const mobileDisplayData = computed(() => {
  return rowData.value.slice(0, displayCount.value);
});

/**
 * 4. 비즈니스 로직 (CRUD & API)
 */
const getOrerList = () => {
  displayCount.value = 10;
  request.post('/api/customer/getOrderList', { ...search }).then((response: AxiosResponse) => {
    rowData.value = response.data.map((item: any) => ({
      ...item,
      orderNo: Number(item.orderNo)
    }));
  });
};

const saveOrder = () => {
  // 필수 입력값 체크 (상담내용 conn 제외)
  const requiredFields = [
    { key: 'cusChnnel', label: '상담채널' },
    { key: 'payMd', label: '결제수단' },
    { key: 'payNt', label: '결제방법' },
    { key: 'ordAmt', label: '금액' },
    { key: 'cusNm', label: '고객이름' },
    { key: 'cusPhone', label: '전화번호' },
    { key: 'ordDate', label: '픽업날짜' },
    { key: 'prodNm', label: '상품명' }
  ];

  for (const field of requiredFields) {
    if (!saveItem[field.key as keyof typeof saveItem]) {
      alert(`${field.label}을(를) 입력해주세요.`);
      return;
    }
  }

  if (!validatePhone(saveItem.cusPhone)) {
    alert('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
    return;
  }
  // 시간/분 합치기
  saveItem.ordTime = `${hourPart.value}:${minPart.value}`;
  
  const formData = createFormData(saveItem);
  request.post('/api/customer/insertCustomer', formData).then((res) => {
    if (res.status === 200) {
      alert('등록되었습니다.');
      getOrerList();
      isRegiter.value = false;
    }
  });
};

const modifyOrder = () => {
  // 필수 입력값 체크 (상담내용 conn 제외)
  const requiredFields = [
    { key: 'cusChnnel', label: '상담채널' },
    { key: 'payMd', label: '결제수단' },
    { key: 'payNt', label: '결제방법' },
    { key: 'ordAmt', label: '금액' },
    { key: 'ordDate', label: '픽업날짜' },
    { key: 'prodNm', label: '상품명' }
  ];

  for (const field of requiredFields) {
    if (!saveItem[field.key as keyof typeof saveItem]) {
      alert(`${field.label}을(를) 입력해주세요.`);
      return;
    }
  }

  if (!validatePhone(saveItem.cusPhone)) {
    alert('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
    return;
  }
  // 시간/분 합치기
  saveItem.ordTime = `${hourPart.value}:${minPart.value}`;

  const formData = createFormData(saveItem);
  request.post('/api/customer/modifyOrader', formData).then((res) => {
    if (res.status === 200) {
      alert('수정되었습니다.');
      getOrerList();
      isModify.value = false;
    }
  });
};

const removeOrder = () => {
  if (!confirm('삭제하시겠습니까?')) return;
  request.post('/api/customer/deleteOrader', [...selectedItems.value]).then((res) => {
    if (res.status === 200) {
      alert('삭제되었습니다.');
      getOrerList();
    }
  });
};

const handleCompEvent = (item: any) => {
  const param = { orderNo: item.orderNo, compYn: 'Y' };
  request.post('/api/customer/updateCompYn', param).then((res) => {
    if (res.status === 200) {
      alert('처리되었습니다.');
      getOrerList();
    }
  });
};

/**
 * 5. UI 이벤트 핸들러
 */
const handleClickEvent = (item: any) => {
  request.post('/api/file/selectRefFileList', { refNo: item.orderNo }).then((res) => {
    searchImageFiles.value = [...res.data];
    connValue.value = item.conn;
    isActive.value = true;
  });
};

const handleRowClick = (item: any) => {
  request.post('/api/file/selectRefFileList', { refNo: item.orderNo }).then((res) => {
    searchImageFiles.value = [...res.data];
    Object.assign(saveItem, item);
    
    // 시간 분리하여 세팅 (HH:mm -> HH / m)
    if (item.ordTime && item.ordTime.includes(':')) {
      const [h, m] = item.ordTime.split(':');
      hourPart.value = h.padStart(2, '0');
      minPart.value = m.padStart(2, '0');
    } else {
      hourPart.value = '00';
      minPart.value = '00';
    }
    
    isModify.value = true;
  });
};

const showSave = () => {
  Object.assign(saveItem, inintSaveItem);
  // 등록 시 시간 초기화
  hourPart.value = '09'; // 기본값 예시
  minPart.value = '00';
  isRegiter.value = true;
};

const resetSeach = () => {
  Object.assign(search, initSearch);
};

const loadMore = ({ done }: any) => {
  if (displayCount.value >= rowData.value.length) {
    done('empty');
    return;
  }
  setTimeout(() => {
    displayCount.value += 10;
    done('ok');
  }, 500);
};

const setUpdateConn = (html: any, images: any) => {
  saveItem.conn = html;
  imageFiles.value = images;
};

/**
 * 6. 유틸리티 함수
 */
const getLabel = (obj: any, code: any) => obj.find((i: any) => i.value === code)?.lable ?? '';

const validatePhone = (phone: string) => {
  // 휴대전화(010 등) + 일반전화(02, 031 등) + 인터넷전화(070 등) 통합 정규식
  const regex = /^(01[016789]|02|0[3-9][0-9])-?[0-9]{3,4}-?[0-9]{4}$/;
  return regex.test(phone);
};

const getChannelColor = (code: string) => {
  const colors: Record<string, any> = {
    C1: { bg: '#FFEB3B', text: '#3E2723' }, // 카카오
    C2: { bg: '#E8F5E9', text: '#2E7D32' }, // 네이버
    C3: { bg: '#E8F5E9', text: '#2E7D32' }  // 네이버
  };
  return colors[code] || { bg: '#F5F5F5', text: '#616161' };
};

const formatCurrency = (val: any) => (val ? new Intl.NumberFormat('ko-KR').format(val) : '');

const formatPhone = (val: string) => {
  if (!val) return '';
  const num = val.replace(/[^\d]/g, '');
  if (num.length <= 3) return num;
  if (num.length <= 6) return `${num.slice(0, 3)}-${num.slice(3)}`;
  if (num.length <= 10) {
    if (num.startsWith('02')) {
      return `${num.slice(0, 2)}-${num.slice(2, 6)}-${num.slice(6)}`;
    }
    return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
  }
  if (num.startsWith('02')) {
    return `${num.slice(0, 2)}-${num.slice(2, 6)}-${num.slice(6, 10)}`;
  }
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
};

const createFormData = (data: any) => {
  const fd = new FormData();
  const processedData = { ...data, conn: replaceImageUrl(data.conn, 'serverUrl') };
  imageFiles.value.forEach((img: any, idx: number) => {
    fd.append('editorFiles', base64toFile(img, `img${idx}`));
  });
  fd.append('saveData', JSON.stringify(processedData));
  return fd;
};

const replaceImageUrl = (html: string, url: string) => {
  if (!html || typeof document === 'undefined') return html;
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('img').forEach((img) => img.setAttribute('src', url));
  return div.innerHTML;
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

onMounted(async () => {
  // URL 쿼리 파라미터 확인
  const qPhone = route.query.cusPhone as string;
  const qDate = route.query.ordDate as string;
  const qOrderNo = route.query.orderNo;

  if (qPhone) {
    search.cusPhone = qPhone; // 검색 필터에 전화번호 세팅
  }
  if (qDate) {
    search.ordDate = qDate; // 검색 필터에 픽업날짜 세팅
  }

  // 데이터 조회 실행
  await getOrerList();
  
  // 조회된 데이터 중에서 특정 주문번호 상세 팝업 오픈
  if (qOrderNo) {
    const targetItem = rowData.value.find((item: any) => item.orderNo === Number(qOrderNo));
    if (targetItem) {
      handleClickEvent(targetItem);
    }
  }
});
</script>

<template>
  <!-- 검색 필터 영역 -->
  <v-form>
    <v-container :fluid="mobile" :class="mobile ? 'px-0' : ''">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="search.cusNm" label="고객명" variant="outlined" color="secondary" hide-details class="mb-4" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="search.cusPhone" label="고객전화번호" variant="outlined" color="secondary" hide-details class="mb-4" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="search.ordDate" label="픽업날짜" type="date" variant="outlined" color="secondary" hide-details class="mb-4" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  <!-- 검색 버튼 영역 -->
  <v-row :justify="mobile ? 'center' : 'end'" class="pa-2 px-4 ma-0">
    <v-col cols="6" sm="auto">
      <v-btn variant="tonal" color="secondary" block @click="getOrerList">검색</v-btn>
    </v-col>
    <v-col cols="6" sm="auto">
      <v-btn variant="tonal" color="secondary" block @click="resetSeach">초기화</v-btn>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <UiParentCard title="주문정보">
        <!-- 상단 액션 버튼 -->
        <v-row :justify="mobile ? 'center' : 'end'" class="pa-2 px-4 ma-0">
          <v-col cols="6" sm="auto">
            <v-btn variant="outlined" color="primary" block @click="showSave">등록</v-btn>
          </v-col>
          <v-col cols="6" sm="auto">
            <v-btn variant="outlined" color="error" block @click="removeOrder">삭제</v-btn>
          </v-col>
        </v-row>

        <!-- [1] 데스크탑 뷰: 데이터 테이블 -->
        <v-data-table
          v-if="!mobile"
          :headers="headers"
          :items="rowData"
          v-model="selectedItems"
          item-value="orderNo"
          show-select
          hover
          height="500px"
        >
          <template v-slot:item.orderNo="{ item }">
            <div class="text-center">
              <v-btn variant="text" color="primary" @click="handleRowClick(item)" class="px-0">{{ item.orderNo }}</v-btn>
            </div>
          </template>
          <template v-slot:item.cusChnnel="{ item }">
            {{ getLabel(cusChnnel, item.cusChnnel) }}
          </template>
          <template v-slot:item.payNt="{ item }">
            {{ getLabel(payNt, item.payNt) }}
          </template>
          <template v-slot:item.payMd="{ item }">
            {{ getLabel(payMd, item.payMd) }}
          </template>
          <template v-slot:item.compYn="{ item }">
            <div class="text-center">
              <v-chip v-if="item.compYn == 'Y'" color="success" size="small">완료</v-chip>
              <v-btn v-else variant="outlined" color="secondary" size="small" @click="handleCompEvent(item)">픽업완료</v-btn>
            </div>
          </template>
          <template v-slot:item.conn="{ item }">
            <div class="text-center">
              <v-btn variant="outlined" color="info" size="small" @click="handleClickEvent(item)">상세</v-btn>
            </div>
          </template>
          <template v-slot:item.ordAmt="{ item }">
            {{ formatCurrency(item.ordAmt) }}
          </template>
          <template v-slot:item.ordOtherAmt="{ item }">
            {{ formatCurrency(item.ordOtherAmt) }}
          </template>          
        </v-data-table>

        <!-- [2] 모바일 뷰: 프리미엄 카드 리스트 (무한 스크롤) -->
        <div v-else class="pa-4 pt-0">
          <v-divider class="mb-4" />
          <div class="d-flex align-center justify-space-between mb-3 px-1">
            <v-checkbox
              v-if="rowData.length > 0"
              label="전체 선택"
              density="compact"
              hide-details
              color="secondary"
              @update:model-value="(val) => (selectedItems = val ? rowData.map((r: any) => r.orderNo) : [])"
            />
            <span class="text-caption text-grey">전체 {{ rowData.length }}건</span>
          </div>

          <v-infinite-scroll :items="mobileDisplayData" @load="loadMore">
            <template v-for="item in mobileDisplayData" :key="item.orderNo">
              <v-card variant="flat" class="mb-6 overflow-hidden card-mobile">
                <!-- 카드 헤더 -->
                <div class="px-4 py-2 bg-grey-lighten-4 d-flex justify-space-between align-center">
                  <div class="d-flex align-center">
                    <v-checkbox
                      :model-value="selectedItems.includes(item.orderNo)"
                      @update:model-value="(val) => {
                        if (val) selectedItems.push(item.orderNo);
                        else selectedItems = selectedItems.filter((id) => id !== item.orderNo);
                      }"
                      density="compact"
                      hide-details
                      color="secondary"
                      class="mr-1"
                    />
                    <span class="text-caption font-weight-black text-grey-darken-1">ORD-{{ item.orderNo }}</span>
                  </div>
                  <v-chip :color="item.compYn === 'Y' ? 'success' : 'orange-darken-1'" size="x-small" variant="flat" class="font-weight-bold px-3">
                    {{ item.compYn === 'Y' ? '완료' : '픽업대기' }}
                  </v-chip>
                </div>

                <!-- 카드 본문 -->
                <v-card-text class="pa-5">
                  <div class="mb-4">
                    <div class="text-subtitle-1 font-weight-bold text-primary mb-1">{{ item.prodNm }}</div>
                    <div class="text-h6 font-weight-bold text-grey-darken-4 d-flex align-center line-height-1-2">
                      <v-icon size="22" color="grey-darken-3" class="mr-1" icon="$accountCircle" />
                      {{ item.cusNm }}
                    </div>
                  </div>
                  <v-divider class="mb-4 border-light" />
                  <v-row no-gutters>
                    <v-col cols="12" class="mb-2 d-flex align-center">
                      <v-icon size="16" color="grey-lighten-1" class="mr-2" icon="$calendarClock" />
                      <span class="text-body-2 text-grey-darken-2 font-weight-medium">{{ item.ordDate }}</span>
                      <span class="text-caption text-grey-lighten-1 ml-2">{{ item.ordTime }}</span>
                    </v-col>
                    <v-col cols="12" class="d-flex align-center">
                      <v-icon size="16" color="grey-lighten-1" class="mr-2" icon="$phoneOutline" />
                      <span class="text-body-2 text-grey-darken-2 font-weight-medium">{{ item.cusPhone }}</span>
                      <v-chip
                        v-if="item.cusChnnel"
                        size="x-small"
                        :color="getChannelColor(item.cusChnnel).text"
                        :bg-color="getChannelColor(item.cusChnnel).bg"
                        variant="flat"
                        class="ml-2 px-2 font-weight-bold"
                        style="font-size: 10px"
                      >
                        {{ getLabel(cusChnnel, item.cusChnnel) }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-card-text>

                <!-- 카드 하단 버튼 -->
                <v-divider />
                <div class="pa-3 bg-white d-flex align-center">
                  <v-btn variant="text" color="grey-darken-1" class="font-weight-bold" prepend-icon="$magnify" @click="handleClickEvent(item)">상세</v-btn>
                  <v-btn variant="text" color="info" class="font-weight-bold mx-1" prepend-icon="$pencilOutline" @click="handleRowClick(item)">수정</v-btn>
                  <v-spacer />
                  <v-btn
                    :variant="item.compYn === 'Y' ? 'tonal' : 'elevated'"
                    :color="item.compYn === 'Y' ? 'grey-lighten-4' : 'success'"
                    :disabled="item.compYn === 'Y'"
                    rounded="pill"
                    size="small"
                    class="px-5 font-weight-black"
                    elevation="2"
                    @click="handleCompEvent(item)"
                  >
                    {{ item.compYn === 'Y' ? '완료됨' : '픽업완료' }}
                  </v-btn>
                </div>
              </v-card>
            </template>
            <template v-slot:empty>
              <div class="text-center text-caption text-grey pa-4">모든 데이터를 확인했습니다.</div>
            </template>
          </v-infinite-scroll>
        </div>
      </UiParentCard>
    </v-col>
  </v-row>

  <!-- [3] 팝업 레이어 영역 -->
  <Dialogs v-model="isActive" :conn-value="connValue" :img-files="searchImageFiles" />

  <!-- 상세 주문 등록 공용 컴포넌트 사용 (중복 코드 제거) -->
  <QuickOrderDialog v-model="isRegiter" @success="getOrerList" />

  <!-- 수정 다이얼로그 -->

  <!-- 수정 다이얼로그 -->
  <v-dialog v-model="isModify" max-width="800">
    <v-card title="주문수정">
      <v-card-text>
        <v-select v-model="saveItem.cusChnnel" :items="cusChnnel" item-title="lable" item-value="value" label="상담채널 *" variant="outlined" color="secondary" />
        <v-select v-model="saveItem.payMd" :items="payMd" item-title="lable" item-value="value" label="결제수단 *" variant="outlined" color="secondary" />
        <v-select v-model="saveItem.payNt" :items="payNt" item-title="lable" item-value="value" label="결제방법 *" variant="outlined" color="secondary" />
        <v-text-field v-model="formattedOtherAmt" label="예약금" prefix="₩" suffix="원" variant="outlined" color="secondary" />
        <v-text-field v-model="formattedAmt" label="금액 *" prefix="₩" suffix="원" variant="outlined" color="secondary" />
        
        <!-- 고객 선택 통합 버튼 (수정) -->
        <div class="mb-4">
          <v-label class="text-caption mb-1">고객 정보 *</v-label>
          <v-btn
            block
            variant="outlined"
            :color="saveItem.cusNm ? 'primary' : 'grey-lighten-1'"
            height="56"
            class="justify-start px-4 text-none"
            @click="isCustomerPopup = true"
          >
            <v-icon start icon="$accountSearch" />
            <div v-if="saveItem.cusNm" class="text-left">
              <div class="text-body-1 font-weight-bold">{{ saveItem.cusNm }}</div>
              <div class="text-caption">{{ formatPhone(saveItem.cusPhone) }}</div>
            </div>
            <span v-else class="text-body-1">고객을 선택해주세요</span>
          </v-btn>
        </div>

        <v-text-field v-model="saveItem.ordDate" label="픽업날짜 *" type="date" variant="outlined" color="secondary" />
        <v-row no-gutters>
          <v-col cols="6" class="pr-2">
            <v-select v-model="hourPart" :items="hourOptions" label="시 *" variant="outlined" color="secondary" suffix="시" />
          </v-col>
          <v-col cols="6">
            <v-select v-model="minPart" :items="minOptions" label="분 *" variant="outlined" color="secondary" suffix="분" />
          </v-col>
        </v-row>

        <v-text-field v-model="saveItem.prodNm" label="상품명 *" variant="outlined" color="secondary" />
        <QuillEditor v-model:value="saveItem.conn" :img-files="searchImageFiles" @update:model-value="setUpdateConn" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" color="secondary" @click="isModify = false">취소</v-btn>
        <v-btn variant="outlined" color="secondary" @click="modifyOrder">수정</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 고객 선택 팝업 -->
  <CustomerPopup v-model="isCustomerPopup" @selected="selectCustomer" />
</template>

<style scoped>
.card-mobile {
  border-radius: 20px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #f1f1f1 !important;
}
.line-height-1-2 {
  line-height: 1.2;
}
.selected-row-by-checkbox {
  background-color: #c8e6c9 !important;
}
</style>
