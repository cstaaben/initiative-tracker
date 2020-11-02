<template>
  <v-container>
    <v-snackbar top v-model="noCombatantsSnackbar">
      <span>Can't start encounter without combatants</span>
      <v-btn dark text color="red" @click="noCombatantsSnackbar = false"
        >Close</v-btn
      >
    </v-snackbar>

    <v-card outlined elevation="1" class="mx-auto">
      <v-card-title>
        <v-list-item two-line>
          <v-list-item-avatar left
            ><v-icon v-text="icons.encounter"></v-icon
          ></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">{{
              encounterTitle
            }}</v-list-item-title>
            <v-list-item-subtitle
              >Round: {{ roundNum }} <br />
              Time Passed: {{ timePassed }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-simple-table
          v-if="combatants.length > 0"
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
              v-for="(combatant, i) in combatants"
              :key="combatant.id"
              :class="{
                yellow: currentTurn === i && isStarted,
                'accent-3': currentTurn === i && isStarted
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
                      <v-btn
                        @click="setDialogTarget(combatant)"
                        v-on="on"
                        small
                        :disabled="!isStarted"
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
            :showing="isStarted"
            :btn-class="'info'"
            @click="previousTurn"
            :icon="icons.prevRound"
            >Previous Turn</tracker-tooltip-btn
          >

          <tracker-tooltip-btn
            @click="startEncounter"
            :btn-class="'success'"
            :showing="!isStarted"
            :icon="icons.play"
            >Start Encounter</tracker-tooltip-btn
          >

          <v-dialog persistent v-model="dialogs.endCombat.show" max-width="350">
            <template #activator="{ on }">
              <tracker-tooltip-btn
                @click="stopEncounter"
                :icon="icons.stop"
                :showing="isStarted"
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
            @click="nextTurn"
            :showing="isStarted"
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
import { mapActions, mapGetters } from "vuex";

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
    dataHeaders: ["Name", "Initiative", "HP", "AC", "Passive Perception"]
  }),
  computed: {
    ...mapGetters({
      combatants: "getCombatants",
      timePassed: "getTimePassed",
      roundNum: "getRoundNum",
      encounterTitle: "getTitle",
      currentTurn: "getCurrentTurn",
      isStarted: "isStarted"
    }),
    getDialogTargetName() {
      return this.dialogs.hp.combatant == null
        ? ""
        : this.dialogs.hp.combatant.name;
    }
  },
  methods: {
    ...mapActions({
      incrementRound: "incrementRound",
      decrementRound: "decrementRound",
      setRound: "setRound",
      nextTurn: "incrementTurn",
      previousTurn: "decrementTurn",
      setCurrentTurn: "setCurrentTurn",
      toggleStarted: "toggleStarted",
      setTitle: "setTitle",
      addCombatant: "addCombatant",
      updateCombatant: "updateCombatant",
      setCombatants: "setCombatants"
    }),
    startEncounter() {
      if (this.combatants.length === 0) {
        this.noCombatantsSnackbar = true;
        return;
      } else if (!this.isStarted && this.roundNum === 0) {
        this.incrementRound();
      }

      this.toggleStarted();
    },
    stopEncounter() {
      this.toggleStarted();
      this.dialogs.endCombat.show = true;
    },
    setDialogTarget(combatant) {
      this.dialogs.hp.combatant = combatant;
    },
    modifyHP(modifier) {
      if (isNaN(modifier) || modifier == null) {
        return;
      }
      this.dialogs.hp.combatant.currentHP += parseInt(modifier);
      this.dialogs.hp.show = false;
      this.dialogs.hp.modifier = null;

      this.updateCombatant(this.dialogs.hp.combatant);
    },
    resetRoundAndTurn() {
      this.setRound(0);
      this.setCurrentTurn(0);
      this.dialogs.endCombat.show = false;
    },
    saveEncounter() {
      console.log("saving encounter");
    }
  }
};
</script>

<style scoped></style>
