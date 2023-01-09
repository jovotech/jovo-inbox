import { Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators';
import {
  InboxLog,
  SelectUserConversationsDto,
  InboxLogUser,
  GetLastConversationsDto,
  Interaction,
  Project,
} from 'jovo-inbox-core';
import { Api } from '@/Api';
export enum DataAction {
  fetchProjects = 'fetchProjects',
  addProject = 'addProject',
  deleteProject = 'deleteProject',

  fetchConversations = 'fetchConversations',
  clearConversations = 'clearConversations',

  searchConversations = 'searchConversations',

  fetchUserConversations = 'fetchUserConversations',

  appendUserConversations = 'appendUserConversations',
  appendLastConversations = 'appendLastConversations',

  buildProjectUsersMap = 'buildProjectUsersMap',

  selectProject = 'selectProject',
  selectInboxLog = 'selectInboxLog',
  selectInteraction = 'selectInteraction',
}

export interface DataState {
  projects: Project[];
  conversations: Interaction[];
  selectedUserConversations: InboxLog[];
  selectedProject: Project;
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
  projects: Project[] = [];
  conversations: Interaction[] = [];
  selectedUserConversations: InboxLog[] = [];

  selectedInboxLog: InboxLog | null = null;
  selectedInteraction: Interaction | null = null;

  selectedProject: Project | null = null;
  nameMap: Record<
    string,
    {
      name: string;
      image?: string;
    }
  > = {};

  @MutationAction({ mutate: ['projects'], rawError: true })
  async [DataAction.fetchProjects]() {
    const result = await Api.getProjects();
    return { projects: result };
  }

  @MutationAction({ mutate: ['selectedProject'], rawError: true })
  async [DataAction.selectProject](project: Project) {
    document.title = project.name + ' -  Jovo Inbox';
    return { selectedProject: project };
  }

  @Mutation
  [DataAction.addProject](project: Project) {
    this.projects.push(project);
  }

  @MutationAction({ mutate: ['projects'], rawError: true })
  async [DataAction.deleteProject](project: Project) {
    await Api.deleteProject(project.id);
    const responseGetProjects = await Api.getProjects();

    return { projects: responseGetProjects };
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
  async [DataAction.buildProjectUsersMap](projectId: string) {
    const result = await Api.getInboxProjectUsers(projectId);

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
