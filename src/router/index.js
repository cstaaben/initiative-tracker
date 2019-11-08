import Vue from "vue";
import VueRouter from "vue-router";
import TrackerHome from "../components/TrackerHome.vue";
import TrackerHeader from "../components/shared/TrackerHeader.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    components: {
      default: TrackerHome,
      "header-top": TrackerHeader
    }
  },
  {
    path: "/tracker",
    name: "tracker",
    components: {
      "header-top": TrackerHeader
    }
  },
  {
    path: "/combatants",
    name: "combatants",
    components: {
      "header-top": TrackerHeader
    }
  },
  {
    path: "/save",
    name: "save",
    components: {
      "header-top": TrackerHeader
    }
  },
  {
    path: "/load",
    name: "load",
    components: {
      "header-top": TrackerHeader
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
