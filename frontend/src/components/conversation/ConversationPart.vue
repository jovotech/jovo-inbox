<template>
  <div
    ref="conversation-part"
    class="group w-full flex-grow flex flex-col rounded-l"
    :class="isSelectedInboxLog ? 'border-jovo-blue border-l-4 inset-0' : ''"
  >
    <div
      v-on:dblclick="selectInboxLog"
      class="inline-flex w-full p-4"
      :data-session-id="part.sessionId"
      :class="isResponse ? 'ml-auto justify-end' : ''"
    >
      <div class="inline-flex flex-col " :class="isResponse || isRequest ? 'max-w-3/4' : 'w-full'">
        <div v-if="isError" class="rounded-md bg-red-50 p-4 m-auto w-5/6 text-sm mb-6">
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
              <p class="text-sm text-red-800">
                An error has occurred.
              </p>
              <p class="mt-3 text-sm md:mt-0 md:ml-6">
                <a
                  @click="isErrorCollapsed = !isErrorCollapsed"
                  href="#"
                  class="whitespace-nowrap font-medium text-red-700 hover:text-red-800"
                  >Details
                  <chevron-down-icon
                    v-if="!isErrorCollapsed"
                    size="16"
                    class="inline
"
                  ></chevron-down-icon
                  ><chevron-up-icon
                    v-if="isErrorCollapsed"
                    size="16"
                    class="inline
"
                  ></chevron-up-icon
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

        <div v-if="isRequest" class="flex text-center items-start justify-center flex-shrink-0">
          <div class="mr-2">
            <img
              v-if="isRequest && getImage(part)"
              class="h-10 w-10 rounded-full"
              :src="getImage(part)"
              :title="part.userId"
              alt=""
            />
            <svg
              v-else-if="isRequest"
              class="h-auto w-10 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div
            v-if="printRequest(part).type === 'user'"
            class="py-2 px-4 inline text-sm bg-jovo-blue self-start text-right text-white rounded-xl"
          >
            <p class="font-sans leading-6 whitespace-pre-wrap ">
              {{ printRequest(part).text }}
            </p>
          </div>
          <div
            v-else-if="printRequest(part).type === 'platform'"
            class="py-2 px-1 inline text-sm  self-start text-right text-gray-400 italic rounded-xl"
          >
            <p class="font-sans leading-6 whitespace-pre-wrap text-left">
              {{ printRequest(part).text }}

              <a
                v-if="printRequest(part).subtext"
                @click="isErrorCollapsed = !isErrorCollapsed"
                href="#"
                class="whitespace-nowrap font-medium text-gray-400 ml-3 hover:text-gray-500"
                >Details
                <chevron-down-icon
                  v-if="!isErrorCollapsed"
                  size="16"
                  class="inline
"
                ></chevron-down-icon
                ><chevron-up-icon
                  v-if="isErrorCollapsed"
                  size="16"
                  class="inline
"
                ></chevron-up-icon
              ></a>
            </p>
            <span v-if="isErrorCollapsed" class="text-left text-xs block px-1 ">
              {{ printRequest(part).subtext }}
            </span>
          </div>
        </div>

        <div v-if="isResponse" class="flex items-center justify-center flex-shrink-0">
          <div class="py-2 px-4 inline text-sm bg-white self-end text-gray-800 rounded-xl">
            <p
              :class="[printResponse(part).type === 'Action' ? 'italic' : '']"
              class="font-sans leading-6 whitespace-pre-wrap"
              v-html="$sanitize(formatMessage(printResponse(part).text))"
            ></p>
          </div>
          <div
            class="rounded-full h-10 w-12  flex ml-1.5 text-center items-center justify-center flex-shrink-0"
          >
            <img class="h-8 w-8 flex-shrink-0" :src="platformImage" />
          </div>
        </div>
        <div
          v-if="isResponse || isRequest"
          class="invisible group-hover:visible"
          :class="isResponse ? 'ml-auto' : ''"
        >
          <monitor-icon
            v-if="isResponse && hasScreenInterface"
            class="inline-block mt-2 text-gray-500 hover:text-gray-800 cursor-pointer"
            :class="[isResponse ? 'self-end text-right mr-2' : ' self-start  ml-2']"
            size="14"
            @click="isScreenViewVisible = true"
          ></monitor-icon>
          <code-icon
            class="inline-block mt-2 text-gray-500 hover:text-gray-800 cursor-pointer"
            :class="[isResponse ? 'self-end text-right ml-auto mr-3.5' : ' self-start  ml-3.5']"
            size="14"
            @click="selectInboxLog"
          ></code-icon>
        </div>
        <ScreenConversationPart
          :visible="isScreenViewVisible"
          @hide="isScreenViewVisible = false"
          :part="part"
        ></ScreenConversationPart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import ScreenConversationPart from '@/components/conversation/ScreenConversationPart.vue';
