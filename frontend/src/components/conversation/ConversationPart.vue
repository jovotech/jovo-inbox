<template>
  <div
    ref="conversation-part"
    class="group w-full flex-grow flex flex-col rounded-l border-transparent focus:outline-none"
    :class="[
      isSelectedInboxLog ? 'border-jovo-blue border-l-4 inset-0' : 'border-transparent border-l-4 ',
      isRequest ? 'mt-8' : '',
    ]"
    v-on:dblclick="openDetailView"
    tabindex="0"
  >
    <request-part v-if="isRequest" :part="part"></request-part>
    <response-part v-if="isResponse" :part="part" class="ml-auto justify-end"></response-part>
    <error-part v-if="isError" :part="part" class="m-auto"></error-part>
  </div>
</template>

<script lang="ts">
import DetailConversationPart from '@/components/conversation/DetailConversationPart.vue';
import ScreenConversationPart from '@/components/conversation/ScreenConversationPart.vue';
import { InboxLog, InboxLogType } from 'jovo-inbox-core';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, MonitorIcon, UserIcon } from 'vue-feather-icons';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import ErrorPart from '@/components/conversation/ErrorPart.vue';
import ResponsePart from '@/components/conversation/ResponsePart.vue';
import RequestPart from '@/components/conversation/RequestPart.vue';

@Component({
  name: 'conversation-part',
  components: {
    RequestPart,
    ResponsePart,
    ErrorPart,
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

  get isRequest(): boolean {
    return this.part.type === InboxLogType.REQUEST;
  }
  async openDetailView() {
    await this.$store.dispatch('DataModule/selectInboxLog', this.part);
  }

  get isResponse(): boolean {
    return this.part.type === InboxLogType.RESPONSE;
  }

  get isError(): boolean {
    return this.part.type === InboxLogType.ERROR;
  }

  get isSelectedInboxLog() {
    return (
      this.$store.state.DataModule.selectedInboxLog &&
      this.$store.state.DataModule.selectedInboxLog.id === this.part.id
    );
  }

  @Watch('isSelectedInboxLog')
  watchIsSelectedInboxLog() {
    if (this.isSelectedInboxLog) {
      (this.$refs['conversation-part'] as HTMLElement).focus();
    }
  }
}
</script>
<style lang="postcss"></style>
