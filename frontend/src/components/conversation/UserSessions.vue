<template>
  <div>
    <span
      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 mx-1"
    >
      {{ getSessionInteractions(index) }} interactions
    </span>

    <span
      v-if="getSessionErrors(index) > 0"
      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mx-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        class="h-2 w-2 mr-1 text-red-400"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        ></path>
      </svg>
      has errors
    </span>

    <span class="text-center">
      <chevron-down-icon
        size="14"
        v-if="!expandedSessions[part.sessionId]"
        class="inline cursor-pointer"
      ></chevron-down-icon>
      <chevron-up-icon size="14" v-else class="inline cursor-pointer"></chevron-up-icon>
    </span>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import { InboxLog, InboxLogType } from 'jovo-inbox-core';

@Component({
  name: 'user-sessions',
  components: {},
})
export default class UserSessions extends mixins(BaseMixin) {}
</script>
<style lang="postcss"></style>
