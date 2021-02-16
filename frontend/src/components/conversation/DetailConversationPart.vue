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
        class="absolute inset-y-0 right-0 shadow-xl flex "
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
        <div class="w-screen ">
          <div class="h-full flex flex-col py-6 bg-white  overflow-y-scroll">
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
              <div class="absolute inset-0 px-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <h3>Payload</h3>
                  <chevron-down-icon
                    v-if="expandedPayload"
                    size="16"
                    class="flex-shrink-1 mr-1 cursor-pointer"
                    @click="expandedPayload = !expandedPayload"
                  ></chevron-down-icon>
                  <chevron-up-icon
                    v-else-if="!expandedPayload"
                    size="16"
                    class="flex-shrink-1 mr-1 cursor-pointer"
                    @click="expandedPayload = !expandedPayload"
                  ></chevron-up-icon>
                </div>
                <div
                  v-if="expandedPayload"
                  class="h-96 mt-2 bg-gray-50 overflow-x-hidden p-3 rounded-lg"
                  aria-hidden="true"
                  :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
                  @mouseenter="isContentHovered = true"
                  @mouseleave="isContentHovered = false"
                >
                  <vue-json-pretty :data="json"> </vue-json-pretty>
                </div>
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { InboxLog } from 'jovo-inbox-core';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons';

@Component({
  name: 'detail-conversation-part',
  components: { VueJsonPretty, ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ChevronUpIcon },
})
export default class DetailConversationPart extends Vue {
  isContentHovered = false;

  expandedPayload = true;

  isArrowUpEnabled = true;
  arrowUpActive = false;

  isArrowDownEnabled = true;
  arrowDownActive = false;

  resizeActive = false;

  get selectedInboxLog(): InboxLog | null {
    return this.$store.state.DataModule.selectedInboxLog;
  }
  get visible() {
    return !!this.selectedInboxLog;
  }

  activateButtons() {
    const index = this.selectedConversation.findIndex(
      (item: InboxLog) => item.id === this.selectedInboxLog?.id,
    );

    if (index + 1 === this.selectedConversation.length) {
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

  @Watch('selectedInboxLog', { deep: true })
  private async onSelectedInboxLogChange() {
    this.activateButtons();

    this.$nextTick(() => {
      if (this.$refs['sidebarcontainer']) {
        (this.$refs['sidebarcontainer'] as HTMLElement).focus();
      }
    });
  }

  get selectedConversation(): InboxLog[] {
    return this.$store.state.DataModule.selectedUserConversations;
  }

  get json() {
    return this.selectedInboxLog?.payload;
  }

  get sessionjson() {
    return this.selectedInboxLog?.payload;
  }

  async hide() {
    await this.$store.dispatch('DataModule/selectInboxLog', null);
    this.$emit('hide');
  }

  next() {
    this.arrowDownActive = true;
    setTimeout(async () => {
      this.arrowDownActive = false;

      const index = this.selectedConversation.findIndex(
        (item: InboxLog) => item.id === this.selectedInboxLog?.id,
      );

      if (index + 1 < this.selectedConversation.length) {
        await this.$store.dispatch(
          'DataModule/selectInboxLog',
          this.selectedConversation[index + 1],
        );
      }
      this.activateButtons();
    }, 100);
  }
  previous() {
    this.arrowUpActive = true;
    setTimeout(async () => {
      this.arrowUpActive = false;

      const index = this.selectedConversation.findIndex(
        (item: InboxLog) => item.id === this.selectedInboxLog?.id,
      );

      if (index - 1 >= 0) {
        await this.$store.dispatch(
          'DataModule/selectInboxLog',
          this.selectedConversation[index - 1],
        );
      }

      this.activateButtons();
    }, 100);
  }
  resizeStart() {
    this.resizeActive = true;
  }
  resizeEnd() {
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
}
</script>
<style lang="css">
.vjs-tree {
  font-size: 12px;
}
</style>
