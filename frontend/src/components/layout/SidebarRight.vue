<template>
  <aside class="hidden relative xl:flex xl:flex-col flex-shrink-0 w-4/12 border-l  border-gray-200">
    <!-- Start secondary column (hidden on smaller screens) -->
    <div class="text-right px-7 py-7">
      <button
        type="button"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <!-- Heroicon name: mail -->
        <share2-icon size="16" class="mr-2"></share2-icon>
        Share
      </button>
    </div>
    <div v-if="!!conversation" class="text-center">
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

      <div v-if="!isNameEdit" class="mt-4 text-sm" @click="editName">
        {{ user.name || shortenUserId(conversation) }}
      </div>
      <div v-else class="mt-4 text-sm w-24 m-auto">
        <input
          type="text"
          name="first_name"
          v-model="user.name"
          @blur="handleSaveUserName"
          ref="name"
          id="name"
          @keyup.enter="handleSaveUserName"
          placeholder="Name"
          autocomplete="given-name"
          class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div class="mt-8">
        <div class="tracking-wide text-gray-400 text-xs uppercase">Devices</div>
      </div>

      <div class="mt-8  px-7">
        <div class="tracking-wide text-gray-400 mb-2 text-xs uppercase">Notes</div>
        <textarea
          id="about"
          name="about"
          rows="5"
          v-model="user.notes"
          @blur="handleSaveUser"
          class="shadow-sm focus:ring-light-blue-500 focus:border-light-blue-500 mt-1 block w-full sm:text-sm border-gray-200 rounded-md bg-gray-50"
        ></textarea>
      </div>
    </div>
    <!-- End secondary column -->
  </aside>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Share2Icon } from 'vue-feather-icons';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import { InboxLog } from 'jovo-inbox-core';
import { InboxLogUser } from 'jovo-inbox-core/dist/InboxLogUser';
import { Api } from '@/Api';

@Component({
  name: 'sidebar-right',
  components: { Share2Icon },
})
export default class SidebarRight extends mixins(BaseMixin) {
  isNameEdit = false;

  user: Partial<InboxLogUser> = {};

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
        appId: this.conversation.appId,
        platformUserId: this.conversation.userId,
        notes: this.user.notes,
        name: this.user.name,
      });
      await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
    } catch (e) {
      console.log(e);
    }
  }

  async handleFileUpload() {
    const file = (this.$refs.file as any).files[0];
    const formData = new FormData();

    if (!this.conversation) {
      return;
    }

    /*
        Add the form data we need to submit
    */
    formData.append('images', file);
    try {
      await Api.uploadUserImage(
        {
          appId: this.conversation.appId,
          platformUserId: this.conversation.userId,
        },
        formData,
      );
      (this.$refs.file as any).value = '';
      await this.getInboxLogUserData();
      await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
    } catch (e) {
      console.log(e);
    }
  }

  get conversation(): InboxLog | undefined {
    if (this.selectedConversations.length > 0) {
      return this.selectedConversations[0];
    }
    return undefined;
  }

  editName() {
    this.isNameEdit = true;

    // TODO: focus doesn't work
    // (this.$refs['name'] as HTMLElement).focus();
  }

  @Watch('conversation')
  async onConversationChange() {
    this.user = {
      name: this.shortenUserId(this.conversation!),
    };

    await this.getInboxLogUserData();
  }

  async handleDeleteImage() {
    try {
      const result = await Api.deleteUserImage(this.user.id as string);
      this.user = {
        ...result.data,
      };
      await this.getInboxLogUserData();
      await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
    } catch (e) {
      console.log(e);
    }
  }

  async getInboxLogUserData() {
    try {
      if (!this.conversation) {
        return;
      }
      const result = await Api.getInboxLogUser({
        platformUserId: this.conversation.userId,
        appId: this.conversation.appId,
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
<style lang="scss"></style>
