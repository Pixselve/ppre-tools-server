<template>
  <v-hover>
    <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
      <v-img :alt="`Avatar de ${teacher.firstName}`" :src="teacher.avatar" height="200px"></v-img>
      <v-card-title primary-title>
        <div>
          <div class="headline">{{teacher.firstName}} {{teacher.lastName}}</div>
          <span class="grey--text">Directeur(ice)</span>
          <div v-if="!teacher.classrooms.length" class="info--text caption">
            <v-icon class="subheading" color="info">info</v-icon>
            N'a pas été encore attribué à une classe
          </div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-layout align-center v-if="teacher.classrooms.length">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-layout align-center class="ml-0" v-on="on">
                             <v-icon>supervised_user_circle</v-icon>
              {{teacher.classrooms.map(el => el.name).join(", ")}}
              </v-layout>

            </template>
            <span>Classe(s)</span>
          </v-tooltip>


        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn :disabled="ownAccount" @click="$emit('edit', {teacher})" icon v-on="on">
              <v-icon>edit</v-icon>
            </v-btn>
          </template>
          <span>Éditer l'enseignant</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn :loading="loading.deletion" :disabled="ownAccount" @click="deleteTeacher" icon
                   v-on="on">
              <v-icon color="red">delete_forever</v-icon>
            </v-btn>
          </template>
          <span>Supprimer l'enseignant</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
  import gql                      from "~/node_modules/graphql-tag";
  import { Component, Prop, Vue } from 'vue-property-decorator';

  interface Teacher {
    firstName: string
    lastName: string
    id: string
    avatar: string
  }

  @Component({})
  export default class TeacherCard extends Vue {
    @Prop({ type: Object, required: true }) teacher!: Teacher;
    loading = {
      deletion: false
    };

    get ownAccount() {
      return this.$store.state.user.user.id === this.teacher.id;
    }

    async deleteTeacher() {
      this.loading.deletion = true;
      try {
        if (this.$store.state.user.user.id === this.teacher.id) {
          this.$store.commit("snackbar/show", {
            message: "Vous ne pouvez pas supprimer votre propre compte",
            color: "error"
          });
        } else {
          // @ts-ignore
          const res = await this.$apollo.mutate(
            {
              mutation: gql`
            mutation($id: ID!) {
                deleteOneTeacher(where: {id: $id}) {
                  id
                }
              }
              `,
              variables: {
                id: this.teacher.id
              }
            },
          );
          this.$emit("refresh");
          this.$store.commit("snackbar/show", { message: "Enseignant supprimé avec succès.", color: "success" });

        }
      } catch (e) {
        console.log(e);
      }
      this.loading.deletion = false;
    }
  }

</script>
