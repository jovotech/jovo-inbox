<template>
  <div class="hidden lg:flex lg:flex-shrink-0">
    <div class="flex flex-col w-80">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col h-0 flex-1 border-r border-gray-200 bg-gray-50">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <!--                select-->
            <div class="w-full">
              <div class=" mt-6 relative inline-block text-left w-full">
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
                  <div class="py-1" v-if="false">
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                      >Upload app logo</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-7 mt-5">
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
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search users"
              />
            </div>
          </div>

          <div class="bg-white  sm:rounded-md w-auto m-5">
            <ul class="divide-y divide-gray-200">
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
                            class=" inline-flex text-xs leading-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600"
                            :title="lastConversationItemDate(conversation, false)"
                            :class="[isSelected(conversation) ? 'text-gray-600' : '']"
                          >
                            {{ lastConversationItemDate(conversation) }}
                          </p>
                        </div>
                      </div>
                      <div class="mt-1q sm:flex sm:justify-between">
                        <div class="sm:flex">
                          <p
                            class="flex items-center text-xs text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600"
                            :class="[isSelected(conversation) ? 'text-gray-600' : '']"
                          >
                            {{ lastConversationItemRequest(conversation).text }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
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
import { Api } from '@/Api';
import { InboxLog, JovoAppMetaData, SelectUserConversationsDto } from 'jovo-inbox-core';

import { FormatUtil } from '@/utils/FormatUtil';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'sidebar-left',
  components: {},
})
export default class SidebarLeft extends mixins(BaseMixin) {
  search = '';
  openAppPopover = false;

  async mounted() {
    try {
      if (this.$route.params.id) {
        const result = await Api.getInboxLogUserConversations({
          id: this.$route.params.id,
        });
        if (result.data?.logs.length > 0) {
          await this.$store.dispatch('DataModule/fetchUserConversations', {
            userId: result.data?.logs[0].userId,
            appId: result.data?.logs[0].appId,
          } as SelectUserConversationsDto);
        }
      } else {
        if (this.getConversations().length > 0) {
          await this.selectConversation(this.getConversations()[0]);
        }
      }
    } catch (e) {
      console.log(e);
    }
    await this.$store.dispatch('DataModule/fetchConversations', {
      appId: this.app.id,
    });
  }

  async selectConversation(inboxLog?: InboxLog) {
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
  }

  lastConversationItemDate(inboxLog: InboxLog, simple = true) {
    return FormatUtil.formatDate(inboxLog.createdAt, simple);
  }

  lastConversationItemRequest(log: InboxLog) {
    const platformRequest = this.getPlatformRequest(log);
    if (platformRequest) {
      return platformRequest.getText();
    }

    return {
      type: 'user',
      text: 'error',
    };
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
    if (this.search.length >= 2) {
      return this.$store.state.DataModule.conversations.filter((log: InboxLog) => {
        return (
          log.userId.indexOf(this.search) > -1 ||
          (this.nameMap[log.userId] && this.nameMap[log.userId].name.indexOf(this.search) > -1)
        );
      });
    }
    return this.$store.state.DataModule.conversations;
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
}
</script>
<style lang="scss"></style>
