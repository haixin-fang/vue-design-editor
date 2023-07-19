<template>
  <div class="editor-props-panel">
    <div class="tab-header">
      <div
        v-for="panelItem in headtool"
        :key="panelItem.text"
        @click="selectTabs(panelItem)"
        v-show="getActiveTab(panelItem)"
      >
        <button class="tab-button">
          <div class="tab-content" :class="getActiveClass(panelItem)">
            {{ panelItem.text }}
          </div>
        </button>
      </div>
    </div>
    <el-scrollbar class="tab-panel" wrap-class="scrollbar-wrapper">
    </el-scrollbar>
  </div>
</template>
<script>
import { panel } from "@/constants/panel";
import { ref } from "vue";
export default {
  setup() {
    const headtool = ref(panel);
    const type = ref("design");
    return {
      headtool,
      getActiveClass(panelItem) {
        if (Array.isArray(panelItem.type)) {
          return panelItem.type.includes(type.value) ? "tabActive" : "";
        }
        return panelItem.type == type.value ? "tabActive" : "";
      },
      selectTabs(item) {
        type.value = item.type;
      },
      getActiveTab(panelItem) {
        return panelItem.type == type.value;
      },
    };
  },
};
</script>
<style lang="scss">
.editor-props-panel {
  position: relative;
  background-color: #fff;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  .tab-header {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    position: absolute;
    background: white;
    top: 0;
    left: 0;
    z-index: 2;
    &::-webkit-scrollbar {
      // width: 10px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 5px;
    }

    &::-webkit-scrollbar-track {
      // background-color: darkgrey;
    }

    .tabActive {
      color: #33383e;
    }

    .tab-button {
      padding: 14px 15px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      position: relative;
      cursor: pointer;
      border: none;
      outline: none;
      user-select: none;
      color: #9da3ac;
      background-color: #fff;
      .tab-content {
        position: relative;
        white-space: nowrap;
      }
    }
  }
}
</style>
