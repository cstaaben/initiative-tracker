<template>
  <v-container>
    <v-card outlined elevation="1">
      <v-card-title>
        <v-list-item>
          <v-list-item-avatar left
            ><v-icon v-text="icons.combatants"></v-icon
          ></v-list-item-avatar>
          <v-list-item-content
            ><v-list-item-title class="headline mb-1">{{
              title
            }}</v-list-item-title></v-list-item-content
          >
        </v-list-item>
      </v-card-title>

      <v-card-text>
        <v-flex class="d-sm-inline-flex">
          <v-text-field
            type="text"
            label="Encounter Name"
            v-model="encounterTitle"
            :disabled="!editTitle"
            shaped
            outlined
            filled
          ></v-text-field>
          <v-text-field
            type="number"
            label="Starting Round"
            v-model="encounterRound"
            :disabled="!editTitle"
            shaped
            outlined
            filled
          ></v-text-field>
        </v-flex>

        <v-flex class="d-sm-inline-flex">
          <tracker-tooltip-btn
            :showing="!editTitle"
            @click="toggleEditTitle"
            :icon="icons.edit"
            :btn-class="'info'"
            >Edit Details</tracker-tooltip-btn
          >

          <tracker-tooltip-btn
            :showing="editTitle"
            @click="toggleEditTitle"
            :btn-class="'success'"
            :icon="icons.check"
            >Set Details</tracker-tooltip-btn
          >
        </v-flex>

        <v-simple-table
          v-if="combatants.length > 0"
          height="475px"
          fixed-header
        >
          <thead>
            <tr>
              <th v-for="header in dataHeaders" :key="header">
                {{ header }}
              </th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(combatant, i) in combatants"
              :key="combatant.id"
              :class="{ stripe: i % 2 === 0 }"
            >
              <td>{{ combatant.name }}</td>
              <td>{{ combatant.initiative }}</td>
              <td>{{ combatant.currentHP }}</td>
              <td>{{ combatant.armorClass }}</td>
              <td>{{ combatant.passPerception }}</td>
              <td>
                <tracker-tooltip-btn
                  :btn-class="'info'"
                  @click="editCombatant(combatant.id)"
                  :icon="icons.edit"
                  :showing="true"
                  >Edit Combatant</tracker-tooltip-btn
                >

                <v-dialog
                  v-model="dialogs.removeConfirmation.showing"
                  max-width="650"
                  persistent
                >
                  <template #activator="{ on }">
                    <v-tooltip top v-on="on">
                      <template #activator="{ on }">
                        <v-btn
                          @click="toggleAndSetRemoveTarget(combatant.id)"
                          class="error"
                          v-on="on"
                          ><v-icon v-text="icons.delete"></v-icon
                        ></v-btn>
                      </template>
                      <span>Remove Combatant</span>
                    </v-tooltip>
                  </template>

                  <v-card dark>
                    <v-card-title class="headline font-weight-light">
                      Remove {{ removeTargetName }} from {{ encounterTitle }}?
                    </v-card-title>

                    <v-card-text>
                      <v-btn dark text color="success" @click="removeTarget"
                        >Yes</v-btn
                      >
                      <v-btn dark text color="error" @click="toggleRemoveDialog"
                        >No</v-btn
                      >
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

        <v-container v-else>
          <p class="v-subheader overline">No combatants present</p>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-center">
        <tracker-tooltip-btn
          :showing="true"
          @click="navigateToAddCombatant"
          :btn-class="'success'"
          :icon="icons.plus"
          >Add Combatant</tracker-tooltip-btn
        >

        <tracker-tooltip-btn
          :showing="combatants.length > 0 || encounterTitle.length > 0"
          @click="saveEncounter"
          :btn-class="'primary'"
          :icon="icons.save"
          >Save Encounter</tracker-tooltip-btn
        >

        <tracker-tooltip-btn
          @click="loadEncounter"
          :btn-class="'primary'"
          :icon="icons.load"
          >Load Encounter</tracker-tooltip-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import {
  mdiAccountGroup,
  mdiContentSave,
  mdiUpload,
  mdiCheck,
  mdiPencil,
  mdiPlus,
  mdiDelete
} from "@mdi/js";
import { mapGetters, mapActions } from "vuex";
import TrackerTooltipBtn from "../tracker/TrackerTooltipBtn.vue";

export default {
  name: "CombatantList",
  components: {
    "tracker-tooltip-btn": TrackerTooltipBtn
  },
  data: () => ({
    title: "Encounter",
    icons: {
      combatants: mdiAccountGroup,
      save: mdiContentSave,
      load: mdiUpload,
      check: mdiCheck,
      edit: mdiPencil,
      plus: mdiPlus,
      delete: mdiDelete
    },
    dataHeaders: ["Name", "Initiative", "HP", "AC", "Passive Perception"],
    editTitle: false,
    dialogs: {
      removeConfirmation: {
        targetId: -1,
        showing: false
      }
    }
  }),
  computed: {
    removeTargetName() {
      if (this.dialogs.removeConfirmation.targetId === "") {
        return "";
      }
      return this.combatants.find(
        c => c.id === this.dialogs.removeConfirmation.targetId
      ).name;
    },
    encounterRound: {
      get() {
        return this.getRoundNum;
      },
      set(round) {
        this.setRound(round);
      }
    },
    ...mapGetters({
      encounterTitle: "getTitle",
      combatants: "getCombatants",
      roundNum: "getRoundNum"
    })
  },
  methods: {
    ...mapActions([
      "toggleStarted",
      "incrementRound",
      "decrementRound",
      "incrementTurn",
      "decrementTurn",
      "addCombatant",
      "removeCombatant",
      "setRound"
    ]),
    toggleRemoveDialog() {
      this.dialogs.removeConfirmation.showing = !this.dialogs.removeConfirmation
        .showing;
    },
    setRemoveTarget(id) {
      this.dialogs.removeConfirmation.targetId = id;
    },
    toggleAndSetRemoveTarget(id) {
      this.toggleRemoveDialog();
      this.setRemoveTarget(id);
    },
    removeTarget() {
      if (this.dialogs.removeConfirmation.targetId === "") {
        return;
      }

      this.removeCombatant(this.dialogs.removeConfirmation.targetId);
      this.toggleRemoveDialog();
    },
    toggleEditTitle() {
      this.editTitle = !this.editTitle;
    },
    editCombatant(id) {
      this.$router.push({
        name: "edit-combatant",
        params: {
          id
        }
      });
    },
    navigateToAddCombatant() {
      this.$router.push({ name: "add-combatant" });
    },
    saveEncounter() {
      console.log("Save Encounter");
    },
    loadEncounter() {
      console.log("Load Encounter");
    }
  }
};
</script>

<style scoped>
.stripe {
  background-color: #e8eaf6;
}
</style>
