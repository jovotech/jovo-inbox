<template>
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
              <span class="text-gray-900 text-sm font-medium truncate">{{ app.name }}</span>
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
      v-if="opened"
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
    </div>
  </div>
</template>
<script lang="ts">
import { JovoAppMetaData } from 'jovo-inbox-core';
import Component, { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';

@Component({
  name: 'select-app-list',
  components: {},
})
export default class SelectAppList extends mixins(BaseMixin) {
  opened = false;

  open() {
    if (this.opened) {
      this.close();
      return;
    }
    this.opened = true;
    document.body.addEventListener('click', this.onClick);
  }
  close() {
    this.opened = false;
    document.body.removeEventListener('click', this.onClick);
  }
  onClick(event: MouseEvent) {
    if (
      event.target &&
      (this.$refs.button as HTMLButtonElement | undefined)?.contains(event.target as HTMLElement)
    ) {
      return;
    }
    if (!this.opened || !event.target || !this.$refs.popover) return;
    if (!(this.$refs.popover as HTMLElement).contains(event.target as HTMLElement)) {
      this.close();
    }
  }
  async selectApp(app: JovoAppMetaData) {
    await this.$store.dispatch('DataModule/selectApp', app);
    await this.$store.dispatch('DataModule/fetchConversations', {
      appId: app.id,
    });

    this.close();
    this.$emit('selectConversation');
  }
}
</script>
