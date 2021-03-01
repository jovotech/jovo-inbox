<template>
  <main
    v-if="selectedConversation"
    class="flex-1 relative h-screen overflow-y-hidden focus:outline-none xl:order-first bg-gray-100"
    tabindex="0"
    @mouseenter="isContentHovered = true"
    @mouseleave="isContentHovered = false"
  >
    <!-- Start main area-->
    <div class="inset-0 mt-2 px-0  bg-gray-100" v-if="selectedConversation.length > 0">
      <div class="h-full  rounded-lg">
        <div class="text-center">
          <div class="sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option :selected="selectedTab === 'all_interactions'">All Interactions</option>
              <option :selected="selectedTab === 'sessions'">Sessions</option>
            </select>
          </div>
          <div class="hidden sm:block">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                <a
                  href="#"
                  @click="selectedTab = 'all_interactions'"
                  aria-current="page"
                  class="text-jovo-blue hover:text-jovo-blue hover:border-jovo-blue whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  :class="[
                    selectedTab === 'all_interactions' ? 'border-jovo-blue' : 'border-transparent',
                  ]"
                >
                  All interactions
                </a>
                <a
                  href="#"
                  @click="selectedTab = 'sessions'"
                  class="text-gray-500 hover:text-jovo-blue hover:border-jovo-blue whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  :class="[selectedTab === 'sessions' ? 'border-jovo-blue' : 'border-transparent']"
                >
                  Sessions
                  <span
                    class="inline-flex items-center justify-center px-1 py-0.5 mr-2 text-xs font-bold leading-none text-gray-500 bg-gray-200 rounded"
                    >{{ sessionsCount }}</span
                  >
                </a>
                <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!loading"
      class="ml-auto overflow-y-auto h-screen font-medium  space-y-4 overflow-y-scroll px-32 pt-10 pb-36"
      ref="partContainer"
      :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
    >
      <div v-for="(part, index) in selectedConversation" :key="index">
        <div
          v-if="isSessionStart(index)"
          class="text-center"
          :title="sessionStart(index)"
          @click="expandSession(index)"
        >
          <div class="my-4 mt-12 mx-auto w-4/5 new-session">
            <span class="bg-gray-100 ">{{ newSessionDate(sessionStart(index)) }}</span>
          </div>
          <div v-if="selectedTab === 'sessions'" class="text-center">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 mx-1"
            >
              {{ getSessionTurns(index) }} turns
            </span>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 mx-1"
            >
              <img class="h-2 w-2 mr-1" :src="getSessionDevice(index).image" />
              {{ getSessionDevice(index).name }}
            </span>

            <span
              v-if="getSessionErrors(index) > 0"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                class="h-2 w-2 mr-1 text-red-400"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              has errors
            </span>

            <span class="text-center">
              <chevron-down-icon
                size="14"
                v-if="!expandedSessions[part.sessionId]"
                class="inline cursor-pointer"
              ></chevron-down-icon>
              <chevron-up-icon size="14" v-else class="inline cursor-pointer"></chevron-up-icon>
            </span>
          </div>
        </div>
        <conversation-part
          v-if="selectedTab === 'all_interactions' || expandedSessions[part.sessionId]"
          :part="part"
          :selectedConversation="selectedConversation"
          :index="index"
        />
      </div>
    </div>
    <detail-conversation-part></detail-conversation-part>
    <!-- End main area -->
  </main>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import ConversationPart from '@/components/conversation/ConversationPart.vue';
import { InboxLog, InboxLogType, SelectUserConversationsDto } from 'jovo-inbox-core';
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { FormatUtil } from '@/utils/FormatUtil';
import { ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons';

enum Tabs {
  ALL_INTERACTIONS = 'all_interactions',
  SESSIONS = 'sessions',
}

@Component({
  name: 'main-panel',
  components: { ConversationPart, DetailConversationPart, ChevronDownIcon, ChevronUpIcon },
})
export default class MainPanel extends mixins(BaseMixin) {
  loading = false;
  isContentHovered = false;
  sessionsCount = 0;

  selectedTab = Tabs.ALL_INTERACTIONS;

  interval?: number;
  expandedSessions: Record<string, boolean> = {};

  get selectedConversation(): InboxLog[] {
    return this.$store.state.DataModule.selectedUserConversations;
  }

  isSessionStart(index: number) {
    return (
      index === 0 ||
      this.selectedConversation[index - 1].sessionId !== this.selectedConversation[index].sessionId
    );
  }

  newSessionDate(date: string) {
    return FormatUtil.formatDate(date);
  }

  @Watch('selectedConversation')
  onSelectedConversation() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
    this.countSessions();
  }
  scrollToBottom() {
    const partContainer = this.$refs.partContainer as HTMLDivElement;
    partContainer.scrollTop = partContainer.scrollHeight;
  }

  sessionStart(index: number) {
    return this.selectedConversation[index].createdAt;
  }

  countSessions() {
    const sessionsMap: Record<string, boolean> = {};
    this.selectedConversation.forEach((inboxLog: InboxLog) => {
      sessionsMap[inboxLog.sessionId] = true;
    });

    this.sessionsCount = Object.keys(sessionsMap).length;
  }

  @Watch('isLiveMode')
  async watchLiveMode() {
    if (this.isLiveMode) {
      this.interval = window.setInterval(async () => {
        const lastLog = this.selectedConversation[this.selectedConversation.length - 1];
        await this.$store.dispatch('DataModule/appendUserConversations', {
          userId: lastLog.userId,
          appId: lastLog.appId,
          lastId: lastLog.id,
        } as SelectUserConversationsDto);
      }, 5000);
    } else {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  }
  expandSession(index: number) {
    const inboxLog = this.selectedConversation[index];
    if (this.expandedSessions[inboxLog.sessionId]) {
      this.expandedSessions[inboxLog.sessionId] = false;
    } else {
      this.expandedSessions[inboxLog.sessionId] = true;
    }
    this.$forceUpdate();
  }

  getSessionTurns(index: number) {
    const inboxLog = this.selectedConversation[index];
    let counter = 0;

    while (
      index + 1 <= this.selectedConversation.length &&
      this.selectedConversation[index++].sessionId === inboxLog.sessionId
    ) {
      counter++;
    }
    return counter / 2;
  }

  getSessionErrors(index: number) {
    const firstInboxLog = this.selectedConversation[index];
    let errors = 0;

    for (let i = index + 1; i < this.selectedConversation.length; i++) {
      if (this.selectedConversation[i].type === InboxLogType.ERROR) {
        errors++;
      }

      if (this.selectedConversation[i].sessionId !== firstInboxLog.sessionId) {
        return errors;
      }
    }

    return errors;
  }

  getSessionDevice(index: number) {
    const inboxLog = this.selectedConversation[index];

    const platform = this.getPlatform(inboxLog);

    if (platform) {
      const requestConstructor = platform?.requestClass;

      const request = Object.assign(new requestConstructor(), inboxLog.payload);
      return {
        name: request.getDeviceName(),
        platform: platform.name,
        image: platform?.image64x64,
      };
    }
  }
}
</script>
<style lang="scss"></style>
