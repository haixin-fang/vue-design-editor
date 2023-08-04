import { createStore } from "vuex";
import request from "@/service/request";

export default createStore({
  state: {
    isClose: true,
    activeModule: null,
    materialList: [],
    loadOk: false,
  },
  getters: {},
  mutations: {
    setClose(state, value) {
      state.isClose = value;
    },
    setActiveModule(state, value) {
      state.activeModule = value;
    },
    Ok(state, value) {
      state.loadOk = true;
      state.materialList = value;
    },
  },
  actions: {
    getMaterial({ commit }) {
      request({
        url: "https://haixin-fang.github.io/vue-design-editor-static/imglist.json",
      }).then((res) => {
        commit("Ok", res);
      });
    },
  },
  modules: {},
});
