<template>
  <v-container
    fluid
    grid-list-md>

    <header>
      <h2 class="display-3 font-weight-black">Prêt(e) à remplir vos PPRE {{firstName}} ?</h2>
    </header>

    <main>

      <v-layout row wrap>
        <v-flex xs4>
          <v-card>
            <v-card-title>25</v-card-title>
            <v-card-text>Élèves dans ma classe</v-card-text>
            <v-card-actions>
              <v-btn flat color="orange">Voir ma classe</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs4>
          <v-card>
            <v-card-title>10</v-card-title>
            <v-card-text>Élèves avec un PPRE dans ma classe</v-card-text>
            <v-card-actions>
              <v-btn flat color="orange">Remplir mes PPRE</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs4>
          <v-card>
            <v-card-title>25</v-card-title>
            <v-card-text>Élèves avec un PPRE dans mon école</v-card-text>
            <v-card-actions>
              <v-btn flat color="orange">Voir mon école</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
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
  export default class DashboardPage extends Vue {

    get firstName() {
      return this.$store.state.user.user.firstName;
    }


  }


</script>
