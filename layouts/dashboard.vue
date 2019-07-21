<template>
  <v-app>
    <v-content>
      <v-toolbar>
        <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Outils pour les PPRE</v-toolbar-title>
      </v-toolbar>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      >
        <v-list class="pa-1">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list class="pt-0" dense>


          <v-list-tile exact :key="i" v-for="(link, i) in links" :to="link.to">
            <v-list-tile-action>
              <v-icon>{{link.icon}}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{link.title}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-group :key="'parentKey' + parentIndex" v-for="(parentLink, parentIndex) in linksWithCildren"
            :prepend-icon="parentLink.icon"
            value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>{{parentLink.title}}</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-tile exact :key="'childrenKey' + i" v-for="(link, i) in parentLink.children" :to="link.to">
              <v-list-tile-action>
                <v-icon>{{link.icon}}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{link.title}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>


        </v-list>
      </v-navigation-drawer>
      <v-container
        fluid
        grid-list-md>
        <nuxt/>
      </v-container>

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
  export default class DashboardLayout extends Vue {
    drawer = false;
    linksWithCildren = [
      {
        title: "Mon école",
        icon: "school",
        to: "/dashboard/school",
        children: [
          {
            title: "L'équipe pédagoqique",
            icon: "face",
            to: "/dashboard/school/team",
          },
          {
            title: "Les classes",
            icon: "supervised_user_circle",
            to: "/dashboard/school/classrooms",
          },
        ]
      },
    ];
    links = [
      {
        title: "Accueil",
        icon: "home",
        to: "/dashboard"
      },

      {
        title: "Ma classe",
        icon: "group",
        to: "/dashboard/classroom"
      }
    ];
  }

</script>
