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
          <div class="flex items-center flex-shrink-0 px-4">
            <div class="w-full ">
              <div class=" relative inline-block text-left w-full">
                <div>
                  <button
                    @click="open"
                    type="button"
                    ref="button"
                    class="group w-full bg-gray-50 rounded-md px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500"
                    id="options-menu"
                    aria-haspopup="true"
                  >
                    <span class="flex w-full justify-between items-center">
                      <span class="flex min-w-0 items-center justify-between space-x-3">
                        <div
                          v-if="false"
                          class="rounded-full h-10 w-10 flex items-center justify-center bg-jovo-blue"
                        ></div>
                        <span class="flex-1 min-w-0">
                          <span class="text-gray-900 text-sm font-medium truncate">{{
                            app.name
                          }}</span>
                        </span>
                      </span>
                      <svg
                        class="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        x-description="Heroicon name: solid/selector"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
                <div
                  v-if="openAppPopover"
                  class="z-40 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200"
                  role="menu"
                  ref="popover"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div
                    class="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto scrollbar focus:outline-none sm:text-sm"
                  >
                    <a
                      v-for="a in apps"
                      v-bind:key="a.id"
                      @click="selectApp(a)"
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 group text-gray-900 cursor-default select-none relative pl-3 pr-9 hover:bg-primary-600 hover:text-white"
                      role="menuitem"
                      >{{ a.name }}

                      <span
                        v-if="a.id === app.id"
                        class="text-primary-600 group-hover:text-jovo-blue absolute inset-y-0 right-0 flex items-center pr-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          class="inline h-4 w-4"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    </a>
                  </div>
                  <div class="py-1">
                    <div
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex justify-between items-center"
                      role="menuitem"
                    >
                      <span>Live Mode</span>
                      <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
                      <button
                        type="button"
                        @click="toggleLiveMode"
                        class="ml-3 relative inline-flex flex-shrink-0 h-4 w-6 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-pressed="false"
                        aria-labelledby="annual-billing-label"
                        :class="[isLiveMode ? 'bg-indigo-600' : 'bg-gray-200']"
                      >
                        <span class="sr-only">Use setting</span>
                        <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
                        <span
                          aria-hidden="true"
                          class="pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                          :class="[isLiveMode ? 'translate-x-2' : 'translate-x-0']"
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-5 my-5">
            <label for="search" class="sr-only">Search</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                aria-hidden="true"
              >
                <!-- Heroicon name: search -->
                <svg
                  class="mr-3 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                v-model="search"
                @change="handleSearch"
                @keydown="handleSearch"
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search users"
              />

              <div
                class="absolute inset-y-0 right-0 pl-3 flex items-center  text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-hidden="true"
                @click="openFilterPopover = !openFilterPopover"
              >
                <!-- Heroicon name: search -->
                <svg
                  class="mr-3 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div
                v-if="openFilterPopover"
                class="z-40 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200"
                role="menu"
                ref="popover"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div class="py-1">
                  <div
                    @click="handleFilterSelectedWithErrors()"
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex justify-between items-center"
                    role="menuitem"
                  >
                    <span>Conversations with errors</span>
                    <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
                    <span
                      v-if="filterSelectedWithErrors"
                      class="text-primary-600 group-hover:text-jovo-blue flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        class="inline h-4 w-4"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="py-1">
                  <div
                    v-for="platform in filterPlatforms"
                    v-bind:key="platform"
                    @click="handleFilterSelectedPlatform(platform)"
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex justify-between items-center"
                    role="menuitem"
                  >
                    <span>{{ platform }}</span>
                    <span
                      v-if="platform == filterSelectedPlatform"
                      class="text-primary-600 group-hover:text-jovo-blue flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        class="inline h-4 w-4"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-white  sm:rounded-md w-auto flex-1 flex flex-col overflow-y-auto"
            :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
            @scroll="handleScroll"
          >
            <ul class="divide-y divide-gray-200">
              <li class="text-center justify-center" :class="[!searchLoading ? 'hidden' : '']">
                <svg
                  class="animate-spin h-5 w-5 text-jovo-blue mt-2 mb-2 m-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </li>
              <li
                v-for="conversation in getConversations()"
                v-bind:key="conversation.id"
                @click="selectConversation(conversation)"
              >
                <a
                  href="#"
                  class="group block hover:bg-gray-100 focus:bg-gray-200"
                  :class="[isSelected(conversation) ? 'bg-gray-200' : '']"
                >
                  <div class="px-2 py-2 sm:px-3 flex text-xs">
                    <img
                      v-if="getImage(conversation)"
                      class="h-10 w-10 rounded-full"
                      :src="getImage(conversation)"
                      :title="conversation.userId"
                      alt=""
                    />
                    <svg
                      v-else
                      class="h-auto w-14 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"
                      />
                    </svg>

                    <div class="w-full ml-2">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium truncate" :title="conversation.userId">
                          {{ getName(conversation) }}
                        </p>
                        <div class="ml-2 flex-shrink-0 flex">
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
                          <svg
                            v-if="loadingConversation === conversation.userId"
                            class="animate-spin  h-5 w-5 text-jovo-blue self-center"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
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
                class="text-center justify-center"
                :class="[lastConversationLoading ? 'visible' : 'invisible']"
              >
                <svg
                  class="animate-spin h-5 w-5 text-jovo-blue mt-2 m-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
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
import {
  GetInboxLogUserDto,
  GetLastConversationsDto,
  InboxLog,
  JovoAppMetaData,
} from 'jovo-inbox-core';

