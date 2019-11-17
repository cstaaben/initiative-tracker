<template>
  <v-app>
    <v-content class="background: blue lighten-3">
      <router-view name="header-top"></router-view>
      <transition name="slide" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "InitiativeTracker",
  data: () => ({})
};
</script>

<style scoped>
.slide-leave-active {
  transition: opacity 400ms ease;
  opacity: 0;
  animation: slide-out 400ms ease-out forwards;
}

.slide-leave {
  opacity: 1;
  transform: translateX(0);
}

.slide-enter-active {
  animation: slide-in 400ms ease-out forwards;
}

@keyframes slide-out {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(30px);
  }
}

@keyframes slide-in {
  0% {
    transform: translateX(30px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
