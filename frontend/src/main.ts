import Vue from 'vue';
import App from './App.vue';
export const BASE_URL = process.env.VUE_APP_BACKEND_URL || 'http://localhost:4000';
import VueSanitize from 'vue-sanitize';
import store from '@/store';

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
}).$mount('#app');
