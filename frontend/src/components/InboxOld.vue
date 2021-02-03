<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 w-full">
    <aside
      class="z-20 hidden w-14 pt-6 text-center bg-gray-700 text-gray-200 md:block flex-shrink-0"
    >
      <inbox-icon class="m-auto"></inbox-icon>
      <ul class="text-center mt-5 w-full border-t-4 border-gray-800">
        <li class=" py-3.5 m-1">
          <div
            class="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center flex-shrink-0 m-auto text-white text-center ring-2 ring-gray-300"
          >
            N
          </div>
        </li>
        <!--        <li class="bg-gray-700 py-1">-->
        <!--          <div-->
        <!--            class="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center flex-shrink-0 m-auto text-white text-center"-->
        <!--          >-->
        <!--            B-->
        <!--          </div>-->
        <!--        </li>-->
      </ul>
    </aside>
    <aside
      class="z-20 hidden w-96  bg-gray-800 text-gray-200 md:block flex-shrink-0"
      @mouseenter="isLeftSidebarHovered = true"
      @mouseleave="isLeftSidebarHovered = false"
    >
      <div class="bg-gray-800 p-2 m-2 mt-3 rounded-md">
        <div class="text-gray-200">
          <span class="text-2xl">NBA Demo</span>
          <p class="text-sm mt-0 h-2"></p>
        </div>
      </div>
      <div class="p-2 text-sm ml-5 text-gray-600">Latest sessions</div>
      <ul
        class="bg-gray-800 overflow-y-auto mt-2 h-120 border-t border-gray-700 border-opacity-40"
        :class="[isLeftSidebarHovered ? 'scrollbar' : 'scrollbar-invisible']"
      >
        <li
          v-for="conversation in lastConversations"
          v-bind:key="conversation.requestId"
          class="group flex hover:bg-gray-900 p-4 cursor-pointer text-gray-200 hover:text-gray-200 pl-2 hover:rounded-md border-t border-gray-700 border-opacity-20"
          @click="handleSelectConversation(conversation.userId)"
          :class="[isConversationSelected(conversation) ? 'bg-gray-900' : 'bg-gray-800']"
        >
          <div
            class="rounded-full h-10 w-10 bg-gray-200 flex mr-3 text-center items-center justify-center flex-shrink-0"
          >
            <img
              :src="createIcon(conversation.userId)"
              class="inline align-middle place-self-center justify-self-center"
            />
          </div>

          <div class="flex-grow self-center">
            <div class="text-sm font-medium">{{ shortenUserId(conversation.userId) }}</div>
            <div
              class="text-xs text-gray-600"
              :title="conversation.createdAt"
              v-html="lastConversationItemRequest(conversation).text"
            ></div>
          </div>
          <div
            class="float-right place-self-start rounded-md  px-2 inline-block text-xs text-gray-500  opacity-50"
          >
            <div
              class="text-xs inline-block text-gray-200 group-hover:text-gray-200 font-light"
              :title="conversation.createdAt"
            >
              {{ lastConversationItemDate(conversation) }}
            </div>
          </div>
        </li>
      </ul>

      <div class="p-2 text-sm ml-5 text-gray-600 border-t border-gray-700 border-opacity-80">
        Most active users
      </div>
    </aside>
    <div
      class="flex flex-col flex-1"
      @mouseenter="isContentHovered = true"
      @mouseleave="isContentHovered = false"
    >
      <header
        v-if="selectedConversation && selectedConversation.length > 0"
        class="z-10 px-4 py-3 text-white shadow-md bg-gray-900 flex"
      >
        <div
          class="rounded-full h-8 w-8 bg-gray-200 flex mr-3 text-center items-center justify-center flex-shrink-0"
        >
          <img
            :src="createIcon(selectedConversation[0].userId, 18)"
            class="inline align-middle place-self-center justify-self-center"
          />
        </div>

        <div class="flex-grow self-center">
          <div class="text-sm font-medium">
            {{ shortenUserId(selectedConversation[0].userId) }}

            <div class="text-xs text-gray-500">
              {{ countSessions(selectedConversation) }}
              {{ countSessions(selectedConversation) === 1 ? 'session' : 'sessions' }}, last
              {{ lastConversationItemDate(selectedConversation[selectedConversation.length - 1]) }}
            </div>
          </div>
        </div>
      </header>
      <main class="bg-gray-100">
        <div
          v-if="!loading"
          class="ml-auto overflow-y-auto h-screen -mt-16 font-medium  space-y-4 overflow-y-scroll px-4 py-24 pb-32"
          ref="partContainer"
          :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
        >
          <conversation-part
            v-for="(part, index) in selectedConversation"
            :key="index"
            :part="part"
            :selectedConversation="selectedConversation"
            :index="index"
          />
        </div>
      </main>
    </div>

    <div class="flex flex-col flex-1">
      <header
        v-if="false && selectedConversation && selectedConversation.length > 0"
        class="z-10 p-4 text-white shadow-md bg-gray-600"
      ></header>
      <main class="h-full overflow-y-auto p-10 bg-gray-2q00"></main>
    </div>
  </div>
  <!--  <div v-if="false" class="bg-gray-800  w-full m-auto flex flex-row">-->
  <!--    <div class="h-screen w-3/12 ">-->
  <!--      <div class="text-gray-200 p-3 bg-gray-800 pb-1 pl-9 sticky top-0 z-10">-->
  <!--        <inbox-icon class="inline-block mr-3"></inbox-icon>-->
  <!--        <h1 class="text-2xl inline-block">Jovo Inbox</h1>-->
  <!--      </div>-->
  <!--      <ul class=" bg-gray-700 overflow-y-auto">-->
  <!--        <li v-for="conversation in lastConversations" v-bind:key="conversation.requestId"-->
  <!--            class="group flex hover:bg-gray-900 p-3 cursor-pointer text-gray-200 hover:text-gray-200 pl-7" @click="handleSelectConversation(conversation.userId)"-->
  <!--        :class="[isConversationSelected(conversation) ? 'bg-gray-900' : 'bg-gray-800']">-->
  <!--          <div class="rounded-full h-10 w-10 bg-gray-200 flex mr-2 items-center justify-center flex-shrink-0"></div>-->

  <!--          <div class="flex-grow">-->
  <!--            <div class="text-sm font-medium">{{shortenUserId(conversation.userId)}}</div>-->
  <!--            <div class="text-xs text-gray-600 group-hover:text-gray-500" :title="conversation.createdAt" v-html="lastConversationItemRequest(conversation)"></div>-->
  <!--          </div>-->
  <!--          <div class="float-right place-self-start rounded-md  px-2 inline-block text-xs text-gray-500  opacity-50">-->
  <!--            <div class="text-xs inline-block text-gray-200 group-hover:text-gray-200 font-light" :title="conversation.createdAt">{{lastConversationItemDate(conversation)}}</div>-->
  <!--          </div>-->
  <!--        </li>-->
  <!--      </ul>-->
  <!--    </div>-->
  <!--    <div class="bg-gray-100 w-4/12 " @mouseenter="isHovered = true" @mouseleave="isHovered = false">-->
  <!--      <div class="w-full bg-gray-800 p-3 text-white sticky top-0">header</div>-->
  <!--      <div v-if="!loading" class="ml-auto p-8 overflow-y-auto h-screen font-medium  space-y-4 overflow-y-scroll px-12 py-7 pb-32" ref="partContainer" :class="[isHovered ? 'scrollbar' : 'scrollbar-invisible']">-->
  <!--          <conversation-part-->
  <!--              v-for="(part, index) in selectedConversation"-->
  <!--              :key="index"-->
  <!--              :part="part"-->
  <!--              :selectedConversation="selectedConversation"-->
  <!--              :index="index"-->
  <!--          />-->
  <!--      </div>-->
  <!--      <div v-if="loading" class="text-center pt-20">-->
  <!--        <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 m-auto"></div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div class="bg-gray-200 w-5/12">-->
  <!--      <div class="w-full bg-gray-800 p-3 text-white sticky top-0">Details</div>-->

  <!--    </div>-->

  <!--&lt;!&ndash;    <div id="aplviewer" style="width:510px; height: 300px"></div>&ndash;&gt;-->

  <!--  </div>-->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Api } from '@/Api';
import { InboxLog } from 'jovo-inbox-core';
import ConversationPart from '@/components/conversation/ConversationPart.vue';
import { format } from 'timeago.js';
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';

import { InboxIcon } from 'vue-feather-icons';
import { AlexaUtil } from '@/utils/AlexaUtil';
import * as AplRenderer from 'apl-viewhost-web';
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
