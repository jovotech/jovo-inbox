<template>
  <div class="fixed inset-0 flex justify-end px-4 py-6 pointer-events-none sm:p-6 z-40">
    <transition-group
      tag="div"
      class="flex flex-col w-full max-w-sm space-y-3"
      enter-active-class="transform ease-out duration-300 transition"
      enter-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <notification
        v-for="(notification, index) in notifications"
        :key="notification.id || index"
        :notification="notification"
        @close="removeNotification(notification)"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { NotificationData } from '@/types';
import { Component, Vue } from 'vue-property-decorator';
import Notification from '@/components/Notification.vue';

@Component({
  name: 'notification-container',
  components: { Notification },
})
export default class NotificationContainer extends Vue {
  get notifications(): NotificationData[] {
    return this.$store.state.NotificationsModule.notifications;
  }

  removeNotification(notification: NotificationData) {
    this.$store.commit('NotificationsModule/remove', notification.id);
  }
}
</script>
