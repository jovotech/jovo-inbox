import { Module, MutationAction, VuexModule } from 'vuex-module-decorators';
import { GetLastConversationsDto } from '@jovotech/inbox-core';

export interface PreferencesState {
  liveMode: boolean;
  detailViewWidth: number;
  filterSettings: GetLastConversationsDto;
}

@Module({ namespaced: true, name: 'PreferencesModule' })
export class PreferencesModule extends VuexModule<PreferencesState> {
  liveMode = false;
  detailViewWidth = 250;
  filterSettings: GetLastConversationsDto | null = null;

  @MutationAction({ mutate: ['liveMode'], rawError: true })
  async updateLiveMode(value: boolean) {
    return { liveMode: value };
  }

  @MutationAction({ mutate: ['detailViewWidth'], rawError: true })
  async updateDetailViewWidth(value: number) {
    return { detailViewWidth: value };
  }

  @MutationAction({ mutate: ['filterSettings'], rawError: true })
  async updateFilterSettings(dto: GetLastConversationsDto) {
    return { filterSettings: dto };
  }
}
