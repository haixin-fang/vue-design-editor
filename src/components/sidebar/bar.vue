<template>
  <div class="module-aside-body">
    <button
      class="module-aside-button"
      v-for="(item, index) in modulelist"
      :key="index"
      :class="activeModule && activeModule.type == item.type ? 'actived' : ''"
      @click="selectModule(item)"
    >
      <i :class="item.icon" class="iconfont"></i>
      <span>{{ item.text }}</span>
    </button>
  </div>
</template>
<script>
import { modulelist } from "../../constants/sidebar";
import { ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const list = ref(modulelist);
    const { state, commit } = useStore();
    const activeModule = computed(() => {
      return state.activeModule;
    });
    const isClose = computed(() => {
      return state.isClose;
    });
    function setClose(type) {
      commit("setClose", type);
    }
    function setActiveModule(module) {
      commit("setActiveModule", module);
    }
    return {
      modulelist: list,
      activeModule,
      isClose,
      setActiveModule,
      selectModule(item) {
        if (
          activeModule.value &&
          item.type == activeModule.value.type &&
          !item.drag
        ) {
          setClose(!isClose.value);
          setActiveModule(null);
        } else {
          if (!["text", "qrcode"].includes(item.type)) {
            setClose(false);
          } else {
            setClose(true);
          }
          setActiveModule(item);
        }
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.module-aside-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
  .module-aside-button {
    text-align: center;
    position: relative;
    padding: 12px 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    border-radius: 8px;
    color: #7f8792;
    background: #fff;
    border: none;
    outline: none;
    width: 90%;
    cursor: pointer;
    word-break: break-all;
    user-select: none;
    margin: 4px;
    &:hover {
      background: #f1f2f4;
    }
    &.actived {
      font-weight: bold;
      background: #e8eaec;
      color: #222529;
    }
    > i {
      display: block;
      margin: 0 auto 6px;
      font-size: 24px;
      font-weight: bold;
      color: #222529;
    }
    // &::before {
    //   content: "";
    //   position: absolute;
    //   left: 0;
    //   top: 50%;
    //   height: 40px;
    //   margin-top: -20px;
    //   width: 3px;
    //   background-color: #2354f4;
    //   display: none;
    // }
  }
}
</style>
