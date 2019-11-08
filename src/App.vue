<template>
  <v-app>
    <v-content class="background: indigo lighten-5">
      <router-view name="header-top"></router-view>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "InitiativeTracker",
  data: () => ({})
};
</script>
