<template>
  <div class="inline-flex flex-col max-w-3/4">
    <div class="flex text-center items-start justify-start flex-shrink-0">
      <div class="mr-2">
        <img
          v-if="getImage(part)"
          class="h-10 w-10 rounded-full"
          :src="getImage(part)"
          :title="part.userId"
          alt=""
        />
        <svg v-else class="h-auto w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <div
        v-if="printRequest(part).type === 'user'"
        class="py-2 px-4 inline text-sm bg-jovo-blue self-start text-right text-white rounded-xl"
      >
        <p class="font-sans leading-6 whitespace-pre-wrap ">
          {{ printRequest(part).text }}
        </p>
      </div>
      <div
        v-else-if="printRequest(part).type === 'platform'"
        class="py-2 px-1 inline text-sm  self-start text-right text-gray-400 italic rounded-xl"
      >
        <p
          class="font-sans leading-6 whitespace-pre-wrap text-left"
          @click="isErrorCollapsed = !isErrorCollapsed"
        >
          {{ printRequest(part).text }}
          <a
            v-if="printRequest(part).subtext"
            href="#"
            class="whitespace-nowrap font-medium text-gray-400 ml-2 hover:text-gray-500"
          >
            <chevron-down-icon
              v-if="!isErrorCollapsed"
              size="16"
              class="inline
"
            ></chevron-down-icon
            ><chevron-up-icon
              v-if="isErrorCollapsed"
              size="16"
              class="inline
"
            ></chevron-up-icon
          ></a>
        </p>
        <span v-if="isErrorCollapsed" class="text-left text-xs block px-1 ">
          {{ printRequest(part).subtext }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import ScreenConversationPart from '@/components/conversation/ScreenConversationPart.vue';
import { InboxLog, JovoInboxPlatformRequest } from 'jovo-inbox-core';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, MonitorIcon, UserIcon } from 'vue-feather-icons';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Plyr from 'plyr';
import 'plyr/src/sass/plyr.scss';
import { FormatUtil } from '@/utils/FormatUtil';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'request-part',
  components: {
    DetailConversationPart,
    MonitorIcon,
    CodeIcon,
    ScreenConversationPart,
    UserIcon,
    ChevronDownIcon,
    ChevronUpIcon,
  },
})
export default class RequestPart extends mixins(BaseMixin) {
  @Prop({ required: true, type: Object })
  part!: InboxLog;

  platformRequest: JovoInboxPlatformRequest | undefined;

  isErrorCollapsed = false;

  printRequest(log: InboxLog) {
    this.platformRequest = this.getPlatformRequest(log);
    if (this.platformRequest) {
      return this.platformRequest.getText();
    }

    return {
      type: 'user',
      text: 'error',
    };
  }
}
</script>
<style lang="postcss"></style>
