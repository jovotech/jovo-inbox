<template>
  <div class="group w-full flex-grow flex flex-col">
    <div class="inline-flex w-full max-w-3/4" :class="isRequest ? 'ml-auto justify-end' : ''">

      <div class="inline-flex flex-col">
        <div class="flex items-start space-x-2">
          <div v-if="isResponse"
               class="rounded-full h-8 w-8 bg-gray-200 flex mr-2 items-center justify-center flex-shrink-0"></div>
          <div
              class="py-2 px-4 inline text-sm"
              :class="[
        isRequest
          ? 'bg-primary self-end text-right text-white rounded-t-xl rounded-bl-xl'
          : 'bg-white self-start text-gray-800 rounded-b-xl rounded-tr-xl',
      ]"
          >
            <p class="font-sans whitespace-pre-wrap" v-html="print(part)" @click="handleClick"></p>
            <detail-conversation-part :visible="isDetailVisible" @hide="isDetailVisible = false"
                                      :part="part"></detail-conversation-part>
            <ScreenConversationPart :visible="isScreenViewVisible" @hide="isScreenViewVisible = false"
                                    :part="part"></ScreenConversationPart>

          </div>
          <div v-if="isRequest"
               class="rounded-full h-8 w-8 bg-gray-200 flex items-center justify-center flex-shrink-0"></div>

        </div>
        <div class="invisible group-hover:visible" :class="isRequest ? 'ml-auto' : ''">
          <code-icon class="inline-block mt-2 text-gray-500 hover:text-gray-800 cursor-pointer" :class="[
          isRequest
            ? 'self-end text-right ml-auto mr-2'
            : ' self-start  ml-2',
        ]" size="14"
                     @click="isDetailVisible = true"></code-icon>

          <monitor-icon v-if="isResponse && hasScreenInterface"
                        class="inline-block mt-2 text-gray-500 hover:text-gray-800 cursor-pointer" :class="[
          isRequest
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
import {CodeIcon, MonitorIcon} from 'vue-feather-icons';
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  name: 'conversation-part',
  components: {
    DetailConversationPart,
    MonitorIcon,
    CodeIcon,
    ScreenConversationPart,
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
    return log.payload.request?.intent?.name || 'LAUNCH';
  }

  printResponse(log: InboxLog) {
    const message = log.payload.response?.outputSpeech?.ssml || '...';
    return this.formatMessage(message);
  }

  formatMessage(message: string) {
    message = message.replace('<speak>', '').replace('</speak>', '');

    message = message.replace(/<iframe/g, '').replace(/<\/iframe/g, '');
    message = message.replace(/<script>/g, '').replace(/<\/script>/g, '');
    message = message.replace(/<s>/g, '').replace(/<\/s>/g, '');
    message = message.replace(/<applet>/g, '').replace(/<\/applet>/g, '');
    message = message.replace(/<style>/g, '').replace(/<\/style>/g, '');
    message = message.replace(/<link>/g, '').replace(/<\/link>/g, '');
    message = message.replace(/<embed>/g, '').replace(/<\/embed>/g, '');
    message = message.replace(/<sub alias=(?:'|")(\S+?)(?:'|")>(.+?)<\/sub>/g, '<span class="bg-gray-100 p-1  rounded-lg" title="<sub alias=q$1>$2</sub>">$2</span>');

    message = message.replace(/<break time=(?:'|")(\S+?)(?:'|")\/>/g, '<span class="tag-break">(Break $1)</span>');
    message = message.replace(/<audio src=(?:'|")(.+?)(?:'|") \/>/g, '<span class="tag-audio bg-gray-100 p-1 rounded-lg" title="$1">Audio <a href="$1" target="_blank">►</a></span>');

    return message;
  }

  handleClick(e: Event) {
    console.log(e.target);
    // if ((e.target as string).includes('.tag-audio')) {
    //   console.log('Got a click on .play-video or a child element')
    // }
  }

  newSessionDate(date: string) {
    return format(date);
  }
}
</script>
<style lang="scss">

div.new-session {
  opacity: 0.5;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  line-height: 0.1em;
  font-size: smaller;
}

div.new-session span {
  padding: 0 10px;
}

</style>
