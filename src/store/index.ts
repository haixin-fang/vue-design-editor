import { createStore } from "vuex";
import request from "@/service/request";

export default createStore({
  state: {
    isClose: true,
    activeModule: null,
    imageList: [],
    loadOk: false,
    icons: [],
    selectedItem: null, // 选中的画布元素
    workspace: null, // 画布对象
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
      state.imageList = value;
    },
    COMMIT_ICONS(state, value) {
      state.icons = value;
    },
    setActivateItem(state, value) {
      state.selectedItem = value;
    },
    setWorkarea(state, value) {
      state.workspace = value;
    },
  },
  actions: {
    getMaterial({ commit }) {
      const pro = [];
      pro.push(
        request({
          url: "https://haixin-fang.github.io/vue-design-editor-static/imglist.json",
          timeout: 10000,
        }).catch((e) => console.error(e))
      );
      pro.push(
        request({
          url: "https://haixin-fang.github.io/icons/bootstrap-icons.json",
          timeout: 10000,
        }).catch((e) => console.error(e))
      );
      Promise.all(pro).then((data) => {
        if (Array.isArray(data)) {
          if (data[0]) {
            commit("Ok", data[0]);
          }
          if (data[1]) {
            const values = Object.keys(data[1]);
            const icons: any = [];
            values.forEach((item) => {
              const url = `https://haixin-fang.github.io/icons/icons/${item}.svg`;
              icons.push({
                url,
              });
            });
            commit("COMMIT_ICONS", icons);
          }
        }
      });
    },
  },
  modules: {},
});
