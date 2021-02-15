<template>
  <div class="relative bg-blue-900">
    <div class="max-w-8xl mx-auto px-2 sm:px-6">
      <div class="flex justify-between items-center p-3  md:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <a href="#">
            <span class="sr-only">Workflow</span>
            <img
              class="h-4 w-auto sm:h-10"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt=""
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Api } from '@/Api';
import { InboxLog } from 'jovo-inbox-core';
import ConversationPart from '@/components/conversation/ConversationPart.vue';
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';

import { InboxIcon } from 'vue-feather-icons';

@Component({
  name: 'inbox',
  components: { ConversationPart, DetailConversationPart, InboxIcon },
})
export default class Inbox extends Vue {
  lastConversations: InboxLog[] = [];
  selectedConversation: InboxLog[] = [];

  loading = false;

  async mounted() {
    // this.lastConversations = await Api.getLastConversations();
  }

  // lastConversationItemDevice(inboxLog: InboxLog) {
  //   // return AlexaUtil.getFriendlyDeviceName(inboxLog.payload);
  // }
  //
  //
  // lastConversationItemRequest(inboxLog: InboxLog) {
  //   // return AlexaUtil.getFriendlyRequestName(inboxLog.payload);
  // }

  isConversationSelected(conversationPart: InboxLog) {
    return (
      this.selectedConversation[0] &&
      this.selectedConversation[0].userId === conversationPart.userId
    );
  }

  countSessions(selectedConversation: InboxLog[]) {
    const counts: Record<string, boolean> = {};
    selectedConversation.forEach((inboxLog: InboxLog) => {
      counts[inboxLog.sessionId] = true;
    });
    return Object.keys(counts).length;
  }
}
</script>
<style lang="scss">
.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
