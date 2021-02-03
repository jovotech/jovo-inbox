import { Component, Vue } from 'vue-property-decorator';
import { DisplayHelper } from '@/utils/DisplayHelper';
import { InboxLog, JovoAppMetaData } from 'jovo-inbox-core';
import { FormatUtil } from '@/utils/FormatUtil';
import { API_BASE_URL } from '@/constants';

@Component
export class BaseMixin extends Vue {
  createIcon(id: string, size = 20) {
    return DisplayHelper.toDisplayIcon(id, {
      size,
      format: 'svg',
      saturation: 0.2,
      brightness: 0.5,
      background: [229, 231, 235, 1],
    });
  }

  getImage(conversation: InboxLog) {
    if (this.nameMap[conversation.userId] && this.nameMap[conversation.userId].image) {
      return `${API_BASE_URL}/public/images/${this.nameMap[conversation.userId].image}`;
    }
    // return this.createIcon(conversation.userId);
  }
  shortenUserId(inboxLog: InboxLog) {
    return FormatUtil.shortenUserId(inboxLog.userId);
  }
  get selectedConversations() {
    return this.$store.state.DataModule.selectedUserConversations;
  }

  get app(): JovoAppMetaData {
    return this.$store.state.DataModule.selectedApp;
  }

  get nameMap(): Record<
    string,
    {
      name: string;
      image?: string;
    }
  > {
    return this.$store.state.DataModule.nameMap;
  }
}
