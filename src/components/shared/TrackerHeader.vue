<template>
  <v-container>
    <v-app-bar app color="light-blue darken-4" dark>
      <v-app-bar-nav-icon @click.stop="menuShowing = !menuShowing" />
      <v-toolbar-title>{{ activePage }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon v-text="icons.options"></v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            link
            v-for="optPage in optionPages"
            :key="optPage.title"
            :to="optPage.dest"
          >
            <v-list-item-icon
              ><v-icon v-text="optPage.icon"></v-icon
            ></v-list-item-icon>
            <v-list-item-title>{{ optPage.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item key="Add Test Combatants" link @click="addTestCombatants"
            ><v-list-item-icon
              ><v-icon v-text="icons.addTest"></v-icon></v-list-item-icon
            ><v-list-item-title
              >Add Test Combatants</v-list-item-title
            ></v-list-item
          >
          <v-list-item
            key="Remove Test Combatants"
            link
            @click="setCombatants([])"
            ><v-list-item-icon
              ><v-icon v-text="icons.removeTest"></v-icon></v-list-item-icon
            ><v-list-item-title
              >Remove Test Combatants</v-list-item-title
            ></v-list-item
          >
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="menuShowing" app temporary>
      <v-list nav rounded>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="page in pages"
            :key="page.title"
            link
            :to="page.dest"
            @click="activePage = page.title"
          >
            <v-list-item-icon>
              <v-icon v-text="page.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ page.navTitle }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import {
  mdiFormatListNumbered,
  mdiAccountGroup,
  mdiContentSave,
  mdiCloudUploadOutline,
  mdiHome,
  mdiDotsVertical,
  mdiEmail,
  mdiSettings,
  mdiPlusBox,
  mdiMinusBox
} from "@mdi/js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TrackerHeader",
  data: () => ({
    ...mapGetters({
      combatants: "getCombatants"
    }),
    menuShowing: false,
    activePage: "Initiative Tracker",
    pages: [
      {
        title: "Initiative Tracker",
        navTitle: "Home",
        icon: mdiHome,
        dest: "/"
      },
      {
        title: "Tracker",
        navTitle: "Tracker",
        icon: mdiFormatListNumbered,
        dest: "/tracker"
      },
      {
        title: "Encounter",
        navTitle: "Encounter",
        icon: mdiAccountGroup,
        dest: "/encounter"
      },
      {
        title: "Save Encounter",
        navTitle: "Save Encounter",
        icon: mdiContentSave,
        dest: "/save"
      },
      {
        title: "Load Encounter",
        navTitle: "Load Encounter",
        icon: mdiCloudUploadOutline,
        dest: "/load"
      }
    ],
    optionPages: [
      {
        title: "Options",
        icon: mdiSettings,
        dest: "/options"
      },
      {
        title: "E-mail Corbin",
        icon: mdiEmail,
        dest: "/mail"
      }
    ],
    icons: {
      options: mdiDotsVertical,
      addTest: mdiPlusBox,
      removeTest: mdiMinusBox
    }
  }),
  methods: {
    ...mapActions(["setTitle", "addCombatant", "setCombatants"]),
    addTestCombatants() {
      if (this.combatants.length > 0) {
        return;
      }

      this.setTitle("Test Encounter");

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

        this.addCombatant(c);
      }
    }
  }
};
</script>

<style scoped></style>
