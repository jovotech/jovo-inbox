<template>
  <div
    v-if="visible"
    class="fixed inset-0 overflow-hidden z-40"
    @keydown.esc="hide"
    @keydown.up="previous"
    @keydown.down="next"
    tabindex="0"
  >
    <div class="q">
      <section
        class="absolute inset-y-0 right-0 pl-10  flex sm:pl-16"
        aria-labelledby="slide-over-heading"
      >
        <!--
          Slide-over panel, show/hide based on slide-over state.

          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full"
        -->
        <div class="w-screen max-w-xl w-3/12">
          <div class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
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
                <h3 class="mb-1">Payload</h3>
                <div
                  class="h-96 bg-gray-50 overflow-x-hidden p-3 rounded-lg"
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
import { ArrowUpIcon, ArrowDownIcon } from 'vue-feather-icons';

@Component({
  name: 'detail-conversation-part',
  components: { VueJsonPretty, ArrowUpIcon, ArrowDownIcon },
})
export default class DetailConversationPart extends Vue {
  // @Prop({ required: true, type: Object })
  // part!: InboxLog;
  //
  // @Prop({ required: false, type: Array })
  // sessionLogs!: InboxLog[];
  //
  // @Prop()
  // visible = false;

  isContentHovered = false;

  isArrowUpEnabled = true;
  arrowUpActive = false;

  isArrowDownEnabled = true;
  arrowDownActive = false;

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
  }

  get selectedConversation(): InboxLog[] {
    return this.$store.state.DataModule.selectedUserConversations;
  }

  get json() {
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

      console.log('new index: ' + index);
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
}
</script>
<style lang="css">
.vjs-tree {
  font-size: 12px;
}
</style>
