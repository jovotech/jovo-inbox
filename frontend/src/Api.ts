import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from '@/main';
import { InboxLog } from '../../core/src';

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
  static async getUserConversations(userId: string) {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `${BASE_URL}/inboxlog/user/${userId}`,
    };
    console.log(config);
    const result = await axios.request<InboxLog[]>(config);
    if (result.status === 200 && result.data) {
      return result.data;
    }
    throw new Error('Could not load last conversations.');
  }
}
