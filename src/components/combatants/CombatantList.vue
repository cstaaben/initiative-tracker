<template>
  <v-container>
    <v-card outlined elevation="1">
      <v-card-title>
        <v-list-item>
          <v-list-item-avatar left
            ><v-icon v-text="icons.combatants"></v-icon
          ></v-list-item-avatar>
          <v-list-item-content
            ><v-list-item-title class="headline mb-1"
              >{{ title }}</v-list-item-title
            ></v-list-item-content
          >
        </v-list-item>
      </v-card-title>

      <v-card-text>
        <v-flex class="d-sm-inline-flex">
          <v-text-field
            type="text"
            label="Encounter Name"
            v-model="encounter.title"
            :disabled="!editTitle"
            shaped
            outlined
            filled
          ></v-text-field>
          <v-text-field
            type="number"
            label="Starting Round"
            v-model="encounter.round"
            :disabled="!editTitle"
            shaped
            outlined
            filled
          ></v-text-field>
        </v-flex>

        <v-flex class="d-sm-inline-flex">
          <tracker-tooltip-btn
            :showing="!editTitle"
            :click-action="toggleEditTitle"
            :icon="icons.edit"
            :btn-class="'info'"
            >Edit Details</tracker-tooltip-btn
          >

          <tracker-tooltip-btn
            :showing="editTitle"
            :click-action="toggleEditTitle"
            :btn-class="'success'"
            :icon="icons.check"
            >Set Details</tracker-tooltip-btn
          >
        </v-flex>

        <v-simple-table
          v-if="encounter.combatants.length > 0"
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
              v-for="(combatant, i) in encounter.combatants"
              :key="combatant.id"
              :class="{ stripe: i % 2 == 0 }"
            >
              <td>{{ combatant.name }}</td>
              <td>{{ combatant.initiative }}</td>
              <td>{{ combatant.currentHP }}</td>
              <td>{{ combatant.armorClass }}</td>
              <td>{{ combatant.passPerception }}</td>
              <td>
                <tracker-tooltip-btn
                  :btn-class="'info'"
                  :click-action="function() { editCombatant(combatant.id); }"
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
                          @click="toggleAndSetRemoveTarget(i)"
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
                      <v-btn dark text color="success" @click="removeCombatant"
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
          :click-action="navigateToAddCombatant"
          :btn-class="'success'"
          :icon="icons.plus"
          >Add Combatant</tracker-tooltip-btn
        >

        <tracker-tooltip-btn
          :showing="
            encounter.combatants.length > 0 || encounter.title.length > 0
          "
          :click-action="function() {}"
          :btn-class="'primary'"
          :icon="icons.save"
          >Save Encounter</tracker-tooltip-btn
        >

        <tracker-tooltip-btn
          :showing="
            encounter.combatants.length == 0 && encounter.title.length == 0
          "
          :click-action="function() {}"
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
    encounter: {
      title: "",
      started: false,
      round: null,
      currentTurn: 0,
      combatants: []
    },
    editTitle: false,
    dialogs: {
      removeConfirmation: {
        targetIndex: -1,
        showing: false
      }
    }
  }),
  computed: {
    removeTargetName() {
      if (this.dialogs.removeConfirmation.targetIndex < 0) {
        return "";
      }

      return this.encounter.combatants[
        this.dialogs.removeConfirmation.targetIndex
      ].name;
    },
    encounterTitle() {
      return this.encounter.title.length > 0
        ? this.encounter.title
        : " the encounter";
    }
  },
  methods: {
    initTestCombatants() {
      if (this.encounter.combatants.length > 0) {
        return;
      }

      for (let i = 0; i < 8; i++) {
        let name = "Combatant " + (i + 1);
        let c = {
          name: name,
          initiative: Math.floor(Math.random() * Math.floor(30)),
          currentHP: 50,
          armorClass: 18,
          passPerception: 15,
          dexterity: Math.floor(Math.random() * Math.floor(20)),
          id: name
            .toLowerCase()
            .split(" ")
            .join("")
        };

        this.encounter.combatants.push(c);
      }
    },
    toggleRemoveDialog() {
      this.dialogs.removeConfirmation.showing = !this.dialogs.removeConfirmation
        .showing;
    },
    setRemoveTarget(index) {
      this.dialogs.removeConfirmation.targetIndex = index;
    },
    toggleAndSetRemoveTarget(index) {
      this.toggleRemoveDialog();
      this.setRemoveTarget(index);
    },
    removeCombatant() {
      if (this.dialogs.removeConfirmation.targetIndex == -1) {
        return;
      }

      this.encounter.combatants.splice(
        this.dialogs.removeConfirmation.targetIndex,
        1
      );

      this.toggleRemoveDialog();
    },
    toggleEditTitle() {
      this.editTitle = !this.editTitle;
    },
    editCombatant(id) {
      console.log("TODO: navigate to edit combatant " + id);
    },
    navigateToAddCombatant() {
      this.$router.push({ name: "add-combatant" });
    }
  }
};
</script>

<style scoped>
.stripe {
  background-color: #e8eaf6;
}
</style>
