<template>
  <div
    v-if="visible"
    class="fixed inset-0 overflow-hidden z-40 bg-opacityblack"
    @keydown.esc="hide"
    @keydown.up="previous"
    @keydown.down="next"
    tabindex="0"
    ref="sidebarcontainer"
    @mousemove="move"
    @mouseup="resizeEnd"
    @click="close"
  >
    <div class="flex flex-row bg-gray-50">
      <section
        ref="sidebar"
        class="absolute inset-y-0 right-0 shadow-xl flex"
        style="width: 450px"
        aria-labelledby="slide-over-heading"
      >
        <div
          class="w-6 cursor-col-resize flex sm:items-center bg-gray-50 hover:bg-gray-100"
          @mousedown="resizeStart"
        >
          <svg
            class="h-4 w-4 text-gray-600 pointer-events-none"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5h2v14H8zM14 5h2v14h-2z"></path>
          </svg>
        </div>
        <div class="w-screen">
          <div class="h-full flex flex-col py-6 bg-white overflow-y-scroll">
            <div class="px-4 sm:px-6">
              <div class="flex items-start justify-between">
                <h2 id="slide-over-heading" class="text-lg font-medium text-gray-900">
                  Detail View
                </h2>
                <div class="ml-3 h-7 flex items-center">
                  <button
                    class="bg-white shadow rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-2 p-1.5 text-sm mr-1"
                    @click="previous"
                    :class="[
                      arrowUpActive
                        ? 'outline-none ring-2 ring-offset-2 ring-indigo-500 border-2 mt-0.5 shadow-none'
                        : '',
                      isArrowUpEnabled ? '' : 'opacity-40',
                    ]"
                    :disabled="!isArrowUpEnabled"
                  >
                    <arrow-up-icon size="16"></arrow-up-icon>
                  </button>
                  <button
                    class="bg-white shadow rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-2 p-1.5 text-sm mr-1"
                    :class="[
                      arrowDownActive
                        ? 'outline-none ring-2 ring-offset-2 ring-indigo-500 border-2 mt-0.5 shadow-none'
                        : '',
                      isArrowDownEnabled ? '' : 'opacity-40',
                    ]"
                    :disabled="!isArrowDownEnabled"
                    @click="next"
                  >
                    <arrow-down-icon size="16"></arrow-down-icon>
                  </button>

                  <button
                    class="bg-white shadow rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-2 p-1 text-sm"
                    @click="hide"
                  >
                    ESC
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-6 relative flex-1 px-4 sm:px-6">
              <!-- Replace with your content -->
              <div
                v-for="log in selectedInteraction.logs"
                v-bind:key="log.id"
                class="bg-white shadow rounded-lg divide-y divide-gray-200 border mb-4"
              >
                <inbox-log-type-detail :log="log"></inbox-log-type-detail>
              </div>
              <!-- /End replace -->
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { InboxLog, Interaction } from 'jovo-inbox-core';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { EVENT_TYPE_ICON_MAP } from '@/constants';
import InboxLogTypeDetail from '@/components/conversation/InboxLogTypeDetail.vue';

@Component({
  name: 'detail-conversation-part',
  components: {
    InboxLogTypeDetail,
    VueJsonPretty,
    ArrowUpIcon,
    ArrowDownIcon,
    ChevronDownIcon,
    ChevronUpIcon,
  },
})
export default class DetailConversationPart extends mixins(BaseMixin) {
  isArrowUpEnabled = true;
  arrowUpActive = false;

  isArrowDownEnabled = true;
  arrowDownActive = false;

  resizeActive = false;

  get selectedInboxLog(): InboxLog | null {
    return this.$store.state.DataModule.selectedInboxLog;
  }
  get visible() {
    return !!this.selectedInteraction;
  }

  activateButtons() {
    const index = this.interactions.findIndex(
      (item: Interaction) => item.requestId === this.selectedInteraction?.requestId,
    );

    if (index + 1 === this.interactions.length) {
      this.isArrowDownEnabled = false;
    } else {
      this.isArrowDownEnabled = true;
    }

    if (index - 1 < 0) {
      this.isArrowUpEnabled = false;
    } else {
      this.isArrowUpEnabled = true;
    }
  }

  @Watch('selectedInteraction', { deep: true })
  private async onSelectedInteractionChange() {
    this.activateButtons();

    this.$nextTick(async () => {
      if (this.$refs['sidebarcontainer']) {
        (this.$refs['sidebarcontainer'] as HTMLElement).focus();
      }
    });
  }

  get selectedConversation(): InboxLog[] {
    return this.$store.state.DataModule.selectedUserConversations;
  }

  async hide() {
    await this.$store.dispatch('DataModule/selectInteraction', null);
    this.$emit('hide');
  }

  next() {
    this.arrowDownActive = true;
    setTimeout(async () => {
      this.arrowDownActive = false;

      const index = this.interactions.findIndex(
        (item: Interaction) =>
          new Date(item.start).getTime() ===
          new Date(this.selectedInteraction?.start || new Date()).getTime(),
      );

      if (index + 1 < this.interactions.length) {
        await this.$store.dispatch('DataModule/selectInteraction', this.interactions[index + 1]);
      }
      this.activateButtons();
    }, 100);
  }
  previous() {
    this.arrowUpActive = true;
    setTimeout(async () => {
      this.arrowUpActive = false;

      const index = this.interactions.findIndex(
        (item: Interaction) => item.requestId === this.selectedInteraction?.requestId,
      );

      if (index - 1 >= 0) {
        await this.$store.dispatch('DataModule/selectInteraction', this.interactions[index - 1]);
      }

      this.activateButtons();
    }, 100);
  }
  resizeStart() {
    this.resizeActive = true;
  }
  async resizeEnd() {
    if (this.resizeActive) {
      this.resizeActive = false;
    }
  }
  move(evt: MouseEvent) {
    if (!this.resizeActive) {
      return;
    }
    const screenWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    const sidebarWidth = screenWidth - evt.x;
    const sidebarElement = this.$refs['sidebar'] as HTMLElement;
    sidebarElement.style.width = sidebarWidth + 'px';
  }

  close(event: MouseEvent) {
    if (!(this.$refs.sidebar as HTMLElement).contains(event.target as HTMLElement)) {
      this.hide();
    }
  }

  getIcon(type: string): string {
    return EVENT_TYPE_ICON_MAP[type] || '';
  }
}
</script>
<style lang="css">
.vjs-tree {
  font-size: 12px;
}
</style>
