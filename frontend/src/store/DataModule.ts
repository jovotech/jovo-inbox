import { Module, MutationAction, VuexModule } from 'vuex-module-decorators';
import {
  InboxLog,
  JovoAppMetaData,
  SelectUserConversationsDto,
  InboxLogUser,
  GetLastConversationsDto,
  Interaction,
} from 'jovo-inbox-core';
import { Api } from '@/Api';
export enum DataAction {
  fetchApps = 'fetchApps',
  fetchConversations = 'fetchConversations',
  clearConversations = 'clearConversations',

  searchConversations = 'searchConversations',

  fetchUserConversations = 'fetchUserConversations',

  appendUserConversations = 'appendUserConversations',
  appendLastConversations = 'appendLastConversations',

  buildAppUsersMap = 'buildAppUsersMap',

  selectApp = 'selectApp',
  selectInboxLog = 'selectInboxLog',
  selectInteraction = 'selectInteraction',
}

export interface DataState {
  apps: JovoAppMetaData[];
  conversations: Interaction[];
  selectedUserConversations: InboxLog[];
  selectedApp: JovoAppMetaData[];
  selectedInboxLog: InboxLog;
  nameMap: Record<
    string,
    {
      name: string;
      image?: string;
    }
  >;
}

@Module({ namespaced: true, name: 'DataModule' })
export class DataModule extends VuexModule<DataState> {
  apps: JovoAppMetaData[] = [];
  conversations: Interaction[] = [];
  selectedUserConversations: InboxLog[] = [];

  selectedInboxLog: InboxLog | null = null;
  selectedInteraction: Interaction | null = null;

  selectedApp: JovoAppMetaData | null = null;
  nameMap: Record<
    string,
    {
      name: string;
      image?: string;
    }
  > = {};

  @MutationAction({ mutate: ['apps'], rawError: true })
  async [DataAction.fetchApps]() {
    const result = await Api.getApps();
    return { apps: result.apps };
  }

  @MutationAction({ mutate: ['selectedApp'], rawError: true })
  async [DataAction.selectApp](app: JovoAppMetaData) {
    document.title = app.name + ' -  Jovo Inbox';
    return { selectedApp: app };
  }

  @MutationAction({ mutate: ['conversations'], rawError: true })
  async [DataAction.fetchConversations](getLastConversationsDto: GetLastConversationsDto) {
    const result = await Api.getLastConversations(getLastConversationsDto);
    return { conversations: result };
  }

  @MutationAction({ mutate: ['conversations'], rawError: true })
  async [DataAction.clearConversations]() {
    return { conversations: [] };
  }

  @MutationAction({ mutate: ['selectedUserConversations'], rawError: true })
  async [DataAction.fetchUserConversations](
    selectUserConversationsDto: SelectUserConversationsDto,
  ) {
    const result = await Api.getUserConversations(selectUserConversationsDto);
    return { selectedUserConversations: result.logs };
  }

  @MutationAction({ mutate: ['selectedUserConversations'], rawError: true })
  async [DataAction.appendUserConversations](
    selectUserConversationsDto: SelectUserConversationsDto,
  ) {
    const result = await Api.getUserConversations(selectUserConversationsDto);
    const selectedUserConversations = (this.state as DataState).selectedUserConversations;
    return { selectedUserConversations: selectedUserConversations.concat(result.logs) };
  }

  @MutationAction({ mutate: ['conversations'], rawError: true })
  async [DataAction.appendLastConversations](getLastConversationsDto: GetLastConversationsDto) {
    const result = await Api.getLastConversations(getLastConversationsDto);
    const conversations = (this.state as DataState).conversations;
    return { conversations: conversations.concat(result) };
  }

  @MutationAction({ mutate: ['selectedInboxLog'], rawError: true })
  async [DataAction.selectInboxLog](inboxLog: InboxLog) {
    return { selectedInboxLog: inboxLog };
  }

  @MutationAction({ mutate: ['selectedInteraction'], rawError: true })
  async [DataAction.selectInteraction](interaction: Interaction) {
    return { selectedInteraction: interaction };
  }

  @MutationAction({ mutate: ['nameMap'], rawError: true })
  async [DataAction.buildAppUsersMap](appId: string) {
    const result = await Api.getInboxAppUsers(appId);

    const nameMap: Record<
      string,
      {
        name: string;
        image?: string;
      }
    > = {};

    result.data.forEach((item: InboxLogUser) => {
      nameMap[item.platformUserId] = {
        name: item.name,
        image: item.image,
      };
    });

    return { nameMap };
  }
}