import { FormatUtil } from '@/utils/FormatUtil';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import { Api } from '@/Api';

@Component({
  name: 'sidebar-left',
  components: {},
})
export default class SidebarLeft extends mixins(BaseMixin) {
  search = '';
  openAppPopover = false;
  openFilterPopover = false;
  loadingConversation: string | undefined = '';
  isContentHovered = false;
  interval?: number;
  searchTimeout?: number;
  lastConversationLoading = false;
  searchLoading = false;

  filterPlatforms = [];
  filterSelectedPlatform?: string;
  filterSelectedWithErrors = false;

  async mounted() {
    await this.loadConversations();

    const response = await Api.getAppPlatforms(this.app.id);
    this.filterPlatforms = response.data;
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

  async handleFilter() {
    this.openFilterPopover = false;
    await this.loadConversations();
  }

  @Watch('filterSelectedWithErrors')
  async watchFilterSelectedWithErrors() {
    await this.loadConversations();
  }

  async handleFilterSelectedWithErrors() {
    this.filterSelectedWithErrors = !this.filterSelectedWithErrors;
    await this.handleFilter();
  }

  async handleFilterSelectedPlatform(platform: string) {
    if (platform === this.filterSelectedPlatform) {
      this.filterSelectedPlatform = undefined;
    } else {
      this.filterSelectedPlatform = platform;
    }
    await this.handleFilter();
  }

  async loadConversations() {
    const dto: GetLastConversationsDto = {
      appId: this.app.id,
      withErrors: this.filterSelectedWithErrors,
      platform: this.filterSelectedPlatform,
    };

    await this.$store.dispatch('DataModule/fetchConversations', dto);
    // try {
    //   if (this.$route.params.id) {
    //     const result = await Api.getInboxLogUserConversations({
    //       id: this.$route.params.id,
    //     });
    //     if (result.data?.logs.length > 0) {
    //       await this.$store.dispatch('DataModule/fetchUserConversations', {
    //         userId: result.data?.logs[0].userId,
    //         appId: result.data?.logs[0].appId,
    //       } as SelectUserConversationsDto);
    //     }
    //   } else {
    //     if (this.getConversations().length > 0) {
    //       await this.selectConversation(this.getConversations()[0]);
    //     }
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  }

  async selectConversation(inboxLog?: InboxLog) {
    this.loadingConversation = inboxLog?.userId;
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
    this.loadingConversation = undefined;
  }

  lastConversationItemDate(inboxLog: InboxLog, simple = true) {
    return FormatUtil.formatDate(inboxLog.createdAt, simple);
  }

  lastConversationItemRequestText(log: InboxLog) {
    // const platformRequest = this.getPlatformRequest(log);
    // if (platformRequest) {
    //   return platformRequest.getText();
    // }

    const platformResponse = this.getPlatformResponse(log);
    if (platformResponse) {
      const str = FormatUtil.formatMessageSimple(platformResponse.getSpeech().text);

      if (str.length > 30) {
        return str.substring(0, 30) + '...';
      }

      return str;
    }

    return '...';
  }

  isUserActive(log: InboxLog): boolean {
    if (!this.isLiveMode) {
      return false;
    }

    const platformResponse = this.getPlatformResponse(log);
    if (platformResponse) {
      const logCreatedAt = new Date(log.createdAt).getTime();
      const now = new Date().getTime();
      const lessThan5Minutes = logCreatedAt > now - 5 * 60 * 1000;
      // TODO:
      return !platformResponse.hasSessionEnded();
    }

    return false;
  }

  isSelected(inboxLog: InboxLog) {
    const selectedConversations = this.$store.state.DataModule.selectedUserConversations;
    if (!selectedConversations || selectedConversations.length === 0) {
      return false;
    }
    return (
      selectedConversations[0].appId === inboxLog.appId &&
      selectedConversations[0].userId === inboxLog.userId
    );
  }

  onClick(event: MouseEvent) {
    if (
      event.target &&
      (this.$refs.button as HTMLButtonElement | undefined)?.contains(event.target as HTMLElement)
    ) {
      return;
    }
    if (!this.openAppPopover || !event.target || !this.$refs.popover) return;
    if (!(this.$refs.popover as HTMLElement).contains(event.target as HTMLElement)) {
      this.close();
    }
  }

  open() {
    this.openAppPopover = true;
    this.$emit('open');
    document.body.addEventListener('click', this.onClick);
  }

  close() {
    this.openAppPopover = false;
    this.$emit('close');
    document.body.removeEventListener('click', this.onClick);
  }

  getConversations(): InboxLog[] {
    // if (this.search.length >= 2) {
    //   return this.$store.state.DataModule.conversations.filter((log: InboxLog) => {
    //     return (
    //       log.userId.indexOf(this.search) > -1 ||
    //       (this.nameMap[log.userId] &&
    //         this.nameMap[log.userId].name.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    //     );
    //   });
    // }
    return this.$store.state.DataModule.conversations;
  }

  async handleSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(async () => {
      this.searchLoading = true;

      await this.$store.dispatch('DataModule/fetchConversations', {
        appId: this.app.id,
        search: this.search,
      });
      this.searchLoading = false;
    }, 500);
  }

  async selectApp(app: JovoAppMetaData) {
    await this.$store.dispatch('DataModule/selectApp', app);
    await this.$store.dispatch('DataModule/fetchConversations', {
      appId: app.id,
    });

    await this.selectConversation();
    this.close();
  }

  getName(conversation: InboxLog) {
    if (this.nameMap[conversation.userId] && this.nameMap[conversation.userId].name) {
      return this.nameMap[conversation.userId].name;
    }
    return this.shortenUserId(conversation);
  }

  async handleScroll(el: any) {
    if (el.srcElement.offsetHeight + el.srcElement.scrollTop >= el.srcElement.scrollHeight) {
      if (!this.lastConversationLoading && this.search.length === 0) {
        await this.loadMore();
      }
    }
  }
  async toggleLiveMode() {
    const val = !this.isLiveMode;
    await this.$store.dispatch('PreferencesModule/updateLiveMode', val);
  }

  @Watch('isLiveMode')
  async watchLiveMode() {
    if (this.isLiveMode) {
      this.interval = window.setInterval(async () => {
        await this.loadConversations();
      }, 5000);
    } else {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  }
}
</script>
<style lang="scss"></style>
