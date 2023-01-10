<template>
  <div id="app" class="h-screen max-h-screen bg-gray-100 flex flex-col">
    <inbox-header></inbox-header>
    <router-view
      v-if="this.projects.length > 0"
      class="flex overflow-hidden bg-white w-full h-full"
    />
    <div v-else class="flex items-center justify-center h-screen">
      <div
        @click="showNewProjectModal = true"
        class="text-center text-lg py-3 px-4 border-2a flex items-center text-gray-600 hover:text-gray-800 border-dasheds rounded-lg cursor-pointer border-gray-500 hover:border-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 mr-2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>New project</span>
      </div>
    </div>
    <new-project-modal
      v-if="showNewProjectModal"
      :show="showNewProjectModal"
      @close="showNewProjectModal = false"
      @created="onNewProjectCreated"
    ></new-project-modal>
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
import NewProjectModal from '@/components/NewProjectModal.vue';
import { Project } from 'jovo-inbox-core';

@Component({
  components: { NewProjectModal, MainPanel, SidebarRight, SidebarLeft, InboxHeader },
})
export default class App extends mixins(BaseMixin) {
  showNewProjectModal = false;
  async mounted() {
    try {
      await this.$store.dispatch('DataModule/fetchProjects');

      if (this.projects.length === 0) {
        return;
      }

      if (!this.project) {
        await this.$store.dispatch(
          'DataModule/selectProject',
          this.$store.state.DataModule.projects[0],
        );
      } else {
        await this.$store.dispatch('DataModule/selectProject', this.project);
        this.$router
          .push({
            name: 'project',
            params: {
              projectId: this.project.id,
            },
          })
          .catch(() => {
            //
          });
      }
    } catch (e) {
      console.log(e);
    }
  }
  @Watch('project')
  async onProjectChanged() {
    this.$router
      .push({
        name: 'project',
        params: {
          projectId: this.project.id,
        },
      })
      .catch(() => {
        //
      });
    await this.$store.dispatch('DataModule/buildProjectUsersMap', this.project.id);
    await this.$store.dispatch('DataModule/fetchConversations', {
      projectId: this.project.id,
    });
  }
  async onNewProjectCreated(project: Project) {
    this.$store.commit('DataModule/addProject', project);
    await this.$store.dispatch('DataModule/selectProject', project);
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
