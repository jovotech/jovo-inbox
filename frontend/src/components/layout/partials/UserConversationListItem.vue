<template>
  <li>
    <router-link
      :to="{
        name: 'conversation',
        params: { projectId: project.id, userId: requestLog.userId },
      }"
      class="group block hover:bg-gray-100 focus:bg-gray-200"
      :class="[isSelected(interaction) ? 'bg-gray-200' : '']"
    >
      <div class="px-2 py-2 sm:px-3 n flex text-xs">
        <img
          v-if="getImage(requestLog)"
          class="h-10 w-10 rounded-full ml-0.5 mr-0.5"
          :src="getImage(requestLog)"
          :title="requestLog.userId"
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
            <p class="text-sm font-medium truncate" :title="requestLog.userId">
              {{ getName(requestLog) }}
            </p>
            <div class="mr-2.5 flex-shrink-0 flex">
              <p
                v-if="loadingConversation !== requestLog.userId"
                class="inline-flex text-xs leading-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600"
                :title="lastConversationItemDate(requestLog, false)"
                :class="[isSelected(interaction) ? 'text-gray-600' : '']"
              >
                <span>
                  <span
                    v-show="isActive"
                    class="inline-block h-2 w-2 mr-0.5 rounded-full bg-green-400"
                  ></span>

                  {{ lastConversationItemDate(requestLog) }}</span
                >
              </p>
              <loading-spinner v-if="loadingConversation === requestLog.userId"></loading-spinner>
            </div>
          </div>
          <div class="mt-1q sm:flex sm:justify-between">
            <div class="sm:flex">
              <p
                class="flex items-center text-xs text-gray-400 group-hover:text-gray-500 group-focus:text-gray-600"
                :class="[isSelected(interaction) ? 'text-gray-600' : '']"
              >
                {{ lastConversationItemRequestText }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </li>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { InboxLog, Interaction } from 'jovo-inbox-core';
import { BaseMixin } from '@/mixins/BaseMixin';
import { FormatUtil, TextObject } from '@/utils/FormatUtil';
import LoadingSpinner from '@/components/layout/partials/LoadingSpinner.vue';
import dayjs from 'dayjs';

@Component({
  name: 'user-conversation-list-item',
  components: { LoadingSpinner },
})
export default class UserConversationListItem extends mixins(BaseMixin) {
  @Prop({ type: Object })
  interaction!: Interaction;
  @Prop({ type: String })
  loadingConversation!: string;

  lastConversationItemRequestText = '';

  isActive = false;

  async mounted() {
    this.lastConversationItemRequestText = await this.retrieveLastConversationItemRequestText(
      this.interaction,
    );

    this.isActive = await this.isUserActive();
  }

  get requestLog() {
    return this.getLogByType(this.interaction, 'request');
  }

  get responseLog() {
    return this.getLogByType(this.interaction, 'response');
  }

  isSelected(interaction: Interaction) {
    const selectedConversations = this.$store.state.DataModule.selectedUserConversations;
    if (
      !selectedConversations ||
      selectedConversations.length === 0 ||
      !interaction.logs ||
      interaction.logs.length === 0
    ) {
      return false;
    }
    return (
      selectedConversations[0].projectId === interaction.logs[0].projectId &&
      selectedConversations[0].userId === interaction.logs[0].userId
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

  async retrieveLastConversationItemRequestText(interaction: Interaction) {
    const responseInboxLog = this.getLogByType(interaction, 'response');
    const errorInboxLog = this.getLogByType(interaction, 'error');
    if (responseInboxLog) {
      const outputTemplate = await this.getPlatformResponseOutputTemplate(responseInboxLog);
      if (outputTemplate && outputTemplate.length > 0) {
        const lastOutput = outputTemplate[outputTemplate.length - 1];

        const str = this.getOutputText(lastOutput);

        const chunks = FormatUtil.getMessageChunks(str);

        let previewText = '';

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          if (chunk.type === 'audio') {
            previewText += '*Audio* ';
          }
          if (chunk.type === 'text') {
            previewText += (chunk as TextObject).text + ' ';
          }
          if (chunk.type === 'break') {
            previewText += '*break* ';
          }
        }

        if (previewText.length > 30) {
          return previewText.substring(0, 30) + '...';
        }

        return previewText;
      }
    }

    if (errorInboxLog) {
      return 'error';
    }

    return '...';
  }

  async isUserActive() {
    if (!this.isLiveMode || !this.responseLog) {
      return false;
    }

    const platformResponse = await this.getPlatformResponseOutputTemplate(this.responseLog);

    const notListening = platformResponse?.some((o) => o.listen === false);

    const logCreatedAt = dayjs(this.responseLog.createdAt);
    const nowMinus5Minutes = dayjs().subtract(5, 'minute');

    return !notListening && logCreatedAt.isAfter(nowMinus5Minutes);
  }
}
</script>
<style lang="scss"></style>
