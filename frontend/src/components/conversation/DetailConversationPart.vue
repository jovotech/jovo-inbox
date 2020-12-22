<template>
  <div v-if="visible" class="fixed z-10 inset-0 overflow-y-auto text-gray-800 ">
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
        class="inline-block align-bottom  bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full xl:w-3/5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="bg-red px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Details
              </h3>
              <div class="mt-2">
                <div class="h-172 w-3/5 text-sm max-h-144 overflow-y-auto">
                  <div id="aplviewer"></div>

                  <vue-json-pretty :data="json"> </vue-json-pretty>
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
import { InboxLog, InboxLogType } from 'jovo-inbox-core';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import * as AplRenderer from 'apl-viewhost-web';

@Component({
  name: 'detail-conversation-part',
  components: { VueJsonPretty },
})
export default class DetailConversationPart extends Vue {
  @Prop({ required: true, type: Object })
  part!: InboxLog;

  @Prop({ required: false, type: Array })
  sessionLogs!: InboxLog[];

  @Prop()
  visible = false;

  renderer: any;

  async mounted() {
    console.log('mounted');
  }

  @Watch('visible', { deep: true })
  private async onVisibilityChange() {
    if (this.visible) {
      // await this.handleRenderInit();
    }
  }

  async handleRenderInit() {
    console.log('handleRenderInit');
    // await AplRenderer.initEngine();

    const doc = this.part.payload.response.directives[0].document;
    doc.version = '1.4';
    console.log(doc);
    const apl = {
      type: 'APL',
      version: '1.4',
      settings: {},
      theme: 'dark',
      import: [
        {
          name: 'alexa-layouts',
          version: '1.0.0',
        },
      ],

      onMount: [],
      graphics: {},
      commands: {},
      styles: {
        PlaceStyle: {
          values: [
            {
              when: '${viewport.width === 1920}',
              fontSize: '15dp',
              fontWeight: 500,
            },
            {
              when: '${viewport.width < 1920}',
              fontSize: '20dp',
              fontWeight: 700,
            },
          ],
        },
        TimerStyle: {
          values: [
            {
              when: '${viewport.width === 1920}',
              fontSize: '30dp',
            },
            {
              when: '${viewport.width < 1920}',
              fontSize: '40dp',
              fontWeight: 700,
            },
          ],
        },
        ScoreStyle: {
          values: [
            {
              textAlign: 'left',
              fontWeight: '700',
              fontSize: '60dp',
            },
          ],
        },
      },
      layouts: {
        Timer: {
          parameters: ['time', 'quarter'],
          items: [
            {
              alignItems: 'center',
              width: '100%',
              position: 'absolute',
              type: 'Container',
              items: [
                {
                  style: 'TimerStyle',
                  position: 'absolute',
                  bind: [
                    {
                      name: 'TimerMinutes',
                      value: '${time.minutes}',
                    },
                    {
                      name: 'TimerSeconds',
                      value: '${time.seconds}',
                    },
                  ],
                  text:
                    '${TimerMinutes < 10 ? "0" + TimerMinutes : TimerMinutes}:${TimerSeconds < 10 ? "0" + TimerSeconds : TimerSeconds}',
                  handleTick: {
                    when: '${TimerMinutes > 0 || TimerSeconds > 0}',
                    commands: [
                      {
                        type: 'Sequential',
                        commands: [
                          {
                            property: 'TimerSeconds',
                            type: 'SetValue',
                            when: '${TimerSeconds == 0 && TimerMinutes > 0}',
                            value: 60,
                          },
                          {
                            property: 'TimerMinutes',
                            type: 'SetValue',
                            when: '${TimerSeconds == 60 && TimerMinutes > 0}',
                            value: '${TimerMinutes - 1}',
                          },
                          {
                            property: 'TimerSeconds',
                            type: 'SetValue',
                            when: '${TimerSeconds > 0 && TimerMinutes >= 0}',
                            value: '${TimerSeconds - 1}',
                          },
                        ],
                      },
                    ],
                  },
                  type: 'Text',
                },
                {
                  style: 'PlaceStyle',
                  text: '${quarter}',
                  position: 'absolute',
                  type: 'Text',
                  bottom: 0,
                },
              ],
              justifyContent: 'center',
              height: '50%',
              direction: 'column',
            },
          ],
        },
        Team: {
          parameters: ['teamData', 'direction'],
          items: [
            {
              width: '33%',
              type: 'Container',
              items: [
                {
                  width: '50%',
                  type: 'Container',
                  alignItems: 'center',
                  items: [
                    {
                      type: 'Image',
                      source: '${teamData.logo}',
                    },
                  ],
                  justifyContent: 'center',
                  height: '100%',
                },
                {
                  width: '50%',
                  type: 'Container',
                  alignItems: 'center',
                  items: [
                    {
                      type: 'Text',
                      style: 'ScoreStyle',
                      text: '${teamData.score}',
                    },
                  ],
                  justifyContent: 'center',
                  height: '100%',
                },
              ],
              height: '100%',
              direction: '${direction}',
            },
          ],
        },
      },
      mainTemplate: {
        items: [
          {
            width: '100vw',
            type: 'Container',
            items: [
              // {
              //   "width": "100vw",
              //   "scale": "best-fill",
              //   "position": "absolute",
              //   "source": "https://nba-ui.s3.amazonaws.com/NBA_visuals/00_Welcome/3.png",
              //   "type": "Image",
              //   "when": "${viewport.width == 1280}",
              //   "height": "100vh"
              // },
              {
                type: 'Text',
                style: 'ScoreStyle',
                text: '${viewport.width}',
              },
            ],
            height: '100vh',
          },
        ],
      },
    };
    const datasource = {
      data: {
        games: [
          {
            teams: [
              {
                score: 112,
                logo: 'https://nba-ui.s3.amazonaws.com/NBA_visuals/TeamLogo_Global/Heat_Global.png',
              },
              {
                score: 124,
                logo:
                  'https://nba-ui.s3.amazonaws.com/NBA_visuals/TeamLogo_Global/Lakers_Global.png',
              },
            ],
            time: {
              minutes: 0,
              seconds: 0,
            },
            quarter: '4',
          },
          {
            teams: [
              {
                score: 108,
                logo:
                  'https://nba-ui.s3.amazonaws.com/NBA_visuals/TeamLogo_Global/Warriors_Global.png',
              },
              {
                score: 100,
                logo:
                  'https://nba-ui.s3.amazonaws.com/NBA_visuals/TeamLogo_Global/Thunder_Global.png',
              },
            ],
            time: {
              minutes: 14,
              seconds: 39,
            },
            quarter: '3',
          },
          {
            teams: [
              {
                score: 45,
                logo: 'https://nba-ui.s3.amazonaws.com/NBA_visuals/TeamLogo_Global/Heat_Global.png',
              },
              {
                score: 32,
                logo:
                  'https://nba-ui.s3.amazonaws.com/NBA_visuals/TeamLogo_Global/Lakers_Global.png',
              },
            ],
            time: {
              minutes: 12,
              seconds: 19,
            },
            quarter: '3',
          },
        ],
      },
    };
    const content = AplRenderer.Content.create(JSON.stringify(doc));
    if (content) {
      // content.addData('payload', JSON.stringify(datasource))
    }
    console.log('a');
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
        width: 1280,
        height: 600,
        dpi: 160,
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

  hide(val: boolean) {
    this.$emit('hide');
    this.visible = false;
  }
}
</script>
<style lang="css">
.vjs-tree {
  font-size: 12px;
}
</style>
