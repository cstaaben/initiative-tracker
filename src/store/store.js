import Vue from "vue";
import Vuex from "vuex";
import encounter from "./modules/encounter";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    encounter
  }
});
