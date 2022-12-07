<template>
  <div id="app" class="h-screen max-h-screen bg-gray-100 flex flex-col">
    <inbox-header></inbox-header>
    <router-view class="flex overflow-hidden bg-white w-full h-full" />
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

      if (this.$route.name == 'index') {
        this.$router
          .push({
            name: 'app',
            params: {
              appId: this.app.id,
            },
          })
          .catch(() => {
            //
          });
      }

      await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
    } catch (e) {
      console.log(e);
    }
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
