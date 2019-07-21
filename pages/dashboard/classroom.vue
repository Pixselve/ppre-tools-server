<template>
  <v-container fluid grid-list-md>
    <header>
      <v-layout align-center wrap>
        <h2 class="display-3 font-weight-black">Ma classe</h2>
        <v-btn v-if="hasClassroom" outline large round>
          <v-icon>add</v-icon>
          Ajouter un élève
        </v-btn>
      </v-layout>

    </header>
    <main>
      <v-layout row wrap>
        <v-alert
          :value="true"
          type="warning"
        >
          Vous n'avez pas encore été attribué à une classe. Si vous pensez que c'est une erreur, contactez votre chef d'établissement.
        </v-alert>

      </v-layout>
    </main>


  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    middleware: "auth",
    layout: "dashboard"
  })
  export default class SchoolPage extends Vue {
    get hasClassroom() {
      return this.$store.state.user.user.classrooms.length > 0
    }
  }

</script>
