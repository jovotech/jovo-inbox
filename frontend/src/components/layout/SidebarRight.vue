<template>
  <aside class="hidden relative xl:flex xl:flex-col flex-shrink-0 w-4/12 border-l  border-gray-200">
    <!-- Start secondary column (hidden on smaller screens) -->

    <div class="flex justify-between">
      <div class="flex items-center"></div>
      <div v-if="!!conversation" class="text-right px-5 py-5">
        <button
          v-if="!isCopied"
          type="button"
          @click="handleShareConversation"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-jovo-blue bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <!-- Heroicon name: mail -->
          <share2-icon size="16" class="mr-2"></share2-icon>
          Share
        </button>
        <span v-else class="inline-flex text-sm items-center px-3 py-2 "
          >Link copied to clipboard!</span
        >
      </div>
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
      <div v-else class="mt-4 text-sm m-auto">
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

      <div class="mt-8">
        <div class="tracking-wide text-gray-400 text-xs uppercase mb-2">Devices</div>

        <span
          v-for="device in devices"
          v-bind:key="device.platform + '-' + device.name"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 mr-1 mb-1"
        >
          <img class="h-3 w-3 mr-1" :src="device.image" />
          {{ device.name }}
        </span>
      </div>

      <div class="mt-8  px-7">
        <div class="tracking-wide text-gray-400 mb-2 text-xs uppercase">Notes</div>
        <textarea
          id="about"
          name="about"
          rows="7"
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
import { Component, Watch } from 'vue-property-decorator';
import { CheckIcon, Share2Icon } from 'vue-feather-icons';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import { InboxLog, InboxLogType } from 'jovo-inbox-core';
import { InboxLogUser } from 'jovo-inbox-core/dist/InboxLogUser';
import { Api } from '@/Api';

interface Device {
  name: string;
  platform: string;
  image: string;
}
@Component({
  name: 'sidebar-right',
  components: { Share2Icon, CheckIcon },
})
export default class SidebarRight extends mixins(BaseMixin) {
  isNameEdit = false;
  devices: Device[] = [];

  user: Partial<InboxLogUser> = {};
  isCopied = false;
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
    const file = (this.$refs.file as HTMLFormElement).files[0];
    const formData = new FormData();

    if (!this.conversation) {
      return;
    }

    formData.append('images', file);
    try {
      await Api.uploadUserImage(
        {
          appId: this.conversation.appId,
          platformUserId: this.conversation.userId,
        },
        formData,
      );
      (this.$refs.file as HTMLFormElement).value = '';
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
    if (this.user?.name) {
      this.oldNameValue = this.user.name;
    }
    // TODO: focus doesn't work
    // (this.$refs['name'] as HTMLElement).focus();
  }
  cancelEditName() {
    this.isNameEdit = false;

    this.user.name = this.oldNameValue;
  }

  @Watch('conversation')
  async onConversationChange() {
    if (this.conversation) {
      this.user = {
        name: this.shortenUserId(this.conversation),
      };
      this.isCopied = false;
      this.getDevices();
      await this.getInboxLogUserData();
    }
  }

  async handleShareConversation() {
    if (!this.conversation) {
      return;
    }

    if (!this.user.id) {
      try {
        await Api.updateInboxLogUser({
          appId: this.conversation.appId,
          platformUserId: this.conversation.userId,
        });
        await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
        await this.getInboxLogUserData();
      } catch (e) {
        console.log(e);
      }
    }
    this.isCopied = true;
    this.$clipboard(`${window.location.origin}/user/${this.user.id}`);
  }

  async handleDeleteImage() {
    try {
      if (this.user?.id) {
        await Api.deleteUserImage({
          appId: this.app.id,
          jovoAppUserId: this.user.id,
        });
        this.user.image = undefined;
        await this.getInboxLogUserData();
        await this.$store.dispatch('DataModule/buildAppUsersMap', this.app.id);
      }
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

  getDevices() {
    this.devices = [];

    const detectedDevices: Device[] = [];
    this.selectedConversations.forEach((log: InboxLog) => {
      if (log.type === InboxLogType.REQUEST) {
        const platform = this.getPlatform(log);

        if (platform) {
          const requestConstructor = platform?.requestClass;

          const request = Object.assign(new requestConstructor(), log.payload);
          detectedDevices.push({
            name: request.getDeviceName(),
            platform: platform.name,
            image: platform?.image64x64,
          });
        }
      }
    });

    // remove duplicates
    this.devices = detectedDevices.filter(
      (v: Device, i: number, a: Device[]) =>
        a.findIndex((t: Device) => JSON.stringify(t) === JSON.stringify(v)) === i,
    );
  }
}
</script>
<style lang="scss"></style>
