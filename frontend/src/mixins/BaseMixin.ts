import { Component, Vue } from 'vue-property-decorator';
import { DisplayHelper } from '@/utils/DisplayHelper';
import {
  InboxAlexa,
  InboxConversationalActions,
  InboxGoogleAssistant,
  InboxLog,
  InboxLogType,
  InboxPlatform,
  InboxWeb,
  JovoAppMetaData,
  JovoInboxPlatformRequest,
  JovoInboxPlatformResponse,
} from 'jovo-inbox-core';
import { FormatUtil } from '@/utils/FormatUtil';
import { API_BASE_URL } from '@/constants';

@Component
export class BaseMixin extends Vue {
  // TODO:
  platforms: InboxPlatform[] = [
    new InboxAlexa(),
    new InboxConversationalActions(),
    new InboxGoogleAssistant(),
    new InboxWeb(),
  ];

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

  get apps(): JovoAppMetaData[] {
    return this.$store.state.DataModule.apps;
  }

  getPlatform(inboxLog: InboxLog): InboxPlatform | undefined {
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];
      const requestConstructor = platform.requestClass;
      const request = new requestConstructor();

      const responseConstructor = platform.responseClass;
      const response = new responseConstructor();

      if (inboxLog.type === InboxLogType.REQUEST && request.isPlatformRequest(inboxLog.payload)) {
        return platform;
      } else if (
        inboxLog.type === InboxLogType.RESPONSE &&
        response.isPlatformResponse(inboxLog.payload)
      ) {
        return platform;
      }
    }
  }

  getPlatformRequest(inboxLog: InboxLog): JovoInboxPlatformRequest | undefined {
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];
      const requestConstructor = platform.requestClass;
      const request = new requestConstructor();
      if (request && request.isPlatformRequest(inboxLog.payload)) {
        return Object.assign(request, inboxLog.payload) as JovoInboxPlatformRequest;
      }
    }
  }
  getPlatformImage(inboxLog: InboxLog) {
    return this.getPlatform(inboxLog)?.image64x64;
  }

  getPlatformResponse(inboxLog: InboxLog): JovoInboxPlatformResponse | undefined {
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];
      const responseConstructor = platform.responseClass;

      const response = new responseConstructor();
      if (response && response.isPlatformResponse(inboxLog.payload)) {
        return Object.assign(response, inboxLog.payload) as JovoInboxPlatformResponse;
      }
    }
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
