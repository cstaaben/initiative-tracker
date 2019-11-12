<template>
  <v-container>
    <v-snackbar top v-model="noCombatantsSnackbar">
      <span>Can't start encounter without combatants</span>
      <v-btn dark text color="red" @click="noCombatantsSnackbar = false"
        >Close</v-btn
      >
    </v-snackbar>

    <v-card outlined elevation="1" class="mx-auto">
      <v-toolbar elevation="0">
        <v-btn class="primary" @click="initTestCombatants"
          >Add Test Combatants</v-btn
        >
        <v-btn
          class="error"
          @click="encounter.combatants = []"
          v-if="encounter.combatants.length > 0"
          >Remove Combatants</v-btn
        >
      </v-toolbar>
      <v-card-title>
        <v-list-item two-line>
          <v-list-item-avatar left
            ><v-icon v-text="icons.encounter"></v-icon
          ></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">{{
              encounter.title
            }}</v-list-item-title>
            <v-list-item-subtitle
              >Time Passed: {{ timePassed }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-simple-table
          v-if="encounter.combatants.length > 0"
          fixed-header
          height="475px"
        >
          <thead>
            <tr>
              <th
                v-for="header in dataHeaders"
                :key="header.text"
                :class="{
                  'text-center': header.text == 'HP'
                }"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(combatant, i) in encounter.combatants"
              :key="combatant.name"
              :class="{
                yellow: encounter.currentTurn == i && encounter.started,
                'accent-3': encounter.currentTurn == i && encounter.started
              }"
            >
              <td>{{ combatant.name }}</td>
              <td>{{ combatant.initiative }}</td>
              <td class="text-center">
                {{ combatant.currentHP }}
              </td>
              <td>{{ combatant.armorClass }}</td>
              <td>{{ combatant.passPerception }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-container v-else>
          <p class="v-subheader overline">No combatants present</p>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-flex class="justify-end d-inline-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-show="encounter.started"
                class="info"
                @click="previousTurn"
                v-on="on"
                ><v-icon v-text="icons.prevRound"></v-icon
              ></v-btn>
            </template>
            <span>Previous Turn</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="switchStarted"
                :class="{
                  success: !encounter.started,
                  error: encounter.started
                }"
                v-on="on"
                ><v-icon v-text="encounterBtnIcon"></v-icon
              ></v-btn>
            </template>
            <span v-if="!encounter.started">Start Encounter</span>
            <span v-else>Stop Encounter</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-show="encounter.started"
                class="info"
                @click="nextTurn"
                v-on="on"
                ><v-icon v-text="icons.nextRound"></v-icon
              ></v-btn>
            </template>
            <span>Next Turn</span>
          </v-tooltip>
        </v-flex>

        <v-flex class="justify-end d-inline-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" :disabled="encounter.combatants.length == 0"
                ><v-icon v-text="icons.save"></v-icon
              ></v-btn>
            </template>
            <span>Save Encounter</span>
          </v-tooltip>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mdiSwordCross } from "@mdi/js";
import { mdiChevronRight } from "@mdi/js";
import { mdiChevronLeft } from "@mdi/js";
import { mdiStop } from "@mdi/js";
import { mdiPlay } from "@mdi/js";
import { mdiContentSave } from "@mdi/js";

export default {
  name: "Tracker",
  data: () => ({
    icons: {
      encounter: mdiSwordCross,
      nextRound: mdiChevronRight,
      prevRound: mdiChevronLeft,
      stopEncounter: mdiStop,
      startEncoutner: mdiPlay,
      save: mdiContentSave
    },
    noCombatantsSnackbar: false,
    encounter: {
      title: "Encounter",
      started: false,
      round: 0,
      currentTurn: 0,
      combatants: []
    },
    dataHeaders: [
      {
        text: "Name",
        align: "left",
        sortable: false,
        value: "name"
      },
      {
        text: "Initiative",
        value: "initiative",
        sortable: false
      },
      {
        text: "HP",
        value: "currentHP",
        sortable: false
      },
      {
        text: "AC",
        value: "armorClass",
        sortable: false
      },
      {
        text: "Passive Perception",
        value: "passPerception",
        sortable: false
      }
    ],
    scrollOptions: {
      duration: 1000,
      offset: 0,
      easing: "linear",
      container: "encounterTable"
    }
  }),
  computed: {
    timePassed() {
      let seconds = 0;
      if (this.round <= 1) {
        seconds = 0;
      } else {
        seconds = this.round * 6;
      }

      let minutes = seconds / 60;
      let secRem = seconds % 60;

      if (isNaN(minutes)) {
        minutes = "0";
      } else {
        minutes = "" + minutes;
      }
      if (isNaN(secRem)) {
        secRem = "0";
      } else {
        secRem = "0";
      }

      if (minutes.length == 1) {
        minutes = "0" + minutes;
      }
      if (secRem.length == 1) {
        secRem = "0" + secRem;
      }

      return minutes + ":" + secRem;
    },
    encounterBtnIcon() {
      return this.encounter.started
        ? this.icons.stopEncounter
        : this.icons.startEncoutner;
    }
  },
  methods: {
    initTestCombatants() {
      if (this.encounter.combatants.length > 0) {
        return;
      }

      this.encounter.title = "Test Encounter";

      for (let i = 0; i < 8; i++) {
        let c = {
          name: "Combatant " + (i + 1),
          initiative: Math.floor(Math.random() * Math.floor(30)),
          currentHP: 50,
          armorClass: 18,
          passPerception: 15,
          dexterity: Math.floor(Math.random() * Math.floor(20)),
          id: "combatant" + (i + 1)
        };

        this.encounter.combatants.push(c);
      }

      this.encounter.combatants.sort(this.compareCombatants);
    },
    compareCombatants(a, b) {
      if (a.initiative < b.initiative) {
        return 1;
      } else if (a.initiative > b.initiative) {
        return -1;
      }

      // initiative score is equal, compare dexterity scores
      if (a.dexterity < b.dexterity) {
        return 1;
      } else if (a.dexterity > b.dexterity) {
        return -1;
      }

      return 0;
    },
    switchStarted() {
      if (!this.encounter.started && this.encounter.combatants.length == 0) {
        this.noCombatantsSnackbar = true;
        return;
      }

      this.encounter.started = !this.encounter.started;
    },
    previousTurn() {
      if (this.encounter.currentTurn == 0 && this.encounter.round == 0) {
        return;
      }

      if (this.encounter.currentTurn == 0) {
        this.encounter.currentTurn = this.encounter.combatants.length - 1;
        this.encounter.round--;
      }

      this.encounter.currentTurn--;
    },
    nextTurn() {
      if (this.encounter.currentTurn == this.encounter.combatants.length - 1) {
        this.encounter.currentTurn = 0;
        this.encounter.round++;
      }

      this.encounter.currentTurn++;
    }
  }
};
</script>

<style scoped></style>
