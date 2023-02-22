<template>
  <div class="relative bg-jovo-blue">
    <div class="max-w-8xl mx-auto px-2 sm:px-5">
      <div class="flex justify-between items-center p-3 md:justify-start md:space-x-10">
        <div class="flex flex-col lg:w-0 lg:flex-1">
          <div class="flex items-center">
            <a href="/" class="flex items-center">
              <img class="h-8 w-auto" src="@/assets/logo.png" alt="logo" />
              <span class="ml-0.5 text-base font-extralight text-white">INBOX</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'inbox-header',
  components: {},
})
export default class InboxHeader extends Vue {}
</script>
<style lang="scss"></style>
