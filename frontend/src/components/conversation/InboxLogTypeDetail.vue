<template>
  <div>
    <div>
      <div class="flex flex-col">
        <div
          class="pl-3 pr-7 py-2.5 flex items-center relative cursor-pointer"
          @click="expanded = !expanded"
        >
          <div
            v-html="getIcon(log.type)"
            class="w-6 h-6 flex-shrink-0 p-1.5 bg-jovo-blue text-white rounded-full inline-flex items-center justify-center"
          ></div>
          <span class="ml-3 text-sm"> {{ log.type }} </span>
          <div
            class="absolute top-0 right-3 bottom-0 flex items-center justify-center transform"
            :class="[!expanded ? 'rotate-0' : 'rotate-180']"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="transition-transform transform duration-300 w-4 h-4 text-gray-400 rotate-0"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="p-3 pt-0" v-if="expanded">
      <div
        class="bg-gray-50 overflow-x-hidden p-3 rounded-lg"
        aria-hidden="true"
        :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
        @mouseenter="isContentHovered = true"
        @mouseleave="isContentHovered = false"
      >
        <vue-json-pretty :data="json"> </vue-json-pretty>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { InboxLog } from 'jovo-inbox-core';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { EVENT_TYPE_ICON_MAP } from '@/constants';

@Component({
  name: 'inbox-log-type-detail',
  components: { VueJsonPretty, ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ChevronUpIcon },
})
export default class InboxLogTypeDetail extends mixins(BaseMixin) {
  @Prop({ required: true, type: Object })
  log!: InboxLog;

  expanded = false;
  isContentHovered = false;

  getIcon(type: string): string {
    return EVENT_TYPE_ICON_MAP[type] || '';
  }

  get json() {
    return this.log?.payload;
  }
}
</script>
