<template>
  <div id="app" class="flex h-screen max-h-screen">
       <inbox></inbox>

  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import Inbox from "@/components/Inbox.vue";

@Component({
  components: {Inbox},
})
export default class App extends Vue {
}
</script>

<style lang="css">
@import './assets/css/theme.pcss';

body {
  margin: 0;
  padding: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
