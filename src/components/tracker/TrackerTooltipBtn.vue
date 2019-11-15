<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn @click="clickAction" :class="btnClass" v-on="on" v-show="showing"
        ><v-icon v-text="icon"></v-icon
      ></v-btn>
    </template>
    <span><slot></slot></span>
  </v-tooltip>
</template>

<script>
export default {
  name: "TrackerTooltipBtn",
  props: ["icon", "showing", "clickAction", "btnClass"]
};
</script>

<style scoped></style>
