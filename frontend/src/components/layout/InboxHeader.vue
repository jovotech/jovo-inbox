<template>
  <div class="relative bg-jovo-blue">
    <div class="max-w-8xl mx-auto px-2 sm:px-5">
      <div class="flex justify-between items-center p-3  md:justify-start md:space-x-10">
        <div class="flex flex-col  lg:w-0 lg:flex-1">
          <a href="#">
            <span class="sr-only">Jovo Inbox</span>
            <img class="h-2 w-auto sm:h-8" src="@/assets/jovo-inbox-logo.png" alt="" />
          </a>
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
