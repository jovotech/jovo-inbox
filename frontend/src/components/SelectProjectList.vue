<template>
  <div class="relative inline-block text-left w-full">
    <div>
      <button
        @click="open"
        type="button"
        ref="button"
        class="group w-full bg-gray-50 rounded-md px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500"
        id="options-menu"
        aria-haspopup="true"
      >
        <span class="flex w-full justify-between items-center">
          <span class="flex min-w-0 items-center justify-between space-x-3">
            <span class="flex-1 min-w-0">
              <span class="text-gray-900 text-sm font-medium truncate">{{ project.name }}</span>
            </span>
          </span>
          <svg
            class="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            x-description="Heroicon name: solid/selector"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
      </button>
    </div>
    <div
      v-if="opened"
      class="z-40 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200"
      role="menu"
      ref="popover"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <div
        class="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto scrollbar focus:outline-none sm:text-sm"
      >
        <span
          v-for="a in projects"
          v-bind:key="a.id"
          @click="selectProject(a)"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 group text-gray-900 cursor-default select-none relative pl-3 pr-9 hover:bg-primary-600 hover:text-white"
          role="menuitem"
          >{{ a.name }}

          <span
            v-if="a.id === project.id"
            class="text-primary-600 group-hover:text-jovo-blue absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              class="inline h-4 w-4"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        </span>
      </div>
      <span
        @click="handleOpenNewProjectModal()"
        class="block px-4 py-3 border-t text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 group text-gray-900 cursor-default select-none flex items-center relative pl-3 pr-9 hover:bg-primary-600 hover:text-white"
        role="menuitem"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4 mr-2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        Create new project
      </span>
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
import Component, { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { Project } from '@jovotech/inbox-core';
import NewProjectModal from '@/components/NewProjectModal.vue';

@Component({
  name: 'select-project-list',
  components: { NewProjectModal },
})
export default class SelectProjectList extends mixins(BaseMixin) {
  opened = false;
  showNewProjectModal = false;

  open() {
    if (this.opened) {
      this.close();
      return;
    }
    this.opened = true;
    document.body.addEventListener('click', this.onClick);
  }
  close() {
    this.opened = false;
    document.body.removeEventListener('click', this.onClick);
  }
  onClick(event: MouseEvent) {
    if (
      event.target &&
      (this.$refs.button as HTMLButtonElement | undefined)?.contains(event.target as HTMLElement)
    ) {
      return;
    }
    if (!this.opened || !event.target || !this.$refs.popover) return;
    if (!(this.$refs.popover as HTMLElement).contains(event.target as HTMLElement)) {
      this.close();
    }
  }
  async selectProject(project: Project) {
    await this.$store.dispatch('DataModule/selectProject', project);

    this.close();
    this.$emit('select-conversation');
    this.$router.push({ name: 'project', params: { projectId: project.id } }).catch(() => {
      // ignore
    });
  }
  handleOpenNewProjectModal() {
    this.showNewProjectModal = true;
    this.close();
  }

  async onNewProjectCreated(project: Project) {
    this.$store.commit('DataModule/addProject', project);
    await this.$store.dispatch('DataModule/selectProject', project);
  }
}
</script>
