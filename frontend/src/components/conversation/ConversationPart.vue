<template>
  <div class="group w-full flex-grow flex flex-col">
    <div class="inline-flex w-full max-w-3/4" :class="isResponse ? 'ml-auto justify-end' : ''">

      <div class="inline-flex flex-col">
        <div class="flex items-start space-x-2">
          <div v-if="isRequest"
               class="response-avatar">
<!--            <user-icon size="14" class="text-gray-500"></user-icon>-->
          </div>

          <div
              class="py-2 px-4 inline text-sm"
              :class="[
        isResponse
          ? 'bg-white self-end text-gray-800 rounded-xl '
          : 'bg-primary self-start text-right text-white rounded-xl',
      ]"
          >
            <p class="font-sans leading-6 whitespace-pre-wrap" v-html="print(part)" @click="handleClick"></p>
            <detail-conversation-part :visible="isDetailVisible" @hide="isDetailVisible = false"
                                      :part="part"></detail-conversation-part>
            <ScreenConversationPart :visible="isScreenViewVisible" @hide="isScreenViewVisible = false"
                                    :part="part"></ScreenConversationPart>

          </div>
<!--          <div v-if="isRequest"-->
<!--               class="rounded-full h-8 w-8 bg-gray-200 flex items-center justify-center flex-shrink-0"></div>-->
          <svg v-if=" isResponse" class="h-8 w-8 fill-current text-alexa-blue flex mr-1 items-center justify-center flex-shrink-0" height="24" width="24" viewBox="0 0 24 24"><path d="M0,10.0000489 C0,15.0707816 3.77428289,19.2594477 8.66667972,19.9113334 L8.66667972,17.8962718 C8.66667972,17.3281595 8.30829606,16.8174945 7.76974193,16.636736 C4.94690794,15.688512 2.927648,12.9904434 3.00202582,9.8313279 C3.09245359,5.9853886 6.22532565,2.96152397 10.0722248,3.00037678 C13.9049334,3.03913173 16.9999315,6.15812215 16.9999315,10.0000489 C16.9999315,10.087639 16.9977785,10.1747398 16.9945489,10.2614491 C16.9887748,10.4004189 16.9838815,10.4807669 16.9775203,10.5606256 C16.975563,10.5860707 16.9731163,10.611418 16.9707676,10.6367653 C16.9658743,10.692549 16.9601002,10.7479411 16.9538368,10.8032355 C16.9466926,10.8660654 16.9385698,10.928504 16.9298598,10.9906489 C16.9258473,11.01903 16.9220305,11.0475091 16.9177244,11.0756945 C16.0607158,16.7212922 8.70778325,19.8942068 8.66756051,19.9115291 C9.10355154,19.9694658 9.54815475,20 9.99990213,20 C15.5228467,20 20,15.5229227 20,10.0000489 C20,4.47717519 15.5228467,0 9.99990213,0 C4.47715329,0 0,4.47717519 0,10.0000489 Z" transform="translate(2 2)"></path></svg>

        </div>
        <div class="invisible group-hover:visible" :class="isResponse ? 'ml-auto' : ''">
          <code-icon class="inline-block mt-2 text-gray-500 hover:text-gray-800 cursor-pointer" :class="[
          isResponse
            ? 'self-end text-right ml-auto mr-2'
            : ' self-start  ml-2',
        ]" size="14"
                     @click="isDetailVisible = true"></code-icon>

          <monitor-icon v-if="isResponse && hasScreenInterface"
                        class="inline-block mt-2 text-gray-500 hover:text-gray-800 cursor-pointer" :class="[
          isResponse
            ? 'self-end text-right mr-2'
            : ' self-start  ml-2',
        ]" size="14"
                        @click="isScreenViewVisible = true"></monitor-icon>
        </div>

      </div>


    </div>
    <div v-if="isNextSession" class="text-center" :title="nextSessionStart">
      <div class="my-10 mx-auto w-4/5 new-session"><span
          class="bg-gray-100 ">{{ newSessionDate(nextSessionStart) }}</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import ScreenConversationPart from '@/components/conversation/ScreenConversationPart.vue';
import {AlexaUtil} from '@/utils/AlexaUtil';
import {InboxLog, InboxLogType} from 'jovo-inbox-core';
import {format} from 'timeago.js';
import {CodeIcon, MonitorIcon, UserIcon} from 'vue-feather-icons';
import {Component, Prop, Vue} from 'vue-property-decorator';
import dayjs from "dayjs";

import isToday from 'dayjs/plugin/isToday';
import {FormatUtil} from "@/utils/FormatUtil";

dayjs.extend(isToday);
@Component({
  name: 'conversation-part',
  components: {
    DetailConversationPart,
    MonitorIcon,
    CodeIcon,
    ScreenConversationPart,
    UserIcon
  },
})
export default class ConversationPart extends Vue {
  @Prop({required: true, type: Object})
  part!: InboxLog;

  @Prop({required: true, type: Array})
  selectedConversation!: InboxLog[];

  @Prop({required: true, type: Number})
  index!: number;

  isDetailVisible = false;
  isScreenViewVisible = false;

  get isRequest(): boolean {
    return this.part.type === InboxLogType.REQUEST;
  }

  get isResponse(): boolean {
    return this.part.type === InboxLogType.RESPONSE;
  }

  get hasScreenInterface(): boolean {
    const lastRequest = this.findLastRequest();
    return !!lastRequest && AlexaUtil.hasAplInterface(lastRequest.payload);
  }

  get isNextSession() {
    return (this.index + 1 < this.selectedConversation.length) &&
        this.selectedConversation[this.index + 1].sessionId !== this.selectedConversation[this.index].sessionId;
  }

  get nextSessionStart() {
    return this.selectedConversation[this.index + 1].createdAt;
  }

  print(log: InboxLog) {
    switch (log.type) {
      case
      InboxLogType.REQUEST:
        return this.printRequest(log);
      case
      InboxLogType.RESPONSE:
        return this.printResponse(log);
    }
  }

  findLastRequest() {
    for (let i = this.index; i >= 0; i--) {
      if (this.selectedConversation[i].type === InboxLogType.REQUEST) {
        return this.selectedConversation[i];
      }
    }
  }

  printRequest(log: InboxLog) {
    return AlexaUtil.getFriendlyRequestName(log.payload);
  }

  printResponse(log: InboxLog) {
    const message = log.payload.response?.outputSpeech?.ssml || '...';
    return this.formatMessage(message);
  }

  formatMessage(message: string) {
    return FormatUtil.formatMessage(message)
  }

  handleClick(e: Event) {
    console.log(e.target);
    // if ((e.target as string).includes('.tag-audio')) {
    //   console.log('Got a click on .play-video or a child element')
    // }
  }

  newSessionDate(date: string) {
    return FormatUtil.formatDate(date)

  }
}
</script>
<style lang="postcss">

.response-avatar {
  @apply rounded-full h-8 w-8 bg-gray-200 flex mr-1 items-center justify-center flex-shrink-0
}

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
