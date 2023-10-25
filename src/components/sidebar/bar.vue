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
import { ref, computed, toRaw } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    onAddItem: {
      type: Function,
    },
  },
  setup(props) {
    const list = ref(modulelist);
    const { onAddItem } = toRaw(props);
    const { state, commit } = useStore();
    const activeModule = computed(() => {
      return state.activeModule;
    });
    const isClose = computed(() => {
      return state.isClose;
    });
    const workspace = computed(() => {
      return state.workspace;
    });
    function setClose(type) {
      commit("setClose", type);
    }
    function setActiveModule(module) {
      commit("setActiveModule", module);
    }
    list.value.find((item) => {
      if (item.show) {
        setActiveModule(item);
        setClose(false);
      }
    });
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
        if (item.drag) {
          let morenItem;
          const random = parseInt(Math.random() * 80);
          if (item.type == "text") {
            morenItem = {
              option: {
                width: 60,
                height: 30,
                fontSize: 32,
                name: "自定义字体",
                text: "文字点击输入",
                type: "FontCustom",
                left:
                  workspace.value.left +
                  workspace.value.width / 2 -
                  30 -
                  random,
                top:
                  workspace.value.top +
                  workspace.value.height / 2 -
                  15 -
                  random,
              },
            };
          } else if (item.type == "qrcode") {
            morenItem = {
              option: {
                width: 200,
                height: 200,
                name: "二维码",
                type: "qrcode",
                src: "https://pic5.40017.cn/i/ori/1e1kdqSZAgo.png?h=200&w=200",
                left: this.canvasRef.handler.width / 2 - 100 - random,
                top: this.canvasRef.handler.height / 2 - 100 - random,
              },
            };
          }
          let options = Object.assign({}, item, morenItem);
          onAddItem(options);
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
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    border-radius: 8px;
    color: #7f8792;
    background: #fff;
    border: none;
    outline: none;
    width: 56px;
    height: 66px;
    cursor: pointer;
    word-break: break-all;
    user-select: none;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin: 4px;
    &:hover {
      background: #f1f2f4;
    }
    &.actived {
      font-weight: bold;
      background: #e8eaec;
      color: #222529;
    }
    span {
      white-space: nowrap;
    }
    > i {
      display: block;
      // margin: 0 auto 6px;
      margin-bottom: 4px;
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
