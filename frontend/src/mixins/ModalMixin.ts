import { Component, Vue } from 'vue-property-decorator';

@Component
export class ModalMixin extends Vue {
  closeModalListener(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.$emit('close');
    }
  }
  cancel() {
    this.$emit('close');
  }
}
