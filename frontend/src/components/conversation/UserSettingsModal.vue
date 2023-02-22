<template>
  <div
    v-if="show"
    class="relative z-10"
    @click="close"
    @keydown.esc="close"
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
          <div class="px-2 pt-5 pb-4 sm:my-8 sm:p-6">
            <div class="flex items-center">
              <div class="hidden relative rounded-full overflow-hidden lg:block m-auto">
                <img
                  v-if="getImage(conversation, 40)"
                  class="h-40 w-40 rounded-full m-auto"
                  :src="getImage(conversation, 40)"
                  :title="conversation.userId"
                  alt=""
                />
                <svg
                  v-else
                  class="w-40 h-auto text-xs text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clip-rule="evenodd"
                  />
                </svg>
                <label
                  v-if="user.image"
                  for="user-photo"
                  @click="handleDeleteImage"
                  class="absolute cursor-pointer inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
                >
                  <span>Remove</span>
                  <span class="sr-only"> remove user photo</span>
                </label>
                <label
                  v-else
                  for="user-photo"
                  class="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
                >
                  <span>Change</span>
                  <span class="sr-only"> user photo</span>
                  <input
                    type="file"
                    id="user-photo"
                    name="user-photo"
                    ref="file"
                    v-on:change="handleFileUpload()"
                    accept="image/png, image/jpeg, image/jpg"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
                  />
                </label>
              </div>
            </div>

            <div class="flex items-center justify-center">
              <div v-if="!isNameEdit" class="group mt-4 text-sm">
                {{ user.name || shortenUserId(conversation) }}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  class="w-3 h-auto inline ml-1 cursor-pointer text-gray-600 hover:text-gray-700"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  @click="editName"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <div v-else class="mt-4 text-sm m-auto flex">
                <input
                  type="text"
                  name="first_name"
                  v-model="user.name"
                  @keydown.enter="handleSaveUserName"
                  ref="name"
                  id="name"
                  placeholder="Name"
                  autocomplete="given-name"
                  class="w-24 block m-auto shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
                <svg
                  @click="handleSaveUserName"
                  class="w-3 h-auto inline ml-1 cursor-pointer text-gray-600 hover:text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
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

                <svg
                  @click="cancelEditName"
                  class="w-3 h-auto inline ml-1 cursor-pointer text-gray-600 hover:text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <div class="mt-8 px-0">
              <div class="tracking-wide text-gray-400 mb-2 text-xs uppercase">Notes</div>
              <textarea
                id="about"
                name="about"
                rows="7"
                v-model="user.notes"
                class="shadow-sm focus:ring-light-blue-500 focus:border-light-blue-500 mt-1 block w-full sm:text-sm border-gray-200 rounded-md bg-gray-50"
              ></textarea>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              @click="handleSaveUser"
              type="button"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-jovo-blue px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-jovo-blue focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="cancel()"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import { InboxLog, InboxLogUser } from 'jovo-inbox-core';
import 'vue-json-pretty/lib/styles.css';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { Api } from '@/Api';

@Component({
  name: 'user-settings-modal',
  components: {},
})
export default class UserSettingsModal extends mixins(BaseMixin) {
  @Prop({ type: Boolean, default: false }) show!: boolean;

  isNameEdit = false;
  user: Partial<InboxLogUser> = {};

  oldNameValue = '';

  async handleSaveUserName() {
    this.isNameEdit = false;
    await this.handleSaveUser();
  }

  async handleSaveUser() {
    if (!this.conversation) {
      return;
    }
    try {
      await Api.updateInboxLogUser({
        projectId: this.conversation.projectId,
        platformUserId: this.conversation.userId,
        notes: this.user.notes,
        name: this.user.name,
      });
      await this.$store.dispatch('DataModule/buildProjectUsersMap', this.project.id);
      this.cancel();
    } catch (e: any) {
      this.$notify.error(`Could not save user: ${e.message}`);
    }
  }

  async handleFileUpload() {
    const file = (this.$refs.file as HTMLFormElement).files[0];
    const formData = new FormData();

    if (!this.conversation) {
      return;
    }

    formData.append('images', file);
    try {
      await Api.uploadUserImage(
        {
          projectId: this.conversation.projectId,
          platformUserId: this.conversation.userId,
        },
        formData,
      );
      (this.$refs.file as HTMLFormElement).value = '';
      await this.getInboxLogUserData();
      await this.$store.dispatch('DataModule/buildProjectUsersMap', this.project.id);
    } catch (e: any) {
      this.$notify.error(`Could not upload image: ${e.message}`);
    }
  }

  editName() {
    this.isNameEdit = true;
    if (this.user?.name) {
      this.oldNameValue = this.user.name;
    }
    this.$nextTick(() => {
      (this.$refs.name as HTMLFormElement).focus();
    });
  }
  cancelEditName() {
    this.isNameEdit = false;
    this.user.name = this.oldNameValue;
  }

  get conversation(): InboxLog | undefined {
    if (this.selectedConversations.length > 0) {
      return this.selectedConversations[0];
    }
    return undefined;
  }

  @Watch('show')
  async onConversationChange() {
    if (this.show && this.conversation) {
      this.user = {
        name: this.shortenUserId(this.conversation),
      };
      await this.getInboxLogUserData();
    }
  }

  close(event: MouseEvent) {
    if (!(this.$refs.modal as HTMLElement).contains(event.target as HTMLElement)) {
      this.$emit('close');
    }
  }

  cancel() {
    this.$emit('close');
  }

  async handleDeleteImage() {
    try {
      if (this.user?.id) {
        await Api.deleteUserImage({
          projectId: this.project.id,
          jovoProjectUserId: this.user.id,
        });
        this.user.image = undefined;
        await this.getInboxLogUserData();
        await this.$store.dispatch('DataModule/buildProjectUsersMap', this.project.id);
      }
    } catch (e: any) {
      this.$notify.error(`Could not delete image: ${e.message}`);
    }
  }

  async getInboxLogUserData() {
    try {
      if (!this.conversation) {
        return;
      }
      const result = await Api.getInboxLogUser({
        platformUserId: this.conversation.userId,
        projectId: this.conversation.projectId,
      });

      this.user = {
        ...result.data,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
</script>
