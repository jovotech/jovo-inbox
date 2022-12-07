<template>
  <aside
    @mouseenter="isContentHovered = true"
    @mouseleave="isContentHovered = false"
    :class="[isContentHovered ? 'scrollbar' : 'scrollbar-invisible']"
    class="hidden overflow-y-auto relative xl:flex xl:flex-col flex-shrink-0 w-4/12 border-l border-gray-200"
  >
    <!-- Start secondary column (hidden on smaller screens) -->

    <div class="flex justify-between">
      <div class="flex items-center"></div>
      <div v-if="!!conversation" class="text-right px-5 py-5 flex">
        <button
          type="button"
          @click="showSettingsModal = !showSettingsModal"
          class="inline-flex items-center px-3 py-2 mr-2 border border-transparent text-sm leading-4 font-medium rounded-md text-jovo-blue bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <!-- Heroicon name: mail -->
          <user-icon size="16" class="mr-2"></user-icon>
          User settings
        </button>
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
        <span v-else class="inline-flex text-sm items-center px-3 py-2"
          >Link copied to clipboard!</span
        >
      </div>
    </div>

    <div v-if="!!conversation" class="text-center">
      <div v-if="selectedInteraction" class="p-3 mt-4 text-left">
        <div v-for="(log, index) in selectedInteraction.logs" v-bind:key="log.id" class="">
          <div class="bg-white shadow-sm rounded-lg border">
            <inbox-log-type-detail :log="log"></inbox-log-type-detail>
          </div>
          <div
            v-if="index < selectedInteraction.logs.length - 1"
            class="w-0 h-4 border-r-2 border-t-0 pl-6"
          ></div>
        </div>
      </div>
    </div>
    <user-settings-modal
      :show="showSettingsModal"
      @close="showSettingsModal = false"
    ></user-settings-modal>
    <!-- End secondary column -->
  </aside>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { CheckIcon, Share2Icon, UserIcon } from 'vue-feather-icons';
import { BaseMixin } from '@/mixins/BaseMixin';
import { mixins } from 'vue-class-component';
import { InboxLog } from 'jovo-inbox-core';
import { InboxLogUser } from 'jovo-inbox-core';
import { Api } from '@/Api';
import InboxLogTypeDetail from '@/components/conversation/InboxLogTypeDetail.vue';
import UserSettingsModal from '@/components/conversation/UserSettingsModal.vue';

@Component({
  name: 'sidebar-right',
  components: { UserSettingsModal, InboxLogTypeDetail, Share2Icon, CheckIcon, UserIcon },
})
export default class SidebarRight extends mixins(BaseMixin) {
  showSettingsModal = false;
  isCopied = false;

  user: Partial<InboxLogUser> = {};
  isContentHovered = false;

  get conversation(): InboxLog | undefined {
    if (this.selectedConversations.length > 0) {
      return this.selectedConversations[0];
    }
    return undefined;
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
        // await this.getInboxLogUserData();
      } catch (e) {
        console.log(e);
      }
    }
    this.isCopied = true;
    this.$clipboard(`${window.location.origin}/user/${this.user.id}`);
  }
}
</script>
<style lang="scss"></style>
