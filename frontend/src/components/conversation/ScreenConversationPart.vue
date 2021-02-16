<template>
  <div v-if="visible" class="fixed z-30 inset-0 overflow-y-auto text-gray-800 ">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!--
        Background overlay, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="fixed inset-0 transition-opacity ease-out duration-300" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >
      <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
      <div
        class="inline-block align-bottom w-auto  bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle "
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="bg-red px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <div class="mt-2">
                <div class="h-full w-auto text-sm overflow-y-auto">
                  <div id="aplviewer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="hide"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { InboxLog } from 'jovo-inbox-core';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import * as AplRenderer from 'apl-viewhost-web';

@Component({
  name: 'screen-conversation-part',
  components: { VueJsonPretty },
})
export default class ScreenConversationPart extends Vue {
  @Prop({ required: true, type: Object })
  part!: InboxLog;

  @Prop({ required: false, type: Array })
  sessionLogs!: InboxLog[];

  @Prop()
  visible = false;

  // eslint-disable-next-line
  renderer: any;

  @Watch('visible', { deep: true })
  private async onVisibilityChange() {
    if (this.visible) {
      setTimeout(async () => {
        await this.handleRenderInit();
      }, 250);
    }
  }

  async handleRenderInit() {
    console.log('handleRenderInit');

    const directive = this.part.payload.response.directives[0];
    const doc = directive.document;
    doc.version = '1.4';
    const datasource = directive.datasources || {};
    console.log(directive);
    const content = AplRenderer.Content.create(JSON.stringify(doc));
    if (content && datasource) {
      content.addData('payload', JSON.stringify(datasource));
    }
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
        width: 1024,
        height: 600,
        dpi: 96,
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

  get json() {
    return this.part.payload;
  }

  hide() {
    this.$emit('hide');
  }
}
</script>
<style lang="css">
.vjs-tree {
  font-size: 12px;
}
</style>
