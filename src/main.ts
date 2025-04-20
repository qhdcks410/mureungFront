import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import axios from 'axios';

import { fakeBackend } from '@/utils/helpers/fake-backend';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// print
import print from 'vue3-print-nb';
import {quillEditor,Quill} from 'vue3-quill';
import { ImageResize } from 'quill-image-resize-module-ts';


Quill.register('modules/imageResize', ImageResize);
const app = createApp(App);

app.config.globalProperties.axios = axios;
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
fakeBackend();
app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(createPinia());
app.use(VueTablerIcons);
app.use(print);
app.use(VueApexCharts);
app.use(quillEditor);
app.use(vuetify).mount('#app');
