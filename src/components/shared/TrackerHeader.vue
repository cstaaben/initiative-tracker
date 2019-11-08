<template>
  <v-container>
    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="menuShowing = !menuShowing" />
      <v-toolbar-title>{{ activePage }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon v-text="optionsIcon"></v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item link>
            <v-list-item-title>E-mail Corbin</v-list-item-title>
          </v-list-item>
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
import { mdiFormatListNumbered } from "@mdi/js";
import { mdiAccountGroup } from "@mdi/js";
import { mdiContentSave } from "@mdi/js";
import { mdiCloudUploadOutline } from "@mdi/js";
import { mdiHome } from "@mdi/js";
import { mdiDotsVertical } from "@mdi/js";

export default {
  name: "TrackerHeader",
  data: () => ({
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
        title: "Combatants",
        navTitle: "Combatants",
        icon: mdiAccountGroup,
        dest: "/combatants"
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
    optionsIcon: mdiDotsVertical
  })
};
</script>

<style scoped></style>