import { InboxLog, InboxLogType } from 'jovo-inbox-core';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, MonitorIcon, UserIcon } from 'vue-feather-icons';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Plyr from 'plyr';
import 'plyr/src/sass/plyr.scss';
import { FormatUtil } from '@/utils/FormatUtil';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'conversation-part',
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
export default class ConversationPart extends mixins(BaseMixin) {
  @Prop({ required: true, type: Object })
  part!: InboxLog;

  @Prop({ required: true, type: Array })
  selectedConversation!: InboxLog[];

  @Prop({ required: true, type: Number })
  index!: number;

  isDetailVisible = false;
  isScreenViewVisible = false;

  isErrorCollapsed = false;

  get isRequest(): boolean {
    return this.part.type === InboxLogType.REQUEST;
  }

  async selectInboxLog() {
    await this.$store.dispatch('DataModule/selectInboxLog', this.part);
  }

  mounted() {
    this.$nextTick(() => {
      const element = this.$refs['conversation-part'] as HTMLElement;
      Array.from(element.querySelectorAll('.audio-player')).map(
        (p) =>
          new Plyr(p as HTMLElement, {
            controls: ['play', 'current-time'],
          }),
      );
    });
  }

  get isResponse(): boolean {
    return this.part.type === InboxLogType.RESPONSE;
  }

  get isError(): boolean {
    return this.part.type === InboxLogType.ERROR;
  }

  // TODO: get hasScreen from platform request class
  get hasScreenInterface(): boolean {
    return false;
  }

  get isNextSession() {
    return (
      this.index + 1 < this.selectedConversation.length &&
      this.selectedConversation[this.index + 1].sessionId !==
        this.selectedConversation[this.index].sessionId
    );
  }

  get nextSessionStart() {
    return this.selectedConversation[this.index + 1].createdAt;
  }

  print(log: InboxLog) {
    switch (log.type) {
      case InboxLogType.REQUEST:
        return this.printRequest(log);
      case InboxLogType.RESPONSE:
        return this.printResponse(log);
    }
  }

  formatMessage(str: string) {
    return FormatUtil.formatMessage(str);
  }

  findLastRequest() {
    for (let i = this.index; i >= 0; i--) {
      if (this.selectedConversation[i].type === InboxLogType.REQUEST) {
        return this.selectedConversation[i];
      }
    }
  }

  printRequest(log: InboxLog) {
    const platformRequest = this.getPlatformRequest(log);
    console.log(platformRequest);
    if (platformRequest) {
      return platformRequest.getText();
    }

    return {
      type: 'user',
      text: 'error',
    };
  }

  get platformType() {
    return this.getPlatform(this.part)?.name;
  }

  get platformImage() {
    return this.getPlatform(this.part)?.image64x64;
  }

  printResponse(log: InboxLog) {
    const platformResponse = this.getPlatformResponse(log);
    if (platformResponse) {
      return platformResponse.getSpeech();
    }
    return {
      type: 'user',
      text: 'error',
    };
  }
  @Watch('selectedConversation')
  onSelectedConversationChange() {
    this.$nextTick(() => {
      const element = this.$refs['conversation-part'] as HTMLElement;
      Array.from(element.querySelectorAll('.audio-player')).map(
        (p) =>
          new Plyr(p as HTMLElement, {
            controls: ['play', 'current-time'],
          }),
      );
    });
  }
  get selectedInboxLog(): InboxLog | null {
    return this.$store.state.DataModule.selectedInboxLog;
  }
  get isSelectedInboxLog() {
    return this.selectedInboxLog && this.selectedInboxLog.id === this.part.id;
  }
}
</script>
<style lang="postcss">
div.new-session {
  opacity: 0.3;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  line-height: 0.1em;
  font-size: smaller;
}

div.new-session span {
  padding: 0 10px;
}
</style>
