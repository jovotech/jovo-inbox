import { Module, MutationAction, VuexModule } from 'vuex-module-decorators';
import {
  InboxLog,
  JovoAppMetaData,
  SelectUserConversationsDto,
  InboxLogUser,
} from 'jovo-inbox-core';
import { Api } from '@/Api';
export enum DataAction {
  fetchApps = 'fetchApps',
  fetchConversations = 'fetchConversations',
  fetchUserConversations = 'fetchUserConversations',

  buildAppUsersMap = 'buildAppUsersMap',

  selectApp = 'selectApp',
}

export interface DataState {
  apps: JovoAppMetaData[];
  conversations: InboxLog[];
  selectedUserConversations: InboxLog[];
  selectedApp: JovoAppMetaData[];
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
  conversations: InboxLog[] = [];
  selectedUserConversations: InboxLog[] = [];
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
    return { selectedApp: app };
  }

  @MutationAction({ mutate: ['conversations'], rawError: true })
  async [DataAction.fetchConversations]() {
    const result = await Api.getLastConversations();
    return { conversations: result };
  }

  @MutationAction({ mutate: ['selectedUserConversations'], rawError: true })
  async [DataAction.fetchUserConversations](
    selectUserConversationsDto: SelectUserConversationsDto,
  ) {
    const result = await Api.getUserConversations(selectUserConversationsDto);
    return { selectedUserConversations: result.logs };
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