import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {

  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
          }
        }
      }),
      vuetify({
        autoImport: true
      })
    ],
    resolve: {
      extensions:['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'], //확장자 뺴도 import 가능
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    build: {
      //chunkSizeWarningLimit: 1024 * 1024 // Set the limit to 1 MB
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue'],
      include: ["quill"]
    },
    server: {
      proxy: {
        '/api': {  //#1. axios라이브러리 등으로 http 요청인데 api로 시작하면,
          target: env.BACKEND_URL,  //#2. 이쪽 주소로 매핑하여 백그라운드로 보내라.
          //target:  env.VITE_API_URL,  //#2. 이쪽 주소로 매핑하여 백그라운드로 보내라.
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }

});

