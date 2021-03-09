<template>
  <li @click="$emit('select-conversation', part)">
    <a
      href="#"
      class="group block hover:bg-gray-100 focus:bg-gray-200"
      :class="[isSelected(part) ? 'bg-gray-200' : '']"
    >
      <div class="px-2 py-2 sm:px-3 n flex text-xs">
        <img
          v-if="getImage(part)"
          class="h-10 w-10 rounded-full ml-0.5 mr-0.5"
          :src="getImage(part)"
          :title="part.userId"
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
            <p class="text-sm font-medium truncate" :title="part.userId">
              {{ getName(part) }}
            </p>
            <div class="mr-2.5 flex-shrink-0 flex">
              <p
                v-if="loadingConversation !== part.userId"
                class=" inline-flex text-xs leading-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600"
                :title="lastConversationItemDate(part, false)"
                :class="[isSelected(part) ? 'text-gray-600' : '']"
              >
                <span>
                  <span
                    v-if="isUserActive(part)"
                    class="inline-block h-2 w-2 mr-0.5 rounded-full  bg-green-400"
                  ></span>

                  {{ lastConversationItemDate(part) }}</span
                >
              </p>
              <loading-spinner v-if="loadingConversation === part.userId"></loading-spinner>
            </div>
          </div>
          <div class="mt-1q sm:flex sm:justify-between">
            <div class="sm:flex">
              <p
                class="flex items-center text-xs text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600"
                :class="[isSelected(part) ? 'text-gray-600' : '']"
              >
                {{ lastConversationItemRequestText(part) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  </li>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { InboxLog } from 'jovo-inbox-core';
import { BaseMixin } from '@/mixins/BaseMixin';
import { FormatUtil } from '@/utils/FormatUtil';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/layout/partials/LoadingSpinner.vue';

@Component({
  name: 'user-conversation-list-item',
  components: { LoadingSpinner },
})
export default class UserConversationListItem extends mixins(BaseMixin) {
  @Prop({ type: Object })
  part!: InboxLog;
  @Prop({ type: String })
  loadingConversation!: string;

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

  getName(conversation: InboxLog) {
    if (this.nameMap[conversation.userId] && this.nameMap[conversation.userId].name) {
      return this.nameMap[conversation.userId].name;
    }
    return this.shortenUserId(conversation);
  }

  lastConversationItemDate(inboxLog: InboxLog, simple = true) {
    return FormatUtil.formatDate(inboxLog.createdAt, simple);
  }

  lastConversationItemRequestText(log: InboxLog) {
    const platformResponse = this.getPlatformResponse(log);
    if (platformResponse) {
      const out = platformResponse.getOutput();
      const str = FormatUtil.formatMessageSimple(out[out.length - 1].text);

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
      const logCreatedAt = dayjs(log.createdAt);
      const nowMinus5Minutes = dayjs().subtract(5, 'minute');
      return !platformResponse.hasSessionEnded() && logCreatedAt.isAfter(nowMinus5Minutes);
    }

    return false;
  }
}
</script>
<style lang="scss"></style>
