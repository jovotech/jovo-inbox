<template>
  <div>Settings</div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { BaseMixin } from '@/mixins/BaseMixin';

@Component({
  name: 'settings-view',
  components: {},
})
export default class SettingsView extends mixins(BaseMixin) {}
</script>
