import { Component, Vue } from 'vue-property-decorator';
import { DisplayHelper } from '@/utils/DisplayHelper';
import { InboxLog, Interaction, Project, Session } from 'jovo-inbox-core';
import { FormatUtil } from '@/utils/FormatUtil';
import { API_BASE_URL, PLATFORMS } from '@/constants';
import { OutputTemplate, OutputTemplateConverter } from '@jovotech/framework';

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
      return `${API_BASE_URL}/avatars/${
        this.nameMap[conversation.userId].image
      }?random=${Math.random()}`;
    }
  }
  shortenUserId(inboxLog: InboxLog) {
    return FormatUtil.shortenUserId(inboxLog.userId);
  }
  get selectedConversations() {
    return this.$store.state.DataModule.selectedUserConversations;
  }

  get selectedInteraction(): Interaction | null {
    return this.$store.state.DataModule.selectedInteraction;
  }

  get interactions() {
    const interactions: Record<string, Interaction> = {};

    const isSessionStart = (index: number) => {
      return (
        index === 0 ||
        this.selectedConversation[index - 1].sessionId !==
          this.selectedConversation[index].sessionId
      );
    };

    for (let i = 0; i < this.selectedConversation.length; i++) {
      const conversation = this.selectedConversation[i];

      if (!interactions[conversation.requestId]) {
        interactions[conversation.requestId] = {
          requestId: conversation.requestId,
          logs: [],
          start: new Date(conversation.createdAt),
          hasSessionStarted: isSessionStart(i),
        };
      }
      interactions[conversation.requestId].logs.push(conversation);
    }

    // sort turns by turnStart
    return Object.values(interactions).sort((a, b) => {
      return a.start.getTime() - b.start.getTime();
    });
  }

  get sessions() {
    const sessions: Record<string, Session> = {};

    for (let i = 0; i < this.interactions.length; i++) {
      const turn = this.interactions[i];
      const firstSessionLog = turn.logs[0];

      if (!sessions[firstSessionLog.sessionId]) {
        sessions[firstSessionLog.sessionId] = {
          sessionId: firstSessionLog.sessionId,
          sessionStart: new Date(turn.logs[0].createdAt),
          interactions: [],
        };
      }
      sessions[firstSessionLog.sessionId].interactions.push(turn);
    }

    // sort turns by turnStart
    return Object.values(sessions).sort((a, b) => {
      return a.sessionStart.getTime() - b.sessionStart.getTime();
    });
  }

  get project(): Project {
    return this.$store.state.DataModule.selectedProject;
  }

  get projects(): Project[] {
    return this.$store.state.DataModule.projects;
  }

  getResponsePlatform(inboxLog: InboxLog) {
    return PLATFORMS.find((platform) =>
      Array.isArray(inboxLog.payload)
        ? inboxLog.payload.every((res) => platform.isResponseRelated(res))
        : platform.isResponseRelated(inboxLog.payload),
    );
  }

  getRequestPlatform(inboxLog: InboxLog) {
    return PLATFORMS.find((platform) =>
      Array.isArray(inboxLog.payload)
        ? inboxLog.payload.every((req) => platform.isRequestRelated(req))
        : platform.isRequestRelated(inboxLog.payload),
    );
  }

  async getPlatformResponseOutputTemplate(inboxLog: InboxLog): Promise<OutputTemplate[]> {
    const platform = this.getResponsePlatform(inboxLog);
    if (platform) {
      const outputTemplateConverter = new OutputTemplateConverter(
        platform.outputTemplateConverterStrategy,
      );
      const output = await outputTemplateConverter.fromResponse(inboxLog.payload);

      if (Array.isArray(output)) {
        return output;
      }
      return [output];
    }

    return [];
  }

  getOutputText(output: OutputTemplate): string {
    if (typeof output.message === 'string') {
      return output.message;
    }

    if (Array.isArray(output.message)) {
      return output.message.join(' ');
    }

    return output.message?.text || this.removeSSML(output.message!.speech || '');
  }

  removeSSML(ssml: string): string {
    return ssml.replace(/<[^>]*>/g, '');
  }

  formatMessage(str: string) {
    return FormatUtil.formatMessage(str);
  }

  getPlatformRequest(inboxLog: InboxLog) {
    const platform = this.getRequestPlatform(inboxLog);

    if (platform) {
      const platformRequest = platform.createRequestInstance(inboxLog.payload);

      const requestIntent = platformRequest.getIntent();
      const requestIntentName =
        typeof requestIntent === 'string' ? requestIntent : requestIntent?.name;
      const text =
        platformRequest.getInputText() ||
        requestIntentName ||
        (platformRequest.getInputType() as string | undefined) ||
        '<Unknown>';

      return {
        type: 'user',
        text: text,
      };
    }
  }

  async selectConversation() {
    await this.$store.dispatch('DataModule/fetchUserConversations', {
      userId: this.$route.params.userId,
      projectId: this.$route.params.projectId,
    });
  }

  get selectedConversation(): InboxLog[] {
    return this.$store.state.DataModule.selectedUserConversations;
  }

  getLogByType(interaction: Interaction, type: string) {
    return interaction.logs.find((item: InboxLog) => item.type === type);
  }

  get isLiveMode(): boolean {
    return this.$store.state.PreferencesModule.liveMode;
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
