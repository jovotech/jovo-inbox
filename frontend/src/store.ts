import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import { DataModule, DataState } from '@/store/DataModule';
import { PreferencesModule, PreferencesState } from '@/store/PreferencesModule';

export interface RootState {
  data: DataState;
  preferences: PreferencesState;
}

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  modules: ['DataModule', 'PreferencesModule'],
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
  },
  plugins: [vuexLocal.plugin, vuexSession.plugin],
});
