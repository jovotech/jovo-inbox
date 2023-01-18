import { Component, Vue } from 'vue-property-decorator';
import {
  getOutputText,
  getPlatformRequest,
  getPlatformResponseOutputTemplate,
  getRequestPlatform,
  getResponsePlatform,
  InboxLog,
  Interaction,
  Project,
  Session,
} from 'jovo-inbox-core';
import { FormatUtil } from '@/utils/FormatUtil';
import { BASE_URL } from '@/constants';
import { OutputTemplate } from '@jovotech/framework';

@Component
export class BaseMixin extends Vue {
  getImage(conversation: InboxLog) {
    if (this.nameMap[conversation.userId] && this.nameMap[conversation.userId].image) {
      return `${BASE_URL}/avatars/${
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
    return getResponsePlatform(inboxLog);
  }

  getRequestPlatform(inboxLog: InboxLog) {
    return getRequestPlatform(inboxLog);
  }

  async getPlatformResponseOutputTemplate(inboxLog: InboxLog): Promise<OutputTemplate[]> {
    return getPlatformResponseOutputTemplate(inboxLog);
  }

  getOutputText(output: OutputTemplate): string {
    return getOutputText(output);
  }

  getMessageChunks(str: string) {
    return FormatUtil.getMessageChunks(str);
  }

  getPlatformRequest(inboxLog: InboxLog) {
    return getPlatformRequest(inboxLog);
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
