import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  CreateProjectDto,
  DeleteUserImageDto,
  GetInboxLogUserDto,
  GetLastConversationsDto,
  InboxLog,
  InboxLogUser,
  Interaction,
  Project,
  SelectUserConversationsDto,
  UpdateInboxLogUserDto,
  UserConversationsResponse,
} from 'jovo-inbox-core';
import { BASE_API_URL } from '@/constants';

export class Api {
  static async getLastConversations(getLastConversationsDto: GetLastConversationsDto) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_API_URL}/logs/conversations`,
      data: getLastConversationsDto,
    };

    const result = await axios.request<Interaction[]>(config);
    if (result.status === 201 && result.data) {
      return result.data;
    }
    throw new Error('Could not load last conversations.');
  }
  static async getUserConversations(selectUserConversationsDto: SelectUserConversationsDto) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_API_URL}/logs/user/conversation`,
      data: selectUserConversationsDto,
    };
    const result = await axios.request<UserConversationsResponse>(config);
    if (result.status === 201 && result.data) {
      return result.data;
    }
    throw new Error('Could not load last conversations.');
  }

  static async getProjects() {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `${BASE_API_URL}/project`,
    };
    const result = await axios.request<Project[]>(config);
    if (result.status === 200 && result.data) {
      return result.data;
    }
    throw new Error('Could not load projects.');
  }

  static async updateInboxLogUser(updateInboxLogUserDto: UpdateInboxLogUserDto) {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `${BASE_API_URL}/inboxloguser`,
      data: updateInboxLogUserDto,
    };

    return await axios.request<InboxLogUser>(config);
  }

  static async getInboxLogUser(getInboxLogUserDto: GetInboxLogUserDto) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_API_URL}/inboxloguser`,
      data: getInboxLogUserDto,
    };
    return await axios.request<InboxLogUser>(config);
  }

  static async getInboxProjectUsers(projectId: string) {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `${BASE_API_URL}/inboxloguser/${projectId}`,
    };
    return await axios.request<InboxLogUser[]>(config);
  }

  static async getProjectPlatforms(projectId: string) {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `${BASE_API_URL}/logs/platform/${projectId}`,
    };
    return await axios.request<string[]>(config);
  }

  static async getInboxLogUserConversations(
    getInboxLogUserDto: Pick<GetInboxLogUserDto, 'id' | 'projectId'>,
  ) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_API_URL}/inboxloguser/conversations`,
      data: getInboxLogUserDto,
    };
    return await axios.request<{ logs: InboxLog[] }>(config);
  }
  static async uploadUserImage(
    updateInboxLogUserDto: Pick<UpdateInboxLogUserDto, 'projectId' | 'platformUserId'>,
    data: FormData,
  ): Promise<void> {
    data.append('projectId', updateInboxLogUserDto.projectId);
    data.append('platformUserId', updateInboxLogUserDto.platformUserId);

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_API_URL}/inboxloguser/upload-image`,
      data,
    };

    await axios.request<void>(config);
  }

  static async deleteUserImage(deleteUserImageDto: DeleteUserImageDto): Promise<void> {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `${BASE_API_URL}/inboxloguser/delete-image`,
      data: deleteUserImageDto,
    };
    await axios.request<void>(config);
  }

  static async createProject(dto: CreateProjectDto): Promise<AxiosResponse<Project>> {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `${BASE_API_URL}/project`,
      data: dto,
    };

    return await axios.request<Project>(config);
  }

  static async updateProject(
    projectId: string,
    dto: CreateProjectDto,
  ): Promise<AxiosResponse<Project>> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_API_URL}/project/${projectId}`,
      data: dto,
    };

    return await axios.request<Project>(config);
  }

  static async deleteProject(projectId: string): Promise<AxiosResponse<void>> {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `${BASE_API_URL}/project/${projectId}`,
    };

    return await axios.request<void>(config);
  }
}
