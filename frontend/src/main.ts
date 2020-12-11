import Vue from 'vue';
import App from './App.vue';
export const BASE_URL = process.env.VUE_APP_BACKEND_URL || 'http://localhost:4000';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
