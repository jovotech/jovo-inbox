import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import { DataModule, DataState } from '@/store/DataModule';
import { PreferencesModule, PreferencesState } from '@/store/PreferencesModule';
import { NotificationsModule, NotificationsModuleState } from '@/store/notifications';

export interface RootState {
  data: DataState;
  preferences: PreferencesState;

  notifications: NotificationsModuleState;
}

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  modules: ['DataModule', 'PreferencesModule', 'NotificationsModule'],
});

const vuexSession = new VuexPersistence<RootState>({
  storage: window.sessionStorage,
  modules: [],
});

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    DataModule,
    PreferencesModule,
    NotificationsModule,
  },
  plugins: [vuexLocal.plugin, vuexSession.plugin],
});
