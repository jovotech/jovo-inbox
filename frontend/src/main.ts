import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import store from '@/store';
import router from '@/router';
import Clipboard from 'v-clipboard';

declare module 'vue/types/vue' {
  interface Vue {
    $clipboard(value: string): void;
  }
}
export const BASE_URL = process.env.VUE_APP_BACKEND_URL;

Vue.use(Clipboard);
Vue.config.productionTip = false;

const defaultOptions = {
  allowedTags: ['audio', 'span'],
  allowedAttributes: {
    audio: ['src', 'class'],
    span: ['class', 'title'],
  },
};

// Vue.use(VueSanitize, defaultOptions);

new Vue({
  render: (h) => h(App),
  store,
  router,
}).$mount('#app');
