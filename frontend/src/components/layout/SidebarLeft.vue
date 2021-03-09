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
            <div class="w-full ">
              <select-app-list @selectConversation="selectConversation"></select-app-list>
            </div>
          </div>
          <div class="px-3 my-3.5">
            <filter-settings
              @loadConversations="loadConversations"
              @updateSearchMode="updateSearchMode"
              @updateSearchLoading="updateSearchLoading"
            ></filter-settings>
          </div>
          <div
            class="bg-white  w-auto ml-1 flex-1 flex flex-col overflow-y-auto"
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
                @select-conversation="selectConversation"
              ></user-conversation-list-item>

              <li v-if="false">
                <a
                  href="#"
                  class="group block hover:bg-gray-100 focus:bg-gray-200"
                  :class="[isSelected(conversation) ? 'bg-gray-200' : '']"
                >
                  <div class="px-2 py-2 sm:px-3 n flex text-xs">
                    <img
                      v-if="getImage(conversation)"
                      class="h-10 w-10 rounded-full ml-0.5 mr-0.5"
                      :src="getImage(conversation)"
                      :title="conversation.userId"
                      alt=""
                    />
                    <span v-else class="h-auto w-14">
                      <svg class="text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>

                    <div class="w-full ml-2 mt-0.5">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium truncate" :title="conversation.userId">
                          {{ getName(conversation) }}
                        </p>
                        <div class="mr-2.5 flex-shrink-0 flex">
                          <p
                            v-if="loadingConversation !== conversation.userId"
                            class=" inline-flex text-xs leading-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600"
                            :title="lastConversationItemDate(conversation, false)"
                            :class="[isSelected(conversation) ? 'text-gray-600' : '']"
                          >
                            <span>
                              <span
                                v-if="isUserActive(conversation)"
                                class="inline-block h-2 w-2 mr-0.5 rounded-full  bg-green-400"
                              ></span>

                              {{ lastConversationItemDate(conversation) }}</span
                            >
                          </p>
                          <loading-spinner
                            v-if="loadingConversation === conversation.userId"
                          ></loading-spinner>
                        </div>
                      </div>
                      <div class="mt-1q sm:flex sm:justify-between">
                        <div class="sm:flex">
                          <p
                            class="flex items-center text-xs text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600"
                            :class="[isSelected(conversation) ? 'text-gray-600' : '']"
                          >
                            {{ lastConversationItemRequestText(conversation) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
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
import { Component } from 'vue-property-decorator';
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
          await this.selectConversation(result.data?.logs[0]);
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

    await this.$store.dispatch('DataModule/appendLastConversations', {
      appId: this.app.id,
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

  async selectConversation(inboxLog?: InboxLog) {
    this.loadingConversation = inboxLog?.userId || '';
    if (inboxLog) {
      await this.$store.dispatch('DataModule/fetchUserConversations', {
        userId: inboxLog.userId,
        appId: inboxLog.appId,
      });
    } else {
      if (this.getConversations().length > 0) {
        await this.$store.dispatch('DataModule/fetchUserConversations', {
          userId: this.getConversations()[0].userId,
          appId: this.getConversations()[0].appId,
        });
      }
    }
    this.loadingConversation = '';
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
