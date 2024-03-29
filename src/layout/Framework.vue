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
        class="material-editor-framework--collapsed"
        :class="[
          !moduleShow || isClose ? 'material-editor-framework-transition' : '',
        ]"
        :style="{
          width: `${columnWidth.left}px`,
          '--width': -columnWidth.left + 'px',
        }"
      >
        <div class="material-editor-framework-left">
          <slot name="left"></slot>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          content="关闭侧边栏"
          placement="right"
        >
          <img
            src="../assets/module-close.svg"
            class="material-editor-framework-close"
            @click="onEditListClose"
            v-show="columnWidth.left != 0 && !isClose"
            alt=""
          />
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
import { ElTooltip } from "element-plus";
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
async function onEditListClose() {
  setClose(true);
  commit("setActiveModule", null);
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
      right: 0;
      z-index: 1;
      cursor: pointer;
      transform: translate(calc(100% - 3px), -50%);
    }
    &-module {
      width: 50px;
      border-right: 1px solid #f1f2f4;
      z-index: 3;
      background: white;
    }
    &--collapsed {
      transition: margin-left 0.25s ease;
      position: relative;
      border-right: 1px solid rgba(0, 0, 0, 0.08);
      z-index: 2;
    }
    &-transition {
      overflow: hidden;
      margin-left: var(--width);
      z-index: 1;
    }
    &-left {
      height: 100%;
      width: 100%;
    }
    &-center {
      flex: 1;
      background: #f6f7f9;
      z-index: 1;
      position: relative;
    }
    &-right {
      width: 378px;
      position: relative;
      border-left: 1px solid #f1f2f4;
    }
  }
}
</style>
