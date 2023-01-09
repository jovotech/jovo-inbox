<template>
  <div
    v-if="show"
    class="relative z-10"
    @keydown.esc="cancel()"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!--
      Background backdrop, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!--
          Modal panel, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
          
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        -->
        <div
          ref="modal"
          class="relative sm:w-full sm:max-w-sm transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
        >
          <div
            class="flex items-center justify-between bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg border-b border-gray-200 flex-shrink-0"
          >
            <h3 class="text-lg leading-6 font-medium text-gray-900">Edit project</h3>
            <!---->
          </div>

          <div class="px-2 pt-5 pb-4 sm:my-8 sm:p-6">
            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200">
              <label for="name" class="flex text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Name <span class="text-sm text-red-400 ml-1">*</span>
              </label>
              <div class="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="name"
                  v-model="model.name"
                  ref="name"
                  id="name"
                  placeholder="Name"
                  autocomplete="off"
                  data-lpignore="true"
                  class="block m-auto shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 mt-4">
              <label for="name" class="flex text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Project id <span class="text-sm text-red-400 ml-1">*</span>
              </label>
              <div class="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="id"
                  v-model="model.id"
                  ref="id"
                  id="id"
                  data-lpignore="true"
                  placeholder="project id"
                  autocomplete="off"
                  class="block m-auto shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:px-6 flex justify-between">
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              @click="handleDeleteProject()"
            >
              Delete
            </button>
            <div class="flex-1 text-right">
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="cancel()"
              >
                Cancel
              </button>
              <button
                @click="handleUpdateProject()"
                type="button"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-jovo-blue px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-jovo-blue focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Project } from 'jovo-inbox-core';
import 'vue-json-pretty/lib/styles.css';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { Api } from '@/Api';
import { ModalMixin } from '@/mixins/ModalMixin';

export type EditProjectModel = Pick<Project, 'id' | 'name'>;

@Component({
  components: {},
})
export default class EditProjectModal extends mixins(BaseMixin, ModalMixin) {
  @Prop({ type: Boolean, default: false }) show!: boolean;

  model: EditProjectModel | null = null;

  async handleUpdateProject() {
    try {
      if (this.model) {
        const response = await Api.updateProject(this.project.id, {
          name: this.model.name,
          id: this.model.id,
        });
        this.$emit('updated', response.data);
        this.$emit('close');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async handleDeleteProject() {
    try {
      if (this.model) {
        await this.$store.dispatch('DataModule/deleteProject', this.model);
        this.$emit('deleted');
        this.$emit('close');
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Watch('show', { immediate: true })
  onShowChanged() {
    if (this.show) {
      this.model = this.resetModel();
      document.addEventListener('keyup', this.closeModalListener);
    } else {
      document.removeEventListener('keyup', this.closeModalListener);
    }
  }

  resetModel() {
    return {
      id: this.project.id,
      name: this.project.name,
    };
  }

  handleNameChange() {
    if (this.model) {
      this.model.id = this.model.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  }
}
</script>
