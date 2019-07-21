<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-form v-model="valid" ref="form">
        <v-card-title>
          <span class="headline">Ouvrir une classe</span>
        </v-card-title>
        <v-card-text>

          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="Nom"
                  outline
                  required
                  v-model="form.name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  :items="academicLevels"
                  label="Niveau"
                  outline
                  required
                  v-model="form.academicLevel"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  required
                  :item-text="getFullName"
                  item-value="id"
                  :items="teachers"
                  label="Enseignant(s)"
                  multiple
                  chips
                  outline
                  v-model="form.teachers"
                >
                  <template v-slot:selection="data">
                    <v-chip
                      :key="data.item.id"
                      class="v-chip--select-multi"
                      @input="data.parent.selectItem(data.item)"
                    >
                      <v-avatar
                        class="accent white--text"

                      ><img :src="data.item.avatar"></v-avatar>
                      {{ data.item.firstName }} {{ data.item.lastName }}
                    </v-chip>
                  </template>
                </v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indique les champs requis</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="$emit('close')" color="blue darken-1" flat>Fermer</v-btn>
          <v-btn @click="addClassroom" :disabled="!valid && loading" color="blue darken-1" flat>Enregistrer</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import gql                      from "~/node_modules/graphql-tag";

  @Component({})
  export default class ClassroomAddEditModal extends Vue {
    @Prop({ type: Boolean }) dialog = false;
    valid = false;
    academicLevels = ["CP", "CE1", "CE2", "CM1", "CM2"];
    loading = false;
    form = {
      name: "",
      academicLevel: "",
      teachers: []
    };


    get teachers() {
      return this.$store.state.teachers.teachers;
    }

    getFullName(teacher) {
      return `${teacher.firstName} ${teacher.lastName}`;
    }

    get teacherConnectString() {
      return this.form.teachers.map(el => ({ id: el }));
    }

    async addClassroom() {
      this.loading = true;
      try {
        const { data } = await this.$apollo.mutate(
          {
            mutation: gql`
              mutation(
                $name: String!
                $academicLevel: String!
                $teachersId: [TeacherWhereUniqueInput!]
                $schoolId: ID!
              ) {
                createOneClassroom(
                  data: {
                    year: "2019"
                    name: $name
                    academicLevel: $academicLevel
                    school: { connect: { id: $schoolId } }
                    teachers: { connect: $teachersId }
                  }
                ) {
                  name
                }
              }

              `,
            variables: {
              name: this.form.name,
              academicLevel: this.form.academicLevel,
              teachersId: this.teacherConnectString,
              schoolId: this.$store.getters['user/GET_SCHOOL_ID']
            }
          },
        );
        this.$store.commit("snackbar/show", {
          message: "Classe ajoutée 🙌",
          color: "success"
        });
        this.$emit("submit");
        this.$emit("close");
      } catch (e) {
        this.$store.commit("snackbar/show", {
          message: "Une erreur est survenue durant la création de la classe",
          color: "error"
        });
      }
      this.loading = false;
    }


    async editClassroom() {
      this.loading = true;
      try {


        const { data } = await this.$apollo.mutate(
          {
            mutation: gql`
              mutation(
                $name: String!
                $academicLevel: String!
                $teachersId: [TeacherWhereUniqueInput!]
                $schoolId: ID!
              ) {
                updateOneClassroom(
                  data: {
                    year: "2019"
                    name: $name
                    academicLevel: $academicLevel
                    school: { connect: { id: $schoolId } }
                    teachers: { connect: $teachersId }
                  }
                ) {
                  name
                }
              }

              `,
            variables: {
              name: this.form.name,
              academicLevel: this.form.academicLevel,
              teachersId: this.teacherConnectString,
              schoolId: this.$store.getters['user/GET_SCHOOL_ID']
            }
          },
        );


        this.$store.commit("snackbar/show", {
          message: "Classe modifiée avec succès 🙌",
          color: "success"
        });
        this.$emit("submit");
        this.$emit("close");
      } catch (e) {
        this.$store.commit("snackbar/show", {
          message: "Une erreur est survenue durant la modification de la classe",
          color: "error"
        });
      }
      this.loading = false;
    }


  }

</script>
