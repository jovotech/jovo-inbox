<template>
  <div ref="response" class="inline-flex flex-col max-w-3/4">
    <div class="flex items-start justify-center flex-shrink-0">
      <div class="flex flex-col">
        <div
          v-for="(out, index) in output"
          v-bind:key="index"
          class="py-2 px-4 inline self-end text-gray-800 rounded-xl mb-2 inline-flex px-4 py-2 rounded-xl text-sm bg-white shadow-sm"
        >
          <div class="font-sans leading-6 whitespace-pre-wrap">
            <div
              class="inline ml-0.5"
              v-for="(chunk, index) in getMessageChunks(getOutputText(out))"
              v-bind:key="index"
            >
              <div v-if="chunk.type === 'audio'" class="inline-flex items-center bg-gray-100">
                <span class="tag-audio pr-1 inline-block rounded-lg"
                  ><audio :src="chunk.src" class="audio-player"></audio></span
                ><span
                  title="${a}"
                  class="bg-gray-100 text-gray-400 ml-1 text-sm rounded rounded-l-none pr-1"
                  >{{ chunk.filename }}</span
                >
              </div>

              <span
                v-else-if="chunk.type === 'break'"
                class="tag-break italic text-gray-400 font-mono"
                >(Break {{ chunk.time }})</span
              >
              <span v-else-if="chunk.type === 'text'">{{ chunk.text }}</span>
            </div>
          </div>
        </div>
        <div class="pl-2">
          <span
            v-for="quickreply in quickReplies"
            v-bind:key="quickreply"
            class="quick-reply-display inline-flex items-center border shadow-sm ml-auto rounded-full border-transparent text-gray-700 bg-gray-200 px-4 py-2 text-sm rounded-md mr-2"
          >
            {{ quickreply }}
          </span>
        </div>
      </div>

      <div
        class="rounded-full h-10 w-12 flex ml-1.5 text-center items-center justify-center flex-shrink-0"
      >
        <img class="h-8 w-8 flex-shrink-0" :src="platformImage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import ScreenConversationPart from '@/components/conversation/ScreenConversationPart.vue';
import { InboxLog } from 'jovo-inbox-core';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, MonitorIcon, UserIcon } from 'vue-feather-icons';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Plyr from 'plyr';
import 'plyr/src/sass/plyr.scss';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import { OutputTemplate } from '@jovotech/framework';
import { getPlatformLogo } from '@/util';

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

  output: OutputTemplate[] = [];

  async mounted() {
    this.initPlyrPlayer();

    this.output = await this.getPlatformResponseOutputTemplate(this.part);
  }

  @Watch('part')
  async watchPart() {
    this.$nextTick(async () => {
      this.initPlyrPlayer();
    });
  }

  get platformImage() {
    return getPlatformLogo(this.part.platform);
  }

  get quickReplies() {
    const quickReplies = [];

    for (const output of this.output) {
      if (output.quickReplies) {
        quickReplies.push(...output.quickReplies);
      }
    }

    return quickReplies;
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
