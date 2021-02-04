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
              <option selected>All Interactions</option>
              <option>Sessions</option>
            </select>
          </div>
          <div class="hidden sm:block">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                <a
                  href="#"
                  aria-current="page"
                  class="border-jovo-blue text-jovo-blue hover:text-jovo-blue hover:border-jovo-blue whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                >
                  All interactions
                </a>
                <a
                  href="#"
                  class="border-transparent text-gray-500 hover:text-jovo-blue hover:border-jovo-blue whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
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
      <conversation-part
        v-for="(part, index) in selectedConversation"
        :key="index"
        :part="part"
        :selectedConversation="selectedConversation"
        :index="index"
      />
    </div>
    <!-- End main area -->
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ConversationPart from '@/components/conversation/ConversationPart.vue';
import { InboxLog } from 'jovo-inbox-core';

@Component({
  name: 'main-panel',
  components: { ConversationPart },
})
export default class MainPanel extends Vue {
  loading = false;
  isContentHovered = false;
  sessionsCount = 0;

  get selectedConversation() {
    return this.$store.state.DataModule.selectedUserConversations;
  }

  @Watch('selectedConversation')
  onSelectedConversation() {
    this.$nextTick(() => {
      this.scrollToBottom();
    });
    this.countSessions();
  }
  scrollToBottom() {
    const partContainer = this.$refs.partContainer as HTMLDivElement;
    partContainer.scrollTop = partContainer.scrollHeight;
  }

  countSessions() {
    const sessionsMap: Record<string, boolean> = {};
    this.selectedConversation.forEach((inboxLog: InboxLog) => {
      sessionsMap[inboxLog.sessionId] = true;
    });

    this.sessionsCount = Object.keys(sessionsMap).length;
  }
}
</script>
<style lang="scss"></style>
