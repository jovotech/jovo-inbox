<template>
  <main
    v-if="selectedConversation"
    class="flex-1 relative h-screen overflow-y-hidden focus:outline-none xl:order-first bg-gray-100"
    tabindex="0"
    @mouseenter="isContentHovered = true"
    @mouseleave="isContentHovered = false"
  >
    <!-- Start main area-->
    <div class="inset-0 mt-2 px-0 bg-gray-100" v-if="selectedConversation.length > 0">
      <div class="h-full rounded-lg">
        <div class="text-center">
          <div class="sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option :selected="$route.name === 'conversation'">All Interactions</option>
              <option :selected="$route.name === 'sessions'">Sessions</option>
            </select>
          </div>
          <div class="hidden sm:block">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                <router-link
                  :to="{
                    name: 'conversation',
                    params: { appId: app.id, userId: selectedConversation[0].userId },
                  }"
                  aria-current="page"
                  class="text-jovo-blue hover:text-jovo-blue hover:border-jovo-blue whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  :class="[
                    $route.name === 'conversation' ? 'border-jovo-blue' : 'border-transparent',
                  ]"
                >
                  All interactions
                </router-link>
                <router-link
                  :to="{
                    name: 'sessions',
                    params: { appId: app.id, userId: selectedConversation[0].userId },
                  }"
                  class="text-gray-500 hover:text-jovo-blue hover:border-jovo-blue whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  :class="[$route.name === 'sessions' ? 'border-jovo-blue' : 'border-transparent']"
                >
                  Sessions
                  <span
                    class="inline-flex items-center justify-center px-1 py-0.5 mr-2 text-xs font-bold leading-none text-gray-500 bg-gray-200 rounded"
                    >{{ sessions.length }}</span
                  >
                </router-link>
                <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!loading"
      class="ml-auto overflow-y-auto h-screen font-medium space-y-4 overflow-y-scroll px-32 pt-10 pb-36"
      ref="partContainer"
      :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
    >
      <div v-for="session in sessions" v-bind:key="session.sessionId">
        <div>
          <div class="my-4 mt-12 mx-auto w-4/5 new-session">
            <span class="bg-gray-100">{{ newSessionDate(session.sessionStart) }}</span>
          </div>
          <div
            class="text-center"
            v-if="$route.name === 'sessions'"
            @click="expandSession(session.sessionId)"
          >
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 mx-1"
            >
              {{ session.interactions.length }} interactions
            </span>
            <span class="text-center">
              <chevron-down-icon
                v-if="!expandedSessions[session.sessionId]"
                size="14"
                class="inline cursor-pointer"
              ></chevron-down-icon>
              <chevron-up-icon size="14" v-else class="inline cursor-pointer"></chevron-up-icon>
            </span>
          </div>
        </div>

        <div v-if="$route.name === 'conversation' || expandedSessions[session.sessionId]">
          <interaction-item
            v-for="interaction in session.interactions"
            v-bind:key="interaction.requestId"
            :interaction="interaction"
          />
        </div>
      </div>
    </div>
    <!--    <detail-conversation-part></detail-conversation-part>-->
    <!-- End main area -->
  </main>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import ConversationPart from '@/components/conversation/ConversationPart.vue';
import { SelectUserConversationsDto } from 'jovo-inbox-core';
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { FormatUtil } from '@/utils/FormatUtil';
import { ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons';
import UserSessions from '@/components/conversation/UserSessions.vue';
import RequestPart from '@/components/conversation/RequestPart.vue';
import ResponsePart from '@/components/conversation/ResponsePart.vue';
import InteractionItem from '@/components/conversation/InteractionItem.vue';

@Component({
  name: 'main-panel',
  components: {
    InteractionItem,
    ResponsePart,
    RequestPart,
    UserSessions,
    ConversationPart,
    DetailConversationPart,
    ChevronDownIcon,
    ChevronUpIcon,
  },
})
export default class MainPanel extends mixins(BaseMixin) {
  loading = false;
  isContentHovered = false;

  interval?: number;
  expandedSessions: Record<string, boolean> = {};

  mounted() {
    this.onSelectedConversation();
  }

  newSessionDate(date: string | Date) {
    return FormatUtil.formatDate(date);
  }

  @Watch('selectedConversation')
  onSelectedConversation() {
    this.$nextTick(() => {
      setTimeout(async () => {
        this.scrollToBottom();
        await this.$store.dispatch('DataModule/selectInteraction', null);
      }, 100);
    });
  }
  scrollToBottom() {
    const partContainer = this.$refs.partContainer as HTMLDivElement;
    partContainer.scrollTop = partContainer.scrollHeight;
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
  expandSession(sessionId: string) {
    const value =
      typeof this.expandedSessions[sessionId] === 'undefined'
        ? false
        : this.expandedSessions[sessionId];

    this.expandedSessions[sessionId] = !value;
    this.$forceUpdate();
  }
}
</script>
<style lang="scss">
div.new-session {
  opacity: 0.3;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  line-height: 0.1em;
  font-size: smaller;
}

div.new-session span {
  padding: 0 10px;
}
</style>
