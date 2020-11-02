<template>
  <v-container>
    <v-card elevation="1" outlined>
      <v-card-title>
        <v-list-item>
          <v-list-item-avatar left>
            <v-icon>
              <slot name="icon">{{ defaults.icon }}</slot>
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content
            ><v-list-item-title class="headline mb-1">
              <slot name="title">{{ defaults.title }}</slot>
            </v-list-item-title></v-list-item-content
          >
        </v-list-item>
      </v-card-title>

      <v-card-text>
        <v-form ref="combatantForm" v-model="validForm">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="combatant.name"
                  label="Name"
                  :rules="rules.name"
                  type="text"
                  required
                ></v-text-field>
              </v-col>

              <v-col>
                <v-text-field
                  v-model="combatant.armorClass"
                  label="Armor Class"
                  type="number"
                  :rules="rules.armorClass"
                  required
                ></v-text-field
              ></v-col>

              <v-col>
                <v-text-field
                  v-model="combatant.initiative"
                  label="Initiative Score"
                  type="number"
                  :rules="rules.initiative"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="combatant.currentHP"
                  label="Current HP"
                  type="number"
                  :rules="rules.currentHP"
                ></v-text-field>
              </v-col>

              <v-col>
                <v-text-field
                  v-model="combatant.passPerception"
                  label="Passive Perception"
                  type="number"
                  :rules="rules.passPerception"
                ></v-text-field>
              </v-col>

              <v-col>
                <v-text-field
                  v-model="combatant.dexterity"
                  label="Dexterity Score"
                  type="number"
                  :rules="rules.dexterity"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-divider></v-divider>
            </v-row>

            <v-row>
              <v-col>
                <v-btn
                  :disabled="!validForm"
                  color="success"
                  class="mr-4"
                  type="submit"
                  @click.stop="submitForm"
                  >{{ submitBtnText }}</v-btn
                >

                <v-btn color="error" class="mr-4" @click.stop="resetForm"
                  >Reset Form</v-btn
                >

                <v-btn color="info" class="mr-4" @click="cancelForm"
                  >Cancel</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions></v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mdiAccount } from "@mdi/js";

export default {
  name: "CombatantForm",
  props: {
    id: { type: String, default: "none" }
  },
  created() {
    if (this.$route.params.id != null) {
      this.combatant = this.$store.getters.getCombatants.find(
        c => c.id === this.$route.params.id
      );
      this.submitFn = "updateCombatant";
    }
  },
  data: () => ({
    defaults: {
      icon: mdiAccount,
      title: "Combatant Form"
    },
    combatant: {
      name: "",
      initiative: null,
      armorClass: null,
      currentHP: null,
      passPerception: null,
      dexterity: null,
      id: null
    },
    validForm: false,
    submitBtnText: "Save Combatant",
    submitFn: "addCombatant",
    rules: {
      name: [
        v => !!v || "Name is required",
        v =>
          (v && v.indexOf('"') === -1) ||
          "Use single quotes instead of double quotes"
      ],
      initiative: [
        v => !!v || "Initiative score is required",
        v =>
          (v && v >= 0) || "Initiative score must be greater than or equal to 0"
      ],
      armorClass: [
        v => (v && v >= 0) || "Armor class must be greater than or equal to 0"
      ],
      currentHP: [v => (v && v >= 0) || "Current HP must be at least 0"],
      passPerception: [
        v => (v && v >= 5) || "Passive perception must be at least 5"
      ],
      dexterity: [v => (v && v > 0) || "Dexterity score must be above 0"]
    }
  }),
  computed: {
    combatantId() {
      return this.combatant.name
        .toLowerCase()
        .split(" ")
        .join("");
    }
  },
  methods: {
    submitForm() {
      this.combatant.id = this.combatantId; // update id used for matching combatants
      this.$store.dispatch(this.submitFn, this.combatant); // submit the combatant to add/update
      this.$router.push({ name: "encounter" }); // go back to the encounter page
    },
    resetForm() {
      this.$refs.combatantForm.reset();
      this.$refs.combatantForm.resetValidation();
    },
    cancelForm() {
      this.$router.push({ name: "encounter" });
    }
  }
};
</script>

<style scoped></style>
