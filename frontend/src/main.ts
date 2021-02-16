import Vue from 'vue';
declare module 'vue/types/vue' {
  interface Vue {
    $clipboard(value: string): void;
  }
}
import App from './App.vue';
export const BASE_URL = process.env.VUE_APP_BACKEND_URL || 'http://localhost:4000';
import VueSanitize from 'vue-sanitize';
import store from '@/store';
import router from '@/router';
import Clipboard from 'v-clipboard';

Vue.use(Clipboard);
Vue.config.productionTip = false;

const defaultOptions = {
  allowedTags: ['audio', 'span'],
  allowedAttributes: {
    audio: ['src', 'class'],
    span: ['class', 'title'],
  },
};

Vue.use(VueSanitize, defaultOptions);

new Vue({
  render: (h) => h(App),
  store,
  router,
}).$mount('#app');
