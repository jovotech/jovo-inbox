<template>
  <div
    class="hidden lg:flex lg:flex-shrink-0"
    @mouseenter="isContentHovered = true"
    @mouseleave="isContentHovered = false"
  >
    <div class="flex flex-col w-80">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col h-0 flex-1 border-r border-gray-200 bg-gray-50">
        <div
          class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto"
          :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
        >
          <div class="flex items-center flex-shrink-0 px-3">
            <div class="w-full">
              <select-app-list @select-conversation="selectConversation"></select-app-list>
            </div>
          </div>
          <div class="px-3 my-3.5">
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
                :part="conversation"
                :loadingConversation="loadingConversation"
              ></user-conversation-list-item>

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
import { GetLastConversationsDto, InboxLog } from 'jovo-inbox-core';

import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import SelectAppList from '@/components/SelectAppList.vue';
import FilterSettings from '@/components/FilterSettings.vue';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import LoadingSpinner from '@/components/layout/partials/LoadingSpinner.vue';
import { Api } from '@/Api';
import UserConversationListItem from '@/components/layout/partials/UserConversationListItem.vue';
dayjs.extend(utc);
dayjs.extend(timezone);
@Component({
  name: 'sidebar-left',
  components: { LoadingSpinner, FilterSettings, SelectAppList, UserConversationListItem },
})
export default class SidebarLeft extends mixins(BaseMixin) {
  isContentHovered = false;
  lastConversationLoading = false;
  inSearchMode = false;
  isSearchLoading = false;
  loadingConversation = '';

  async mounted() {
    await this.loadConversations({
      appId: this.app.id,
    });
    try {
      if (this.$route.params.id) {
        const result = await Api.getInboxLogUserConversations({
          id: this.$route.params.id,
          appId: this.app.id,
        });
        if (result.data?.logs.length > 0) {
          // TODO: selection of user doesn't work properly with many users
          // await this.selectConversation(result.data?.logs[0]);
        }
      }
    } catch (e) {
      console.log(e);
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

  getConversations(): InboxLog[] {
    return this.$store.state.DataModule.conversations;
  }

  @Watch('$route')
  async onRouteChange() {
    if (this.$route.name === 'conversation') {
      await this.selectConversation();
    }
  }

  async selectConversation() {
    await this.$store.dispatch('DataModule/fetchUserConversations', {
      userId: this.$route.params.userId,
      appId: this.$route.params.appId,
    });
  }

  // TODO do we need this?
  // async selectConversation(inboxLog?: InboxLog) {
  //   this.loadingConversation = inboxLog?.userId || '';
  //   if (inboxLog) {
  //     await this.$store.dispatch('DataModule/fetchUserConversations', {
  //       userId: inboxLog.userId,
  //       appId: inboxLog.appId,
  //     });
  //   } else {
  //     if (this.getConversations().length > 0) {
  //       await this.$store.dispatch('DataModule/fetchUserConversations', {
  //         userId: this.getConversations()[0].userId,
  //         appId: this.getConversations()[0].appId,
  //       });
  //     }
  //   }
  //   this.$router
  //     .push({
  //       name: 'conversation',
  //       params: {
  //         userId: inboxLog?.userId || '',
  //         appId: this.app.id,
  //       },
  //     })
  //     .catch(() => {
  //       //
  //     });
  //   this.loadingConversation = '';
  // }

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
