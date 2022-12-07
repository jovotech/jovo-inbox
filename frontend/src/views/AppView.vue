<template>
  <div class="flex overflow-hidden bg-white">
    <sidebar-left></sidebar-left>
    <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
      <div v-if="isAppView" class="flex-1 relative z-0 flex overflow-hidden p-8 bg-gray-100"></div>
      <div v-if="isConversationView" class="flex-1 relative z-0 flex overflow-hidden">
        <main-panel></main-panel>
        <sidebar-right></sidebar-right>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import SidebarLeft from '@/components/layout/SidebarLeft.vue';
import MainPanel from '@/components/layout/MainPanel.vue';
import SidebarRight from '@/components/layout/SidebarRight.vue';
@Component({
  name: 'app-view',
  components: { SidebarRight, MainPanel, SidebarLeft },
})
export default class AppView extends mixins(BaseMixin) {
  get isAppView() {
    return this.$route.name === 'app';
  }

  get isConversationView() {
    return this.$route.name === 'conversation' || this.$route.name === 'sessions';
  }

  @Watch('app')
  async onAppChanged() {
    await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
  }
}
</script>
