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
              >Round: {{ encounter.round }} <br />
              Time Passed: {{ timePassed }}</v-list-item-subtitle
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
              <th v-for="header in dataHeaders" :key="header">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(combatant, i) in encounter.combatants"
              :key="combatant.id"
              :class="{
                yellow: encounter.currentTurn == i && encounter.started,
                'accent-3': encounter.currentTurn == i && encounter.started
              }"
            >
              <td>{{ combatant.name }}</td>
              <td>{{ combatant.initiative }}</td>
              <td class="justify-start">
                <v-flex class="d-sm-inline-flex xs1 justify-start">
                  {{ combatant.currentHP }}
                </v-flex>
                <v-flex class="d-sm-inline-flex offset-xs1 justify-end">
                  <v-dialog
                    v-model="dialogs.hp.show"
                    persistent
                    max-width="500"
                  >
                    <template #activator="{ on }">
                      <v-btn @click="setDialogTarget(combatant)" v-on="on" small
                        ><v-icon small v-text="icons.pencil"></v-icon
                      ></v-btn>
                    </template>

                    <v-card dark>
                      <v-card-title class="headline font-weight-light">
                        <v-flex class="d-sm-inline-flex justify-start"
                          >Modify Current HP for
                          {{ getDialogTargetName }}</v-flex
                        >
                        <v-flex class="d-sm-inline-flex justify-end">
                          <v-btn
                            text
                            fab
                            dark
                            small
                            @click="dialogs.hp.show = false"
                            ><v-icon small v-text="icons.close"></v-icon
                          ></v-btn> </v-flex
                      ></v-card-title>

                      <v-card-text>
                        <v-text-field v-model="dialogs.hp.modifier">
                          <v-btn
                            dark
                            fab
                            text
                            color="success"
                            slot="prepend"
                            @click="modifyHP(dialogs.hp.modifier)"
                            ><v-icon v-text="icons.plus"></v-icon>
                          </v-btn>

                          <v-btn
                            dark
                            fab
                            text
                            color="error"
                            slot="append"
                            @click="modifyHP(dialogs.hp.modifier * -1)"
                            ><v-icon v-text="icons.minus"></v-icon>
                          </v-btn>
                        </v-text-field>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-flex>
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
        <v-flex class="justify-center d-inline-flex">
          <tracker-tooltip-btn
            :showing="encounter.started"
            :btn-class="'info'"
            :click-action="previousTurn"
            :icon="icons.prevRound"
            >Previous Turn</tracker-tooltip-btn
          >

          <tracker-tooltip-btn
            :click-action="startEncounter"
            :btn-class="'success'"
            :showing="!encounter.started"
            :icon="icons.play"
            >Start Encounter</tracker-tooltip-btn
          >

          <v-dialog persistent v-model="dialogs.endCombat.show" max-width="350">
            <template #activator="{ on }">
              <tracker-tooltip-btn
                :click-action="stopEncounter"
                :icon="icons.stop"
                :showing="encounter.started"
                :btn-class="'error'"
                >Stop Encounter</tracker-tooltip-btn
              >
            </template>

            <v-card dark>
              <v-card-title class="subtitle-1">
                Preserve Round And Turn?
              </v-card-title>

              <v-card-subtitle class="overline justify-center"
                >Choosing 'No' will reset round count to 1 and lose current
                turn</v-card-subtitle
              >

              <v-card-text>
                <v-flex class="d-inline-flex">
                  <v-btn
                    color="success"
                    text
                    dark
                    large
                    @click="dialogs.endCombat.show = false"
                    >Yes</v-btn
                  >
                </v-flex>
                <v-flex class="d-inline-flex">
                  <v-btn
                    color="error"
                    text
                    dark
                    large
                    @click="resetRoundAndTurn"
                    >No</v-btn
                  >
                </v-flex>
              </v-card-text>
            </v-card>
          </v-dialog>

          <tracker-tooltip-btn
            :btn-class="'info'"
            :click-action="nextTurn"
            :showing="encounter.started"
            :icon="icons.nextRound"
            >Next Turn</tracker-tooltip-btn
          >
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import TrackerTooltipBtn from "./TrackerTooltipBtn.vue";
import {
  mdiSwordCross,
  mdiChevronRight,
  mdiChevronLeft,
  mdiStop,
  mdiPlay,
  mdiContentSave,
  mdiPencil,
  mdiClose,
  mdiPlus,
  mdiMinus
} from "@mdi/js";

export default {
  name: "Tracker",
  components: {
    "tracker-tooltip-btn": TrackerTooltipBtn
  },
  data: () => ({
    icons: {
      encounter: mdiSwordCross,
      nextRound: mdiChevronRight,
      prevRound: mdiChevronLeft,
      stop: mdiStop,
      play: mdiPlay,
      save: mdiContentSave,
      pencil: mdiPencil,
      close: mdiClose,
      plus: mdiPlus,
      minus: mdiMinus
    },
    noCombatantsSnackbar: false,
    dialogs: {
      hp: {
        show: false,
        modifier: null,
        combatant: null
      },
      endCombat: {
        show: false,
        preserveRoundTurn: true
      }
    },
    encounter: {
      title: "Encounter",
      started: false,
      round: 0,
      currentTurn: 0,
      combatants: []
    },
    dataHeaders: ["Name", "Initiative", "HP", "AC", "Passive Perception"]
  }),
  computed: {
    timePassed() {
      let seconds =
        this.encounter.round <= 1 ? 0 : (this.encounter.round - 1) * 6;
      let minutes = Math.floor(seconds / 60);
      let secRem = Math.floor(seconds % 60);

      if (isNaN(minutes)) {
        minutes = "0";
      } else {
        minutes = "" + minutes;
      }
      if (isNaN(secRem)) {
        secRem = "0";
      } else {
        secRem = "" + secRem;
      }

      if (minutes.length == 1) {
        minutes = "0" + minutes;
      }
      if (secRem.length == 1) {
        secRem = "0" + secRem;
      }

      return minutes + ":" + secRem;
    },
    getDialogTargetName() {
      return this.dialogs.hp.combatant == null
        ? ""
        : this.dialogs.hp.combatant.name;
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
    startEncounter() {
      if (this.encounter.combatants.length == 0) {
        this.noCombatantsSnackbar = true;
        return;
      } else if (!this.encounter.started && this.encounter.round == 0) {
        this.encounter.round = 1;
      }

      this.encounter.started = true;
    },
    stopEncounter() {
      this.encounter.started = false;
      this.dialogs.endCombat.show = true;
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
        return;
      }

      this.encounter.currentTurn++;
    },
    setDialogTarget(combatant) {
      this.dialogs.hp.combatant = combatant;
    },
    modifyHP(modifier) {
      this.dialogs.hp.combatant.currentHP += parseInt(modifier);
      this.dialogs.hp.show = false;
      this.dialogs.hp.modifier = null;
    },
    resetRoundAndTurn() {
      this.encounter.round = 0;
      this.encounter.currentTurn = 0;
      this.dialogs.endCombat.show = false;
    },
    saveEncounter() {
      console.log("saving encounter");
    }
  }
};
</script>

<style scoped></style>
