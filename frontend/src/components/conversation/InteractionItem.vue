<template>
  <div @click="openDetailView(interaction)">
    <div
      class="relative rounded-lg my-4 py-4 px-2 hover:bg-gray-50"
      :class="[isInteractionDetailView(interaction) ? 'bg-gray-50 shadow-sm' : 'bg-transparent']"
    >
      <div
        v-if="isInteractionDetailView(interaction)"
        class="absolute absolute top-1/2 -right-8 transform -translate-y-1/2 text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-8 h-8"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
      <div
        ref="conversation-part"
        class="group w-full flex-grow inline-flex flex-col rounded-l border-transparent focus:outline-none"
        :class="[getLogByType(interaction, 'request') ? 'mt-8' : '']"
        tabindex="0"
      >
        <request-part :part="getLogByType(interaction, 'request')" />
      </div>

      <div
        v-if="getLogByType(interaction, 'response')"
        ref="conversation-part"
        class="group w-full flex-grow inline-flex flex-col rounded-l border-transparent focus:outline-none"
        tabindex="0"
      >
        <response-part :part="getLogByType(interaction, 'response')" class="ml-auto justify-end" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import ConversationPart from '@/components/conversation/ConversationPart.vue';
import { InboxLog, Interaction } from 'jovo-inbox-core';
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons';
import UserSessions from '@/components/conversation/UserSessions.vue';
import RequestPart from '@/components/conversation/RequestPart.vue';
import ResponsePart from '@/components/conversation/ResponsePart.vue';

@Component({
  name: 'interaction-item',
  components: {
    ResponsePart,
    RequestPart,
    UserSessions,
    ConversationPart,
    DetailConversationPart,
    ChevronDownIcon,
    ChevronUpIcon,
  },
})
export default class InteractionItem extends mixins(BaseMixin) {
  @Prop({ required: true }) interaction!: Interaction;
  async openDetailView(interaction: Interaction) {
    if (interaction.requestId === this.selectedInteraction?.requestId) {
      await this.$store.dispatch('DataModule/selectInteraction', null);
    } else {
      await this.$store.dispatch('DataModule/selectInteraction', interaction);
    }
  }

  getLogByType(interaction: Interaction, type: string) {
    return interaction.logs.find((item: InboxLog) => item.type === type);
  }

  isInteractionDetailView(interaction: Interaction) {
    return interaction.requestId === this.selectedInteraction?.requestId;
  }
}
</script>
