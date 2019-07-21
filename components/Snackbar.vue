<template>
  <v-snackbar :color="color" v-model="show">
    {{message}}
    <v-btn flat @click.native="show = false">Fermer</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({})
  export default class Snackbar extends Vue {
    show = false;
    message = "";
    color = "";

    created() {
      this.$store.watch(state => state.snackbar.message, () => {
        const msg = this.$store.state.snackbar.message;
        if (msg !== '') {
          this.show = true;
          this.message = this.$store.state.snackbar.message;
          this.color = this.$store.state.snackbar.color;
          this.$store.commit('snackbar/show', { message: "", color: "success" });
        }
      });
    }
  }

</script>
