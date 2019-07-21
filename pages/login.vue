<template>
  <div class="page-container">
    <section class="page-container__section section-with-image">
      <div class="image-overlay"></div>
      <img class="image-cover" src="~/assets/images/teacher.jpg" alt="teacher">
    </section>
    <section class="page-container__section section-with-content">
      <v-form @submit="submit" v-model="valid" ref="form">
        <h1 class="section__title text-xs-center">Connectez-vous avec votre compte enseignant</h1>
        <div>
          <v-text-field
            v-model="userDetails.username"
            label="Identifiant"
            outline
            required
            :rules="rules.username"
          ></v-text-field>
          <v-text-field
            v-model="userDetails.password"
            label="Mot de passe"
            outline
            required
            type="password"
            :rules="rules.password"
          ></v-text-field>
          <v-btn @click="submit" :disabled="!valid" flat>Se connecter</v-btn>
        </div>
      </v-form>
    </section>
  </div>
</template>


<style lang="scss" scoped>
  .page-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    height: 100%;
    justify-content: center;
    position: relative;
    @media screen and (max-width: 768px) {
      display: block;
    }
  }

  .page-container__section {
    overflow: hidden;
    height: 100%;
  }

  .image-cover {
    overflow: hidden;
    object-fit: cover;
    max-height: 100%;
  }

  .section-with-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: rgb(51, 173, 255);
  }

  .section__title {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  .section-with-image {
    position: relative;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;

    background: rgb(51, 255, 112);
    background: linear-gradient(135deg, rgba(51, 255, 112, 0.5) 0%, rgba(51, 173, 255, 0.5) 100%);

  }
</style>


<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import gql                from "graphql-tag";

  @Component({})
  export default class LoginPage extends Vue {
    valid = false;
    userDetails = {
      username: "",
      password: ""
    };
    rules = {
      username: [
        v => !!v || "Vous devez saisir un nom d'utilisateur",
        v => v.length > 3 || "Un nom d'utilisateur dois comporter plus de 3 caractères"
      ],
      password: [
        v => !!v || "Vous devez saisir un mot de passe",
      ]
    };

    async submit() {
      try {
        // @ts-ignore
        if (this.$refs.form.validate()) {
          // @ts-ignore
          const res = await this.$apollo.mutate(
            {
              mutation: gql`
              mutation($username: String!, $password: String!) {
                login (teacher: {username: $username}, password: $password) {
                token
                }
              }
              `,
              variables: {
                username: this.userDetails.username,
                password: this.userDetails.password
              }
            },
          );
          const { token } = res.data.login;
          // @ts-ignore
          await this.$apolloHelpers.onLogin(token);
          this.$router.push({path: "/dashboard"})
        } else {
          return;
        }
      } catch (e) {
        if (e.message.includes("ConnectorError(RecordDoesNotExist)")) {
          this.$store.commit("snackbar/show", { message: "Utilisateur inconnu.", color: "error" });
        } else if (e.message.includes("Incorrect password")) {
          this.$store.commit("snackbar/show", { message: "Mot de passe incorrect.", color: "error" });
        } else {
          this.$store.commit("snackbar/show", { message: "Une erreur s'est produite.", color: "error" });

        }

      }
    }
  }

</script>
