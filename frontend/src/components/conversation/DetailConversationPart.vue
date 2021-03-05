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

                <div v-if="hasApl" class="flex items-center justify-between mt-6">
                  <h3>{{ deviceName }}</h3>
                </div>
                <div class="mt-5 qbg-gray-50 overflow-x-hidden" aria-hidden="true">
                  <div class="w-full" ref="apl-parent">
                    <div id="aplviewer" ref="apl-viewer"></div>
                  </div>
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
import { Component, Watch } from 'vue-property-decorator';
import {
  AlexaRequest,
  AlexaResponse,
  InboxLog,
  InboxLogType,
  JovoInboxPlatformResponse,
} from 'jovo-inbox-core';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons';
import * as AplRenderer from 'apl-viewhost-web';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import _get from 'lodash.get';
@Component({
  name: 'detail-conversation-part',
  components: { VueJsonPretty, ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ChevronUpIcon },
})
export default class DetailConversationPart extends mixins(BaseMixin) {
  isContentHovered = false;

  expandedPayload = true;

  isArrowUpEnabled = true;
  arrowUpActive = false;

  isArrowDownEnabled = true;
  arrowDownActive = false;

  resizeActive = false;

  // TODO: temp
  hasApl = false;
  deviceName = 'Screen';

  // eslint-disable-next-line
  renderer: any;

  platformResponse: JovoInboxPlatformResponse | undefined;

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

    this.$nextTick(async () => {
      if (this.$refs['sidebarcontainer']) {
        (this.$refs['sidebarcontainer'] as HTMLElement).focus();
      }
      this.resetAplViewer();

      await this.renderApl();
    });
  }

  resetAplViewer() {
    (this.$refs['apl-viewer'] as HTMLElement).innerHTML = '';

    (this.$refs['apl-viewer'] as HTMLElement).style.width = '0';
    (this.$refs['apl-viewer'] as HTMLElement).style.height = '0';
    (this.$refs['apl-viewer'] as HTMLElement).style.background = 'none';
  }

  async renderApl() {
    // TODO: Temporary
    this.platformResponse = this.getPlatformResponse(this.selectedInboxLog);
    if (this.platformResponse) {
      if (this.platformResponse.constructor.name === 'AlexaResponse') {
        const alexaResponse = this.platformResponse as AlexaResponse;
        this.hasApl = alexaResponse.hasApl();
        const previousAlexaRequest = this.getPlatformRequest(
          this.getPreviousRequest(),
        ) as AlexaRequest;
        await this.handleRenderInit(alexaResponse, previousAlexaRequest);
      }
    } else {
      this.hasApl = false;
    }
  }

  getPreviousRequest(): InboxLog | undefined {
    const index = this.selectedConversation.findIndex(
      (item: InboxLog) => item.id === this.selectedInboxLog?.id,
    );
    for (let i = index - 1; i >= 0; i--) {
      if (this.selectedConversation[i].type === InboxLogType.REQUEST) {
        return this.selectedConversation[i];
      }
    }
  }

  async handleRenderInit(alexaResponse: AlexaResponse, previousAlexaRequest: AlexaRequest) {
    document.getElementById('aplviewer').innerHTML = '';

    const directive = alexaResponse.response.directives?.find(
      (item: Directive) => item.type === 'Alexa.Presentation.APL.RenderDocument',
    );

    const requestDpi = _get(previousAlexaRequest, 'context.Viewport.dpi', 160);
    const requestWidth = _get(previousAlexaRequest, 'context.Viewport.pixelWidth', 960);
    const requestHeight = _get(previousAlexaRequest, 'context.Viewport.pixelHeight', 480);
    const requestRatio = requestWidth / requestHeight;

    this.deviceName = previousAlexaRequest.getDeviceName();

    const doc = directive.document;
    doc.version = '1.4';
    const datasource = directive.datasources || {};
    const content = AplRenderer.Content.create(JSON.stringify(doc));
    if (content && datasource) {
      content.addData('payload', JSON.stringify(datasource));
    }

    const width = (this.$refs['apl-parent'] as HTMLElement).offsetWidth;

    const calcDpi = (width * requestDpi) / requestWidth;

    const viewPortDpi = Math.round(calcDpi);
    const viewportWidth = (viewPortDpi * requestWidth) / requestDpi;

    const viewportHeight = viewportWidth / requestRatio;

    this.renderer = AplRenderer.default.create({
      content: content /* return value of the AplRenderer.Content.create call */,
      view: document.getElementById(
        'aplviewer',
      ) /* element where the APL document should be rendered to */,
      environment: {
        agentName: 'APL Sandbox',
        agentVersion: '1.0',
        allowOpenUrl: true,
        disallowVideo: false,
      },
      viewport: {
        width: viewportWidth,
        height: viewportHeight,
        dpi: viewPortDpi,
      },
      theme: 'dark',
      developerToolOptions: {
        mappingKey: 'auth-id',
        writeKeys: ['auth-banana', 'auth-id'],
      },
      utcTime: Date.now(),
      localTimeAdjustment: -new Date().getTimezoneOffset() * 60 * 1000,
    });

    await this.renderer.init();
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
  async resizeEnd() {
    if (this.resizeActive) {
      this.resizeActive = false;

      await this.renderApl();
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
