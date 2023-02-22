import store from '@/store';
import { NotificationData } from '@/types';
import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

export interface NotificationsModuleState {
  notifications: NotificationData[];
  notificationIdCount: number;
}

@Module({ namespaced: true, name: 'NotificationsModule' })
export class NotificationsModule extends VuexModule<NotificationsModuleState> {
  notifications: NotificationData[] = [];
  notificationIdCount = 0;

  @Mutation
  add(notification: NotificationData) {
    const idNotification = {
      ...notification,
      id: this.notificationIdCount++,
      duration: notification.duration ?? 4000,
    };

    if (idNotification.duration) {
      setTimeout(
        () => store.commit('NotificationsModule/remove', idNotification.id),
        idNotification.duration,
      );
    }
    this.notifications.push(idNotification);
  }
  @Mutation
  remove(notificationId: string | number) {
    const index = this.notifications.findIndex(
      (notification) => notification.id === notificationId,
    );
    if (index >= 0 && index < this.notifications.length) {
      this.notifications.splice(index, 1);
    }
  }

  @Mutation
  clear() {
    this.notifications = [];
  }
}
