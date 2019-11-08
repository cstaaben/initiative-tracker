<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <v-img
          :src="require('../assets/dnd_logo.png')"
          class="my-3"
          contain
          height="100"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Initiative Tracker for D&D 5e
        </h1>
      </v-flex>

      <v-flex xs-12 mb-5>
        <h2 class="headline font-weight-bold mb-3">What can I do?</h2>
        <v-layout justify-center>
          <v-list three-line elevation="2" dense>
            <v-list-item
              v-for="(ability, i) in abilities"
              :key="ability.title"
              :class="{ stripe: i % 2 != 0 }"
            >
              <v-list-item-avatar
                ><v-icon v-text="ability.icon"></v-icon
              ></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="ability.content"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="ability.subtitle"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mdiCheckboxMarkedOutline } from "@mdi/js";

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
        icon: mdiCheckboxMarkedOutline
      },
      {
        content: "Edit combatants",
        subtitle:
          "Need to update a monster after the party blew through your last encounter with a bunch of lucky" +
          " rolls? We can handle that.<br> Need to update a combat-relevant stat for your PCs? Easy, peasey," +
          " lemon-squeezy.",
        title: "editCombatants",
        icon: mdiCheckboxMarkedOutline
      },
      {
        content: "Load combatants from previously created groups",
        subtitle:
          "Load individual monsters or groups of monsters (think minions from 4e) into a list of combatants " +
          "to throw at your players.<br> You can also load your characters straight into a list without having " +
          "to re-enter any information",
        title: "loadCombatants",
        icon: mdiCheckboxMarkedOutline
      },
      {
        content: "Save groups of combatants",
        subtitle:
          "Need to prepare for a future encounter? Create a monster (or group of them) and add them to the " +
          "list of <br>combatants with your PC's for future use.",
        title: "saveCombatants",
        icon: mdiCheckboxMarkedOutline
      },
      {
        content: "Save an encounter",
        subtitle:
          "Want to prep an encounter with a group of baddies (maybe even with pre-rolled initiative, you sly " +
          "dog, you)? We can do that. <br>Need to stop the session in the middle of the battle without losing " +
          "initiative order or current stats? We can do that too.",
        title: "saveEncounter",
        icon: mdiCheckboxMarkedOutline
      },
      {
        content: "Load an encounter",
        subtitle:
          "Need to prepare for a future encounter? Create a monster (or group of them) and add them to the list" +
          "of combatants with your <br>PC's for future use. Need to save the current list of combatants, preserving " +
          "current stats and initiative order? We do that too.",
        title: "loadEncounter",
        icon: mdiCheckboxMarkedOutline
      },
      {
        content: "Track initiative order",
        subtitle:
          "Oh, right. We do that too. Along with some other stats that could be useful in a pinch.",
        title: "trackInitiative",
        icon: mdiCheckboxMarkedOutline
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
