<template>
  <v-container>
    <v-card outlined>
      <v-layout text-center wrap>
        <v-flex class="xs12 lg12 align-center">
          <v-img
            :src="require('../assets/critical_role_outline.png')"
            class="my-3"
            contain
            height="100"
          ></v-img>
        </v-flex>

        <v-flex class="xs12 lg12 align-center">
          <h1 class="display-2 font-weight-bold mb-3 text-center">
            Initiative Tracker for D&D 5e
          </h1>
        </v-flex>

        <v-flex class="xs12 lg12 align-center">
          <h2 class="headline font-weight-bold mb-3">What can I do?</h2>
          <v-layout justify-center>
            <v-list three-line dense elevation="0">
              <v-list-item
                v-for="(ability, i) in abilities"
                :key="ability.title"
                :class="{ stripe: i % 2 == 0 }"
              >
                <v-list-item-avatar
                  ><v-icon
                    v-text="ability.icon"
                    color="light-blue darken-1"
                  ></v-icon
                ></v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="ability.content"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="ability.subtitle"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { mdiCheckboxMarked } from "@mdi/js";

export default {
  name: "TrackerHome",
  data: () => ({
    abilities: [
      {
        content: "Create combatants",
        subtitle:
          "Track all relevant information for all of your monsters, NPCs and PCs and save them for easy " +
          "re-use later.",
        title: "createCombatants",
        icon: mdiCheckboxMarked
      },
      {
        content: "Edit combatants",
        subtitle:
          "Need to update a monster after the party blew through your last encounter with a bunch of lucky" +
          " rolls? We can handle that.<br> Need to update a combat-relevant stat for your PCs? Easy, peasey," +
          " lemon-squeezy.",
        title: "editCombatants",
        icon: mdiCheckboxMarked
      },
      {
        content: "Load combatants from previously created groups",
        subtitle:
          "Load individual monsters or groups of monsters (think minions from 4e) into a list of combatants " +
          "to throw at your players.<br> You can also load your characters straight into a list without having " +
          "to re-enter any information",
        title: "loadCombatants",
        icon: mdiCheckboxMarked
      },
      {
        content: "Save groups of combatants",
        subtitle:
          "Need to prepare for a future encounter? Create a monster (or group of them) and add them to the " +
          "list of <br>combatants with your PC's for future use.",
        title: "saveCombatants",
        icon: mdiCheckboxMarked
      },
      {
        content: "Save an encounter",
        subtitle:
          "Want to prep an encounter with a group of baddies (maybe even with pre-rolled initiative, you sly " +
          "dog, you)? We can do that. <br>Need to stop the session in the middle of the battle without losing " +
          "initiative order or current stats? We can do that too.",
        title: "saveEncounter",
        icon: mdiCheckboxMarked
      },
      {
        content: "Load an encounter",
        subtitle:
          "Need to prepare for a future encounter? Create a monster (or group of them) and add them to the list" +
          "of combatants with your <br>PC's for future use. Need to save the current list of combatants, preserving " +
          "current stats and initiative order? We do that too.",
        title: "loadEncounter",
        icon: mdiCheckboxMarked
      },
      {
        content: "Track initiative order",
        subtitle:
          "Oh, right. We do that too. Along with some other stats that could be useful in a pinch.",
        title: "trackInitiative",
        icon: mdiCheckboxMarked
      }
    ]
  })
};
</script>

<style scoped>
.stripe {
  background-color: #e8eaf6;
}
</style>
