<template>
  <v-app dark>
    <v-content>

      <nuxt/>
      <Snackbar></Snackbar>
    </v-content>
  </v-app>
</template>

<script lang="ts">

  import { Component, Vue } from 'vue-property-decorator';
  import Snackbar           from "~/components/Snackbar.vue";

  @Component({
    components: {
      Snackbar
    }
  })
  export default class DefaultLayout extends Vue {
  }

</script>
