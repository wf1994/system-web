import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import component from "./modules/componentSet.js";

export default new Vuex.Store({
  modules: {
    component
  }
});
