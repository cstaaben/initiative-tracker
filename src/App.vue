<template>
  <v-app>
    <!--    yellow lighten-4 -->
    <v-content class="background: blue lighten-3">
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
