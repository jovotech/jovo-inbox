<template>
  <div class="rounded-md bg-red-50 p-4 m-auto w-5/6 text-sm mb-6 border-2 border-red-800">
    <div class="flex">
      <div class="flex-shrink-0">
        <!-- Heroicon name: solid/x-circle -->
        <svg
          class="h-5 w-5 text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3 flex-1 md:flex md:justify-between">
        <p class="text-sm text-red-800">An error has occurred.</p>
        <p class="mt-3 text-sm md:mt-0 md:ml-6">
          <a
            @click="isErrorCollapsed = !isErrorCollapsed"
            href="#"
            class="whitespace-nowrap font-medium text-red-700 hover:text-red-800"
            >Details
            <chevron-down-icon v-if="!isErrorCollapsed" size="16" class="inline"></chevron-down-icon
            ><chevron-up-icon v-if="isErrorCollapsed" size="16" class="inline"></chevron-up-icon
          ></a>
        </p>
      </div>
    </div>
    <div v-if="isErrorCollapsed" class="flex-1 md:flex md:justify-between p-3">
      <p class="text-xs text-red-800">
        {{ part.payload.message }}
        <br /><br />
        {{ part.payload.stackTrace }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import ScreenConversationPart from '@/components/conversation/ScreenConversationPart.vue';
import { InboxLog } from '@jovotech/inbox-core';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, MonitorIcon, UserIcon } from 'vue-feather-icons';
import { Component, Prop } from 'vue-property-decorator';
import 'plyr/src/sass/plyr.scss';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'error-part',
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
export default class ErrorPart extends mixins(BaseMixin) {
  @Prop({ required: true, type: Object })
  part!: InboxLog;

  isErrorCollapsed = false;
}
</script>
<style lang="postcss"></style>
