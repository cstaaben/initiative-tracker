<template>
  <v-container>
    <v-card outlined elevation="1">
      <v-toolbar elevation="0"
        ><v-btn class="primary" @click="initTestCombatants"
          >Add Test Combatants</v-btn
        ></v-toolbar
      >
      <v-card-title
        ><v-icon left v-text="encounterIcon"></v-icon
        ><v-flex class="title font-weight-light">{{
          encounter.title
        }}</v-flex></v-card-title
      >
      <v-card-text>
        <v-data-iterator
          :headers="dataHeaders"
          :items="encounter.combatants"
          item-key="name"
          no-data-text="No combatants present"
          hide-default-footer
          disable-pagination
          single-select
        >
          <!--            <template v-slot:default="props">-->
          <!--                <v-row  v-for="combatant in props.combatants">-->
          <!--                    <v-col></v-col>-->
          <!--                </v-row>-->
          <!--            </template>-->
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mdiSwordCross } from "@mdi/js";

export default {
  name: "Tracker",
  data: () => ({
    encounterIcon: mdiSwordCross,
    encounter: {
      title: "Encounter",
      started: false,
      round: 0,
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
    expandedRows: []
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

      return minutes + ":" + (seconds % minutes);
    }
  },
  methods: {
    initTestCombatants() {
      for (let i = 0; i < 20; i++) {
        let c = {
          name: "Combatant " + (i + 1),
          initiative: Math.floor(Math.random() * Math.floor(30)),
          currentHP: 50,
          armorClass: 18,
          passPerception: 15,
          dexterity: Math.floor(Math.random() * Math.floor(20))
        };

        console.log("Adding combatant: ", c);

        this.encounter.combatants.push(c);
      }

      this.encounter.combatants.sort(this.compareCombatants);
    },
    compareCombatants(a, b) {
      if (a.initiative < b.initiative) {
        return -1;
      } else if (a.initiative > b.initiative) {
        return 1;
      }

      // initiative score is equal, compare dexterity scores
      if (a.dexterity < b.dexterity) {
        return -1;
      } else if (a.dexterity > b.dexterity) {
        return 1;
      }

      return 0;
    }
  }
};
</script>

<style scoped></style>
