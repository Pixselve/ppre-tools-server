<template>
  <v-dialog v-model="isOpened" persistent max-width="600px">
    <v-card>
      <v-form v-model="valid" @submit="submit" ref="form">
        <v-card-title>
          <span v-if="mode === 'new'" class="headline">Ajouter un enseignant</span>
          <span v-else class="headline">Editer un enseignant</span>
        </v-card-title>
        <v-card-text>

          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field outline label="Prénom*" required v-model="form.firstName"
                              :rules="[rules.required, rules.minThree]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field outline
                              label="Nom de famille*"
                              required
                              v-model="form.lastName"
                              :rules="[rules.required, rules.minThree]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="form.username" outline label="Nom d'utilisateur*" required
                              :rules="[rules.required, rules.minThree]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="form.email" outline label="Adresse email*" required
                              :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="form.password" outline label="Mot de passe*" required append-icon="cached"
                              @click:append="generatePassword"
                              :rules="[rules.required, rules.minThree]"
                              v-if="mode !== 'edit'"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="form.avatar" outline label="URL vers l'avatar*" required
                              :rules="[rules.required, rules.imageURL]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-if="mode !== 'edit'"
                  required
                  :items="roles"
                  label="Role de l'enseignant"
                  :rules="[rules.required]"
                  outline
                  v-model="form.role"
                ></v-select>
              </v-flex>

            </v-layout>
          </v-container>
          <small>*indique les champs requis</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="$emit('close')" color="blue darken-1" flat>Fermer</v-btn>
          <v-btn :disabled="!valid" color="blue darken-1" flat @click="submit">Enregistrer</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  @Component({})
  export default class TeacherAddEditModal extends Vue {

    @Prop({ type: Boolean }) dialog = false;
    @Prop({ type: String }) mode = "new";
    @Prop({ type: Object }) value = {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      avatar: "",
      role: "",
      email: ""
    };

    @Watch("dialog")
    onDialogChanged() {
      //@ts-ignore
      this.$refs.form.resetValidation();
    }

    get isOpened() {
      return this.dialog;
    }

    valid = false;
    roles = [
      {
        text: "Enseignant",
        value: "DEFAULT"
      },
      {
        text: "Administrateur",
        value: "MANAGER"
      },
      {
        text: "Directeur",
        value: "ADMIN"
      },
    ];

    submit() {
      // @ts-ignore
      if (this.$refs.form.validate()) {
        this.$emit("submit", { data: this.form, mode: this.mode });
      } else {
        this.valid = false;
      }

    }

    @Watch('value')
    onValueChanged(val: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      avatar: "",
      role: "",
      email: ""
    }, oldVal: object) {
      if (val !== oldVal) {
        this.form = val;
      }
    }

    form = {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      avatar: "",
      role: "",
      email: ""
    };
    rules = {
      required: v => !!v || "Ce champ est requis.",
      minThree: v => (v && v.length >= 3) || "Veuillez saisir un minimum de 3 caractères",
      imageURL: v => /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g.test(v) || "Veuillez saisir une url d'image valide",
      email: v => /.+@.+/.test(v) || 'Veuillez saisir une adresse email valide.'
    };

    generatePassword() {
      this.form.password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    }
  }

</script>
