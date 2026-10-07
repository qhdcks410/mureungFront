<script setup lang="ts">
import { ref } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import { useAuthStore } from '@/stores/auth';
import { SettingsIcon, SearchIcon, Menu2Icon, LogoutIcon, PlusIcon } from 'vue-tabler-icons';

import ProfileDD from './ProfileDD.vue';
import Searchbar from './SearchBarPanel.vue';
import QuickOrderDialog from '@/components/popup/QuickOrderDialog.vue';

const customizer = useCustomizerStore();
const authStore = useAuthStore();
const showSearch = ref(false);
const isOrderDialogOpen = ref(false);

function searchbox() {
  showSearch.value = !showSearch.value;
}

const handleOrderSuccess = () => {
  if (window.location.pathname.includes('dashboard') || window.location.pathname === '/') {
    window.location.reload();
  }
};
</script>

<template>
  <v-app-bar elevation="0" height="80">
    <!-- Desktop Sidebar Toggle -->
    <v-btn
      class="hidden-md-and-down text-secondary"
      color="lightsecondary"
      icon rounded="lg" variant="flat" size="small"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>
    
    <!-- Mobile Sidebar Toggle -->
    <v-btn
      class="hidden-lg-and-up text-secondary ms-3"
      color="lightsecondary"
      icon rounded="lg" variant="flat" size="small"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>

    <!-- Desktop Search -->
    <v-sheet class="mx-4 v-col-3 v-col-xl-2 v-col-lg-4 d-none d-lg-block bg-transparent">
      <Searchbar />
    </v-sheet>

    <v-spacer />
    
    <!-- Action Buttons -->
    <v-btn
      color="primary" variant="elevated" rounded="lg"
      class="mr-3 mr-sm-4 px-6 font-weight-black shadow-modern pickup-btn"
      height="44"
      @click="isOrderDialogOpen = true"
    >
      <template v-slot:prepend><PlusIcon size="20" stroke-width="3" /></template>
      <span class="hidden-xs">신규 주문등록</span>
    </v-btn>

    <v-divider vertical class="mx-2 my-6 opacity-20 hidden-xs" />

    <v-btn
      icon
      color="error"
      variant="tonal"
      rounded="lg"
      width="42"
      height="42"
      class="ml-2 ml-sm-4 shadow-sm"
      @click="authStore.logout()"
    >
      <LogoutIcon size="22" stroke-width="2" />
      <v-tooltip activator="parent" location="bottom">로그아웃</v-tooltip>
    </v-btn>
    <!-- Popups -->
    <QuickOrderDialog v-model="isOrderDialogOpen" @success="handleOrderSuccess" />
  </v-app-bar>
</template>
