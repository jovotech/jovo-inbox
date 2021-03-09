<template>
  <div id="app" class="h-screen max-h-screen bg-gray-100 flex flex-col">
    <inbox-header></inbox-header>
    <div class=" flex overflow-hidden bg-white">
      <sidebar-left></sidebar-left>
      <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
        <div class="flex-1 relative z-0 flex overflow-hidden">
          <main-panel></main-panel>
          <sidebar-right></sidebar-right>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';

import InboxHeader from '@/components/layout/InboxHeader.vue';
import SidebarLeft from '@/components/layout/SidebarLeft.vue';
import SidebarRight from '@/components/layout/SidebarRight.vue';
import MainPanel from '@/components/layout/MainPanel.vue';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';

@Component({
  components: { MainPanel, SidebarRight, SidebarLeft, InboxHeader },
})
export default class App extends mixins(BaseMixin) {
  async mounted() {
    try {
      await this.$store.dispatch('DataModule/fetchApps');
      if (!this.app) {
        await this.$store.dispatch('DataModule/selectApp', this.$store.state.DataModule.apps[0]);
      } else {
        await this.$store.dispatch('DataModule/selectApp', this.app);
      }
      await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
    } catch (e) {
      console.log(e);
    }
  }

  @Watch('app')
  async onAppChanged() {
    await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
  }
}
</script>

<style lang="css">
@import './assets/css/theme.pcss';

body {
  margin: 0;
  padding: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
