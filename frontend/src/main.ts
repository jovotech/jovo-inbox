import 'reflect-metadata';
import Vue from 'vue';
declare module 'vue/types/vue' {
  interface Vue {
    $clipboard(value: string): void;
  }
}
import App from './App.vue';
export const BASE_URL = process.env.VUE_APP_BACKEND_URL;
import VueSanitize from 'vue-sanitize';
import store from '@/store';
import router from '@/router';
import Clipboard from 'v-clipboard';
import { Platform } from '@jovotech/framework';
import { WebPlatform } from '@jovotech/platform-web';
import { CorePlatform } from '@jovotech/platform-core';
import { AlexaPlatform } from '@jovotech/platform-alexa';

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
