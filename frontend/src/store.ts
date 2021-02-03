import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import { DataModule, DataState } from '@/store/DataModule';
import { PreferencesState } from '../dist/frontend/src/store/PreferencesModule';

export interface RootState {
  data: DataState;
}

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  modules: ['DataModule'],
});

const vuexSession = new VuexPersistence<RootState>({
  storage: window.sessionStorage,
  modules: [],
});

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    DataModule,
  },
  plugins: [vuexLocal.plugin, vuexSession.plugin],
});
