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
import { AlexaUtil } from '@/utils/AlexaUtil';
import { FormatUtil } from '@/utils/FormatUtil';
import { DisplayHelper } from '@/utils/DisplayHelper';

@Component({
  name: 'inbox',
  components: { ConversationPart, DetailConversationPart, InboxIcon },
})
export default class Inbox extends Vue {
  lastConversations: InboxLog[] = [];
  selectedConversation: InboxLog[] = [];
  isLeftSidebarHovered = false;
  isContentHovered = false;

  loading = false;

  async mounted() {
    this.lastConversations = await Api.getLastConversations();
  }

  shortenUserId(userId: string) {
    return userId.substr(userId.indexOf('account.') + 8, 10);
  }

  lastConversationItemDevice(inboxLog: InboxLog) {
    return AlexaUtil.getFriendlyDeviceName(inboxLog.payload);
  }

  lastConversationItemDate(inboxLog: InboxLog) {
    return FormatUtil.formatDate(inboxLog.createdAt);
  }

  lastConversationItemRequest(inboxLog: InboxLog) {
    return AlexaUtil.getFriendlyRequestName(inboxLog.payload);
  }

  async handleSelectConversation(userId: string) {
    this.loading = true;
    this.selectedConversation = await Api.getUserConversations(userId);
    this.loading = false;
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  }

  isConversationSelected(conversationPart: InboxLog) {
    return (
      this.selectedConversation[0] &&
      this.selectedConversation[0].userId === conversationPart.userId
    );
  }

  scrollToBottom() {
    const partContainer = this.$refs.partContainer as HTMLDivElement;
    partContainer.scrollTop = partContainer.scrollHeight;
  }

  createIcon(id: string, size = 20) {
    return DisplayHelper.toDisplayIcon(id, {
      size,
      format: 'svg',
      // @ts-ignore
      saturation: 0.2,
      brightness: 0.5,
      background: [229, 231, 235, 1],
    });
  }

  countSessions(selectedConversation: InboxLog[]) {
    const counts: any = {};
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
