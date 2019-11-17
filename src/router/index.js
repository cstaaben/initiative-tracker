import Vue from "vue";
import VueRouter from "vue-router";
import TrackerHome from "../components/TrackerHome.vue";
import TrackerHeader from "../components/shared/TrackerHeader.vue";
import Tracker from "../components/tracker/Tracker.vue";

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
      "header-top": TrackerHeader,
      default: Tracker
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
  },
  {
    path: "/options",
    name: "options",
    components: {
      "header-top": TrackerHeader
    }
  },
  {
    path: "/mail",
    name: "mail",
    components: {
      "header-top": TrackerHeader
    }
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  routes
});

export default router;
