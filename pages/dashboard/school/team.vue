<template>
  <v-container fluid grid-list-md>
    <header class="mb-5">
      <v-layout align-center wrap>
        <h2 class="display-3 font-weight-black">L'équipe pédagogique</h2>
        <v-btn outline large round @click="addNewTeacher">
          <v-icon>add</v-icon>
          Ajouter un enseignant
        </v-btn>
      </v-layout>
    </header>
    <main>
      <v-layout row wrap>
        <v-flex
          v-for="teacher in teachers"
          :key="teacher.id"
        >
          <TeacherCard @edit="editTeacher" @refresh="refreshData" :teacher="teacher"></TeacherCard>
        </v-flex>

      </v-layout>

    </main>

    <TeacherAddEditModal :value="teacher" :mode="mode" @close="dialog = false" :dialog="dialog"
                         @submit="addOrEditTeacher"></TeacherAddEditModal>

  </v-container>
</template>

<script lang="ts">
  import { Component, Vue }  from 'vue-property-decorator';
  import gql                 from "~/node_modules/graphql-tag";
  import TeacherCard         from "~/components/dashboard/school/TeacherCard.vue";
  import TeacherAddEditModal from "~/components/dashboard/school/TeacherAddEditModal.vue";

  @Component({
    middleware: "auth",
    layout: "dashboard",
    components: {
      TeacherCard,
      TeacherAddEditModal
    },
    async fetch({ store }) {
      await store.dispatch("teachers/UPDATE");
    }
  })
  export default class SchoolPage extends Vue {
    dialog = false;
    mode = "new";
    teacher = {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      avatar: "",
      role: "",
      email: ""
    };

    get teachers() {
      return this.$store.state.teachers.teachers;
    }

    async refreshData() {
      await this.$store.dispatch("teachers/UPDATE");
    }

    addNewTeacher() {
      this.mode = "new";
      this.teacher = {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        avatar: "",
        role: "",
        email: ""
      };
      this.dialog = true;
    }

    editTeacher({ teacher }) {
      this.mode = "edit";
      this.teacher = { ...teacher };
      this.dialog = true;
    }

    async addOrEditTeacher({ data, mode }) {
      try {
        if (mode === "new") {
          // @ts-ignore
          const res = await this.$apollo.mutate(
            {
              mutation: gql`
                mutation($firstName: String!, $lastName: String!, $avatar: String!, $username: String!, $password: String!, $schoolId: ID!, $role: Role!, $email: String!) {
                  createOneTeacher(
                    firstName: $firstName
                    lastName: $lastName
                    avatar: $avatar
                    username: $username
                    password: $password
                    school: { id: $schoolId },
                    role: $role,
                    email: $email
                  ) {
                    token
                  }
                }

              `,
              variables: {
                ...data,
                schoolId: this.$store.state.user.user.school.id
              }
            },
          );

          await this.refreshData();
          this.$store.commit("snackbar/show", { message: "Enseignant ajouté avec succès.", color: "success" });
          this.dialog = false;
        } else {
          // @ts-ignore
          const res = await this.$apollo.mutate(
            {
              mutation: gql`
                mutation($where: TeacherWhereUniqueInput!, $data: UpdateOneTeacherInput!) {
                  updateOneTeacher(
                  where : $where
                  data: $data
                  ) {
                    id
                  }
                }

              `,
              variables: {
                where: {
                  id: data.id
                },
                data: {
                  firstName: data.firstName,
                  lastName: data.lastName,
                  username: data.username,
                  avatar: data.avatar,
                  email: data.email
                }
              }
            },
          );
          await this.refreshData();
          this.$store.commit("snackbar/show", { message: "Enseignant édité avec succès.", color: "success" });
          this.dialog = false;
        }
      } catch (e) {
        console.log(e);
      }

    }

  }

</script>
