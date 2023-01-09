<template>
  <div>
    <label for="search" class="sr-only">Search</label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        aria-hidden="true"
      >
        <!-- Heroicon name: search -->
        <svg
          class="mr-3 h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        name="search"
        id="search"
        v-model="search"
        @change="handleSearch"
        @keydown="handleSearch"
        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
        placeholder="Search users"
      />

      <div
        class="absolute inset-y-0 right-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
        aria-hidden="true"
        @click="open"
        ref="button"
      >
        <!-- Heroicon name: settings -->
        <svg
          class="mr-3 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </div>
      <div
        v-if="opened"
        class="z-40 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200"
        role="menu"
        ref="popover"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div class="py-1">
          <div
            @click="handleFilterSelectedWithErrors()"
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex justify-between items-center"
            role="menuitem"
          >
            <span>Conversations with errors</span>
            <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
            <span
              v-if="filterSelectedWithErrors"
              class="text-primary-600 group-hover:text-jovo-blue flex items-center"
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
          </div>
        </div>

        <div v-if="filterPlatforms.length > 1" class="py-1">
          <div
            v-for="platform in filterPlatforms"
            v-bind:key="platform"
            @click="handleFilterSelectedPlatform(platform)"
            class="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex justify-between items-center"
            role="menuitem"
          >
            <span>{{ platform }}</span>
            <span
              v-if="filterSelectedPlatform && filterSelectedPlatform === platform"
              class="text-primary-600 group-hover:text-jovo-blue flex items-center"
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
          </div>
        </div>
        <div class="py-1">
          <div
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex justify-between items-center"
            role="menuitem"
          >
            <span>Live Mode</span>
            <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
            <button
              type="button"
              @click="toggleLiveMode"
              class="ml-3 relative inline-flex flex-shrink-0 h-4 w-6 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-pressed="false"
              aria-labelledby="annual-billing-label"
              :class="[isLiveMode ? 'bg-indigo-600' : 'bg-gray-200']"
            >
              <span class="sr-only">Use setting</span>
              <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
              <span
                aria-hidden="true"
                class="pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                :class="[isLiveMode ? 'translate-x-2' : 'translate-x-0']"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';
import { Watch } from 'vue-property-decorator';
import { Api } from '@/Api';
import { LIVE_MODE_POLLING_INTERVAL_IN_MS } from '@/constants';

@Component({
  name: 'filter-settings',
  components: {},
})
export default class FilterSettings extends mixins(BaseMixin) {
  opened = false;
  search = '';
  filterSelectedPlatform: string | null = null;
  filterSelectedWithErrors = false;
  searchTimeout?: number;
  filterPlatforms: string[] = [];
  interval?: number;

  async mounted() {
    await this.updateProjectPlatforms();
  }

  async updateProjectPlatforms() {
    if (this.project.id) {
      const response = await Api.getProjectPlatforms(this.project.id);

      this.filterPlatforms = response.data;
    }
  }

  @Watch('project')
  async onProjectChange() {
    await this.updateProjectPlatforms();
  }

  getFilter() {
    return {
      projectId: this.project.id,
      withErrors: this.filterSelectedWithErrors,
      platform: this.filterSelectedPlatform,
    };
  }

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
  async handleFilter() {
    this.opened = false;
    this.$emit('loadConversations', {
      projectId: this.project.id,
      withErrors: this.filterSelectedWithErrors,
      platform: this.filterSelectedPlatform,
    });
  }

  @Watch('filterSelectedWithErrors')
  async watchFilterSelectedWithErrors() {
    this.$emit('loadConversations', {
      projectId: this.project.id,
      withErrors: this.filterSelectedWithErrors,
      platform: this.filterSelectedPlatform,
    });
  }

  async handleFilterSelectedWithErrors() {
    this.filterSelectedWithErrors = !this.filterSelectedWithErrors;
    await this.handleFilter();
  }

  async handleFilterSelectedPlatform(platform: string) {
    if (this.filterSelectedPlatform && this.filterSelectedPlatform === platform) {
      this.filterSelectedPlatform = null;
    } else {
      this.filterSelectedPlatform = platform;
    }
    await this.handleFilter();
  }

  async toggleLiveMode() {
    const val = !this.isLiveMode;
    await this.$store.dispatch('PreferencesModule/updateLiveMode', val);
  }

  async handleSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(async () => {
      await this.$store.dispatch('DataModule/clearConversations');
      this.$emit('updateSearchLoading', true);

      await this.$store.dispatch('DataModule/fetchConversations', {
        projectId: this.project.id,
        search: this.search,
      });
      this.$emit('updateSearchLoading', false);
    }, 500);
  }

  @Watch('isLiveMode')
  async watchLiveMode() {
    if (this.isLiveMode) {
      this.interval = window.setInterval(async () => {
        this.$emit('loadConversations', {
          projectId: this.project.id,
          withErrors: this.filterSelectedWithErrors,
          platform: this.filterSelectedPlatform,
        });
      }, LIVE_MODE_POLLING_INTERVAL_IN_MS);
    } else {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  }
}
</script>
