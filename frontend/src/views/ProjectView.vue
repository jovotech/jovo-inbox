<template>
  <div class="flex overflow-hidden bg-white">
    <sidebar-left></sidebar-left>
    <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
      <div v-if="isProjectView" class="flex-1 relative overflow-hidden bg-white">
        <div v-if="project" class="flex px-5 py-5 w-full justify-end">
          <button
            type="button"
            @click="showEditProjectModal = true"
            class="inline-flex items-center px-3 py-2 mr-2 border border-transparent text-sm leading-4 font-medium rounded-md text-jovo-blue bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <!-- Heroicon name: mail -->
            <edit-icon size="16" class="mr-2"></edit-icon>
            Edit project
          </button>
        </div>
        <edit-project-modal
          v-if="showEditProjectModal"
          :show="showEditProjectModal"
          @close="showEditProjectModal = false"
          @updated="handleProjectUpdated"
          @deleted="handleProjectDeleted"
        ></edit-project-modal>
      </div>
      <div v-else-if="isConversationView" class="flex-1 relative z-0 flex overflow-hidden">
        <main-panel></main-panel>
        <sidebar-right></sidebar-right>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import SidebarLeft from '@/components/layout/SidebarLeft.vue';
import MainPanel from '@/components/layout/MainPanel.vue';
import SidebarRight from '@/components/layout/SidebarRight.vue';
import { EditIcon } from 'vue-feather-icons';
import EditProjectModal from '@/components/EditProjectModal.vue';
import { Project } from '@jovotech/inbox-core';

@Component({
  name: 'project-view',
  components: { EditProjectModal, SidebarRight, MainPanel, SidebarLeft, EditIcon },
})
export default class ProjectView extends mixins(BaseMixin) {
  showEditProjectModal = false;
  get isProjectView() {
    return this.$route.name === 'project';
  }

  get isConversationView() {
    return this.$route.name === 'conversation' || this.$route.name === 'sessions';
  }

  async handleProjectDeleted() {
    if (this.projects.length > 0) {
      await this.$store.dispatch(
        'DataModule/selectProject',
        this.$store.state.DataModule.projects[0],
      );
    }
  }

  async handleProjectUpdated(project: Project) {
    await this.$store.dispatch('DataModule/fetchProjects');
    await this.$store.dispatch('DataModule/selectProject', project);
  }
}
</script>
