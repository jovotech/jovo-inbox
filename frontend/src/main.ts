import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import store from '@/store';
import router from '@/router';
import Clipboard from 'v-clipboard';
import { NotificationData, NotificationType } from '@/types';

declare module 'vue/types/vue' {
  interface Vue {
    $clipboard(value: string): void;
    $notify: {
      show(notification: NotificationData): void;
      success(notificationOrTitle: Omit<NotificationData, 'type'> | string): void;
      warning(notificationOrTitle: Omit<NotificationData, 'type'> | string): void;
      error(notificationOrTitle: Omit<NotificationData, 'type'> | string): void;
    };
  }
}
export const BASE_API_URL = process.env.VUE_APP_BASE_APP_URL + '/api';

Vue.use(Clipboard);
Vue.config.productionTip = false;

Vue.prototype.$notify = {
  show(notification: NotificationData) {
    store.commit('NotificationsModule/add', notification);
  },
  success(notification: Omit<NotificationData, 'type'> | string) {
    this.show(this._parseData(NotificationType.Success, notification));
  },
  warning(notification: Omit<NotificationData, 'type'> | string) {
    this.show(this._parseData(NotificationType.Warning, notification));
  },
  error(notification: Omit<NotificationData, 'type'> | string) {
    this.show(this._parseData(NotificationType.Error, notification));
  },
  _parseData(type: NotificationType, notification: Omit<NotificationData, 'type'> | string) {
    return typeof notification === 'string'
      ? { type, title: notification }
      : { ...notification, type };
  },
};

Vue.prototype.$showNotification = function (notification: NotificationData) {
  this.$store.commit('notifications/add', notification);
};

new Vue({
  render: (h) => h(App),
  store,
  router,
}).$mount('#app');
