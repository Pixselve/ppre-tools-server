<template>

  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">{{classroom.name}}</div>
        <div class="" v-if="classroom.teachers.length">

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-layout class="grey--text ml-0" v-on="on" align-center>

                <v-icon small>face</v-icon>
                {{classroom.teachers.map(el => `${el.firstName} ${el.lastName}`).join(", ")}}
              </v-layout>
            </template>
            <span>Enseignant(s)</span>
          </v-tooltip>
        </div>
        <div v-else class="error--text caption">
          <v-icon class="subheading" color="error">error</v-icon>
          Aucun enseignant n'est encore attribué à cette classe
        </div>
        <div v-if="!classroom.studentsClassYears.length" class="warning--text caption">
          <v-icon class="subheading" color="warning">warning</v-icon>
          Aucun élève n'est encore inscrit dans cette classe
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <div>
        <div v-if="classroom.studentsClassYears.length">25 élèves sont inscrits dans cette classe</div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
        <span>Éditer la classe</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn :loading="loading.deletion" @click="deleteClassroom" icon v-on="on">
            <v-icon color="red">delete_forever</v-icon>
          </v-btn>
        </template>
        <span>Fermer la classe</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>

</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import gql                      from "~/node_modules/graphql-tag";

  @Component({})
  export default class ClassroomCard extends Vue {
    @Prop({ type: Object, required: true }) classroom!: {
      academicLevel: string
      name: string
      id: string
    };
    loading = {
      deletion: false
    };

    async deleteClassroom() {
      this.loading.deletion = true;
      try {
        const { data } = await this.$apollo.mutate({
          mutation: gql`
            mutation($id: ID!) {
              deleteOneClassroom(where: {id: $id}) {
                id
              }
            }
          `,
          variables: {
            id: this.classroom.id
          }
        });
        this.$store.commit("snackbar/show", { message: "Classe fermée avec succès.", color: "success" });
        this.$emit("delete");
      } catch (e) {

        this.$store.commit("snackbar/show", {
          message: "Une erreur est survenue durant la fermeture de la classe",
          color: "error"
        });

      }
      this.loading.deletion = false;
    }
  }

</script>
