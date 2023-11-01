import { Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators';
import {
  InboxLog,
  SelectUserConversationsDto,
  InboxLogUser,
  GetLastConversationsDto,
  Interaction,
  Project,
} from '@jovotech/inbox-core';
import { Api } from '@/Api';

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
  async fetchProjects() {
    const result = await Api.getProjects();
    return { projects: result };
  }

  @MutationAction({ mutate: ['selectedProject'], rawError: true })
  async selectProject(project: Project) {
    document.title = project.name + ' -  Jovo Inbox';
    return { selectedProject: project };
  }

  @Mutation
  addProject(project: Project) {
    this.projects.push(project);
  }

  @MutationAction({ mutate: ['projects'], rawError: true })
  async deleteProject(project: Project) {
    await Api.deleteProject(project.id);
    const responseGetProjects = await Api.getProjects();

    return { projects: responseGetProjects };
  }

  @MutationAction({ mutate: ['conversations'], rawError: true })
  async fetchConversations(getLastConversationsDto: GetLastConversationsDto) {
    const result = await Api.getLastConversations(getLastConversationsDto);
    return { conversations: result };
  }

  @MutationAction({ mutate: ['conversations'], rawError: true })
  async clearConversations() {
    return { conversations: [] };
  }

  @MutationAction({ mutate: ['selectedUserConversations'], rawError: true })
  async fetchUserConversations(selectUserConversationsDto: SelectUserConversationsDto) {
    const result = await Api.getUserConversations(selectUserConversationsDto);
    return { selectedUserConversations: result.logs };
  }

  @MutationAction({ mutate: ['selectedUserConversations'], rawError: true })
  async appendUserConversations(selectUserConversationsDto: SelectUserConversationsDto) {
    const result = await Api.getUserConversations(selectUserConversationsDto);
    const selectedUserConversations = (this.state as DataState).selectedUserConversations;
    return { selectedUserConversations: selectedUserConversations.concat(result.logs) };
  }

  @MutationAction({ mutate: ['conversations'], rawError: true })
  async appendLastConversations(getLastConversationsDto: GetLastConversationsDto) {
    const result = await Api.getLastConversations(getLastConversationsDto);
    const conversations = (this.state as DataState).conversations;
    return { conversations: conversations.concat(result) };
  }

  @MutationAction({ mutate: ['selectedInboxLog'], rawError: true })
  async selectInboxLog(inboxLog: InboxLog) {
    return { selectedInboxLog: inboxLog };
  }

  @MutationAction({ mutate: ['selectedInteraction'], rawError: true })
  async selectInteraction(interaction: Interaction) {
    return { selectedInteraction: interaction };
  }

  @MutationAction({ mutate: ['nameMap'], rawError: true })
  async buildProjectUsersMap(projectId: string) {
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
