<template>
  <v-container fluid grid-list-md>
    <header class="mb-5">
      <v-layout align-center wrap>
        <h2 class="display-3 font-weight-black">Les classes</h2>
        <v-btn @click="dialog = true" outline large round>
          <v-icon>add</v-icon>
          Ouvrir une classe
        </v-btn>
      </v-layout>
    </header>
    <main>


      <v-expansion-panel v-if="classrooms.length > 0">
        <v-expansion-panel-content
          v-for="(classroomsPerAcademicLevel,academicLevel) in groupBy('academicLevel', classrooms)"
          :key="academicLevel"
        >
          <template v-slot:header>
            <div>{{academicLevel}}</div>
          </template>
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex
                  v-for="classroom in classroomsPerAcademicLevel"
                  :key="classroom.id"
                >
                  <ClassroomCard @delete="refreshData" :classroom="classroom"></ClassroomCard>
                </v-flex>
              </v-layout>
            </v-card-text>
            <!--            <v-card-text v-if="classroomsPerAcademicLevel(academicLevel).length > 0">-->

            <!--            </v-card-text>-->
            <!--            <v-card-text v-else>-->
            <!--              <v-alert-->
            <!--                :value="true"-->
            <!--                type="info"-->
            <!--              >-->
            <!--                Il n'y a pas encore de classe pour ce niveau.-->
            <!--              </v-alert>-->
            <!--            </v-card-text>-->
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>


      <v-layout v-else>
        <v-alert :value="true"
                 type="info"
        >Vous n'avez pas encore classe dans votre établissement. Ajoutez-en dès maintenant.
        </v-alert>
      </v-layout>

    </main>
    <ClassroomAddEditModal @submit="refreshData" @close="dialog = false" :dialog="dialog"></ClassroomAddEditModal>

  </v-container>
</template>

<script lang="ts">
  import { Component, Vue }    from 'vue-property-decorator';
  import ClassroomCard         from "~/components/dashboard/school/classrooms/ClassroomCard.vue";
  import ClassroomAddEditModal from "~/components/dashboard/school/classrooms/ClassroomAddEditModal.vue";

  @Component({
    middleware: "auth",
    layout: "dashboard",
    components: {
      ClassroomCard,
      ClassroomAddEditModal
    },
    async fetch({ store }) {
      await store.dispatch("classrooms/UPDATE");
      await store.dispatch("teachers/UPDATE");
    }
  })
  export default class SchoolPage extends Vue {
    academicLevels = ["CP", "CE1", "CE2", "CM1", "CM2"];
    dialog = false;


    get classrooms() {
      return this.$store.state.classrooms.classrooms;
    }

    async refreshData() {
      await this.$store.dispatch("classrooms/UPDATE");
    }

    groupBy(key, array) {
      return array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});
    }
  }

</script>
