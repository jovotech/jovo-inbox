import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from '@/main';
import { InboxLog } from '../../core/src';
import {
  GetInboxLogUserDto,
  JovoAppList,
  SelectUserConversationsDto,
  UpdateInboxLogUserDto,
} from 'jovo-inbox-core';
import { UserConversationsResponse } from 'jovo-inbox-core/dist/UserConversationsResponse';
import { InboxLogUser } from 'jovo-inbox-core/dist/InboxLogUser';

export class Api {
  static async getLastConversations() {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `${BASE_URL}/inboxlog`,
    };

    const result = await axios.request<InboxLog[]>(config);
    if (result.status === 200 && result.data) {
      return result.data;
    }
    throw new Error('Could not load last conversations.');
  }
  static async getUserConversations(selectUserConversationsDto: SelectUserConversationsDto) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_URL}/inboxlog/user/conversation`,
      data: selectUserConversationsDto,
    };
    const result = await axios.request<UserConversationsResponse>(config);
    if (result.status === 201 && result.data) {
      return result.data;
    }
    throw new Error('Could not load last conversations.');
  }

  static async getApps() {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `${BASE_URL}/jovo-app`,
    };
    const result = await axios.request<JovoAppList>(config);
    if (result.status === 200 && result.data) {
      return result.data;
    }
    throw new Error('Could not load last conversations.');
  }

  static async updateInboxLogUser(updateInboxLogUserDto: UpdateInboxLogUserDto) {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `${BASE_URL}/inboxloguser`,
      data: updateInboxLogUserDto,
    };

    return await axios.request<InboxLogUser>(config);
  }

  static async getInboxLogUser(getInboxLogUserDto: GetInboxLogUserDto) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_URL}/inboxloguser`,
      data: getInboxLogUserDto,
    };
    return await axios.request<InboxLogUser>(config);
  }

  static async getInboxAppUsers(appId: string) {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `${BASE_URL}/inboxloguser/${appId}`,
    };
    return await axios.request<InboxLogUser[]>(config);
  }
  static async getInboxLogUserConversations(getInboxLogUserDto: Pick<GetInboxLogUserDto, 'id'>) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_URL}/inboxloguser/conversations`,
      data: getInboxLogUserDto,
    };
    return await axios.request<InboxLogUser[]>(config);
  }
  static async uploadUserImage(
    updateInboxLogUserDto: Pick<UpdateInboxLogUserDto, 'appId' | 'platformUserId'>,
    data: FormData,
  ): Promise<any> {
    data.append('appId', updateInboxLogUserDto.appId);
    data.append('platformUserId', updateInboxLogUserDto.platformUserId);

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${BASE_URL}/inboxloguser/upload-image`,
      data,
    };

    return await axios.request<any>(config);
  }

  static async deleteUserImage(jovoAppUserId: string): Promise<any> {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `${BASE_URL}/inboxloguser/${jovoAppUserId}/delete-image`,
    };
    return await axios.request<any>(config);
  }
}
