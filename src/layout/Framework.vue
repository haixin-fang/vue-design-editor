<template>
  <div class="material-editor" ref="editor">
    <div class="material-editor-header">
      <slot name="header"></slot>
    </div>
    <div class="material-editor-content">
      <div
        class="material-editor-framework-module"
        :style="`width:${columnWidth.module}px`"
      >
        <slot name="module"></slot>
      </div>
      <div
        :class="[
          !moduleShow || isClose ? 'material-editor-framework-transition' : '',
        ]"
        :style="`width:${columnWidth.left}px`"
      >
        <div
          class="material-editor-framework-left"
          :style="`width:${columnWidth.left}px`"
        >
          <slot name="left"></slot>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          content="关闭侧边栏"
          placement="right"
        >
          <div
            class="material-editor-framework-close"
            :style="{ left: columnWidth.left + columnWidth.module + 4 + 'px' }"
            @click="onEditListClose"
            v-if="columnWidth.left != 0 && !isClose"
          ></div>
        </el-tooltip>
      </div>
      <div
        class="material-editor-framework-center"
        :style="`width:${columnWidth.center}px`"
      >
        <slot name="navlist"></slot>
        <slot name="workspace"></slot>
      </div>
      <div
        class="material-editor-framework-right"
        :style="`width:${columnWidth.right}px`"
      >
        <slot name="color"></slot>
        <slot name="propsPanel"></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
const DEFAUTL_LEFT_COLUMN_WIDTH = 313;
const DEFAUTL_RIGHT_COLUMN_WIDTH = 265;
const DEFAUTL_RIGHT_MODUELE_WIDTH = 72;
const { state, commit } = useStore();
const editor = ref();
const columnWidth = ref({
  module: DEFAUTL_RIGHT_MODUELE_WIDTH,
  left: DEFAUTL_LEFT_COLUMN_WIDTH,
  center:
    window.document.body.clientWidth -
    DEFAUTL_LEFT_COLUMN_WIDTH -
    DEFAUTL_RIGHT_COLUMN_WIDTH -
    DEFAUTL_RIGHT_MODUELE_WIDTH,
  right: DEFAUTL_RIGHT_COLUMN_WIDTH,
});
const activeModule = computed(() => {
  return state.activeModule;
});
const isClose = computed(() => {
  return state.isClose;
});
const moduleShow = computed(() => {
  return (
    activeModule.value &&
    !activeModule.value.drag &&
    JSON.stringify(activeModule.value) != "{}"
  );
});
onMounted(() => {
  columnWidth.value.center =
    editor.value.offsetWidth -
    DEFAUTL_LEFT_COLUMN_WIDTH -
    DEFAUTL_RIGHT_COLUMN_WIDTH -
    DEFAUTL_RIGHT_MODUELE_WIDTH;
});

function setClose(status: boolean) {
  commit("setClose", status);
}
function onEditListClose() {
  setClose(true);
}
</script>
<style lang="scss" scoped>
.material-editor {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 100000;
  background: white;
  &-header {
    height: 60px;
    border: 1px solid #f1f2f4;
    box-sizing: border-box;
  }
  &-content {
    display: flex;
    height: calc(100% - 60px);
    position: relative;

    &-page {
      height: 100%;
    }
  }
  &-framework {
    &-close {
      position: absolute;
      top: 50%;
      margin-top: -50px;
      z-index: 3;
      width: 20px;
      height: 64px;
      cursor: pointer;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
    }
    &-module {
      width: 50px;
      border-right: 1px solid #f1f2f4;
    }
    &-transition {
      width: 0 !important;
      overflow: hidden;
    }
    &-anime {
      transition: width 0.2s ease-in;
    }
    &-left {
      width: 300px;
      height: 100%;
    }
    &-center {
      flex: 1;
    }
    &-right {
      width: 378px;
      position: relative;
      border-left: 1px solid #f1f2f4;
    }
  }
}
</style>
