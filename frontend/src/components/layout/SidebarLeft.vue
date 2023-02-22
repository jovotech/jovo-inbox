<template>
  <div
    class="hidden lg:flex lg:flex-shrink-0"
    @mouseenter="isContentHovered = true"
    @mouseleave="isContentHovered = false"
  >
    <div class="flex flex-col w-80">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col h-0 flex-1 border-r pb-3 border-gray-200 bg-gray-50">
        <div
          class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto"
          :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
        >
          <div class="flex items-center flex-shrink-0 px-3">
            <div class="w-full">
              <select-project-list @select-conversation="selectConversation"></select-project-list>
            </div>
          </div>
          <div class="px-3 mt-2.5 pb-3" v-if="projects.length > 0">
            <filter-settings
              @loadConversations="loadConversations"
              @updateSearchMode="updateSearchMode"
              @updateSearchLoading="updateSearchLoading"
              ref="filtersettings"
            ></filter-settings>
          </div>
          <div
            class="bg-white w-auto ml-1 flex-1 flex flex-col overflow-y-auto"
            :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
            @scroll="handleScroll"
          >
            <ul class="divide-y divide-gray-200">
              <li
                class="text-center justify-center items-center pt-2"
                :class="[!isSearchLoading ? 'hidden' : '']"
              >
                <loading-spinner></loading-spinner>
              </li>

              <user-conversation-list-item
                v-for="conversation in getConversations()"
                v-bind:key="conversation.id"
                :interaction="conversation"
                :loadingConversation="loadingConversation"
              ></user-conversation-list-item>

              <li v-if="getConversations().length === 0">
                <div class="text-center text-sm py-2 px-2 text-gray-400">No conversations yet</div>
              </li>

              <li
                class="text-center justify-center items-center pt-2"
                :class="[lastConversationLoading ? 'visible' : 'invisible']"
              >
                <loading-spinner></loading-spinner>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { GetLastConversationsDto, InboxLog, Interaction } from 'jovo-inbox-core';

import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import SelectProjectList from '@/components/SelectProjectList.vue';
import FilterSettings from '@/components/FilterSettings.vue';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import LoadingSpinner from '@/components/layout/partials/LoadingSpinner.vue';
import { Api } from '@/Api';
import UserConversationListItem from '@/components/layout/partials/UserConversationListItem.vue';
import NewProjectModal from '@/components/NewProjectModal.vue';
dayjs.extend(utc);
dayjs.extend(timezone);

@Component({
  name: 'sidebar-left',
  components: {
    NewProjectModal,
    LoadingSpinner,
    FilterSettings,
    SelectProjectList,
    UserConversationListItem,
  },
})
export default class SidebarLeft extends mixins(BaseMixin) {
  isContentHovered = false;
  lastConversationLoading = false;
  inSearchMode = false;
  isSearchLoading = false;
  loadingConversation = '';

  async mounted() {
    if (this.project) {
      await this.loadConversations({
        projectId: this.project.id,
      });
    }
  }

  updateSearchMode(val: boolean) {
    this.inSearchMode = val;
  }

  updateSearchLoading(val: boolean) {
    this.isSearchLoading = val;
  }

  async loadMore() {
    this.lastConversationLoading = true;
    const latestConversations = this.$store.state.DataModule.conversations as InboxLog[];
    const last = latestConversations[latestConversations.length - 1].createdAt;

    const filter = (this.$refs['filtersettings'] as FilterSettings).getFilter();

    await this.$store.dispatch('DataModule/appendLastConversations', {
      ...filter,
      last,
    });
    this.lastConversationLoading = false;
  }

  async loadConversations(dto: GetLastConversationsDto) {
    if (!this.isLiveMode) {
      await this.$store.dispatch('DataModule/clearConversations');
      this.isSearchLoading = true;
    }

    await this.$store.dispatch('DataModule/fetchConversations', dto);
    this.isSearchLoading = false;
  }

  getConversations(): Interaction[] {
    return this.$store.state.DataModule.conversations;
  }

  @Watch('$route')
  async onRouteChange() {
    if (this.$route.name === 'conversation') {
      await this.selectConversation();
    }
  }

  async handleScroll(event: Event) {
    const target = event.target as HTMLElement;

    if (!target) {
      return;
    }

    if (target.offsetHeight + target.scrollTop >= target.scrollHeight) {
      if (!this.lastConversationLoading && !this.inSearchMode) {
        await this.loadMore();
      }
    }
  }
}
</script>
<style lang="scss"></style>
