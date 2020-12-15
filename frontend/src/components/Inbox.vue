<template>
  <div class="bg-gray-800  w-full m-auto flex flex-row">
    <div class="h-screen w-2/12 overflow-y-auto h-full">
      <div class="text-gray-200 p-3 pb-1 flex align-center items-center pl-9">
        <inbox-icon class="inline-block mr-3"></inbox-icon>
        <h1 class="text-2xl inline-block">Jovo Inbox</h1>
      </div>
      <ul class="mt-2 bg-gray-700">
        <li v-for="conversation in lastConversations" v-bind:key="conversation.requestId"
            class="group flex bg-gray-800 hover:bg-gray-900 p-2 cursor-pointer text-gray-200 hover:text-gray-200 pl-7" @click="handleSelectConversation(conversation.userId)">
          <div class="rounded-full h-10 w-10 bg-gray-200 flex mr-2 items-center justify-center flex-shrink-0"></div>

          <div class="flex-grow">
            <div class="text-sm font-medium">{{shortenUserId(conversation.userId)}}</div>
            <div class="text-xs text-gray-600 group-hover:text-gray-500 " :title="conversation.createdAt" v-html="lastConversationItemRequest(conversation)"></div>
          </div>
          <div class="float-right place-self-start rounded-md  p-1 px-2 inline-block text-xs text-gray-500  opacity-50">
            <div class="text-xs inline-block text-gray-200 group-hover:text-gray-200" :title="conversation.createdAt">{{lastConversationItemDate(conversation)}}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="bg-gray-100 w-4/12 " @mouseenter="isHovered = true" @mouseleave="isHovered = false">


      <div v-if="!loading" class="ml-auto p-8 overflow-y-auto h-screen font-medium  space-y-4 overflow-y-scroll px-12 py-7 pb-32" ref="partContainer" :class="[isHovered ? 'scrollbar' : 'scrollbar-invisible']">
          <conversation-part
              v-for="(part, index) in selectedConversation"
              :key="index"
              :part="part"
              :selectedConversation="selectedConversation"
              :index="index"
          />
      </div>
      <div v-if="loading" class="text-center pt-20">
        <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 m-auto"></div>
      </div>
    </div>
    <div class="bg-gray-200 w-6/12">

    </div>
<!--    <div id="aplviewer" style="width:510px; height: 300px"></div>-->

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {Api} from "@/Api";
import {InboxLog} from "jovo-inbox-core";
import ConversationPart from "@/components/conversation/ConversationPart.vue";
import { format} from 'timeago.js';
import DetailConversationPart from "@/components/conversation/DetailConversationPart.vue";

import {
  InboxIcon,
} from 'vue-feather-icons';
import {AlexaUtil} from "@/utils/AlexaUtil";
import * as AplRenderer from 'apl-viewhost-web';
import {FormatUtil} from "@/utils/FormatUtil";

@Component({
  name: 'inbox',
  components: { ConversationPart, DetailConversationPart, InboxIcon },
})
export default class Inbox extends Vue {
  lastConversations: InboxLog[] = [];
  selectedConversation: InboxLog[] = [];
  isHovered = false;
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
    return FormatUtil.formatDate(inboxLog.createdAt)
  }

  lastConversationItemRequest(inboxLog: InboxLog) {
    return AlexaUtil.getFriendlyRequestName(inboxLog.payload);
    // return AlexaUtil.getFriendlyResponse(inboxLog.payload);

  }

  async handleSelectConversation(userId: string) {
    this.loading = true;
    this.selectedConversation = await Api.getUserConversations(userId);
    this.loading = false;
    this.$nextTick(() => {
      this.scrollToBottom();

    });

  }

  scrollToBottom() {
    const partContainer = this.$refs.partContainer as HTMLDivElement;
    partContainer.scrollTop = partContainer.scrollHeight;
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
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
