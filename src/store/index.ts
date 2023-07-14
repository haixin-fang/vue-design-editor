import { createStore } from "vuex";

export default createStore({
  state: {
    isClose: true,
    activeModule: null,
  },
  getters: {},
  mutations: {
    setClose(state, value) {
      state.isClose = value;
    },
    setActiveModule(state, value) {
      state.activeModule = value;
    },
  },
  actions: {},
  modules: {},
});
