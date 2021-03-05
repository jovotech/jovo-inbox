<template>
  <div ref="response" class="inline-flex flex-col max-w-3/4">
    <div class="flex items-center justify-center flex-shrink-0">
      <div class="flex flex-col">
        <div
          v-for="response in responses"
          v-bind:key="response.text"
          class=" py-2 px-4 inline text-sm bg-white self-end text-gray-800 rounded-xl mb-2"
        >
          <p
            :class="[response.type === 'Action' ? 'italic' : '']"
            class="font-sans leading-6 whitespace-pre-wrap"
            v-html="$sanitize(formatMessage(response.text))"
          ></p>
        </div>
      </div>

      <div
        class="rounded-full h-10 w-12  flex ml-1.5 text-center items-center justify-center flex-shrink-0"
      >
        <img class="h-8 w-8 flex-shrink-0" :src="platformImage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import ScreenConversationPart from '@/components/conversation/ScreenConversationPart.vue';
import { InboxLog, InboxLogType, JovoInboxPlatformResponse } from 'jovo-inbox-core';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, MonitorIcon, UserIcon } from 'vue-feather-icons';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Plyr from 'plyr';
import 'plyr/src/sass/plyr.scss';
import { FormatUtil } from '@/utils/FormatUtil';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';

@Component({
  name: 'response-part',
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
export default class ResponsePart extends mixins(BaseMixin) {
  @Prop({ required: true, type: Object })
  part!: InboxLog;

  platformResponse: JovoInboxPlatformResponse | null = null;

  mounted() {
    this.initPlyrPlayer();
  }

  @Watch('part')
  watchPart() {
    this.$nextTick(() => {
      this.initPlyrPlayer();
    });
  }

  get responses() {
    this.platformResponse = this.getPlatformResponse(this.part);
    if (this.platformResponse) {
      return this.platformResponse.getOutput();
    }
    return [];
  }

  get platformImage() {
    return this.getPlatform(this.part)?.image64x64;
  }

  formatMessage(str: string) {
    return FormatUtil.formatMessage(str);
  }

  initPlyrPlayer() {
    const element = this.$refs['response'] as HTMLElement;
    Array.from(element.querySelectorAll('.audio-player')).map(
      (p) =>
        new Plyr(p as HTMLElement, {
          controls: ['play', 'current-time'],
        }),
    );
  }
}
</script>
<style lang="postcss"></style>
