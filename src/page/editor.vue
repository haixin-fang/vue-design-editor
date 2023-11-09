<template>
  <framework>
    <template #header>
      <Nav />
    </template>
    <template #module>
      <sidebar
        @module="selectedModule"
        v-show="loadOk"
        :onAddItem="onAddItem"
      />
    </template>
    <template #left>
      <resource />
    </template>
    <template #workspace>
      <Workspace v-if="loadOk" ref="workspace">
        <template #canvas>
          <Canvas
            :workareaOption="workareaOption"
            ref="canvasRef"
            :objectOption="defaultOption"
            :onAdd="onAdd"
            :init="init"
          />
        </template>
      </Workspace>
      <atom-spinner
        :animation-duration="1000"
        :size="60"
        color="#2254f4"
        class="spinner"
        v-else
      />
    </template>
    <template #propsPanel>
      <panel />
    </template>
  </framework>
</template>
<script setup>
import Framework from "../layout/Framework.vue";
import Sidebar from "../components/sidebar/bar.vue";
import Resource from "../components/sidebar/resource.vue";
import Workspace from "../components/workarea/workspace.vue";
import Panel from "../components/panel/index.vue";
import Nav from "@/layout/Nav.vue";
import { v4 as uuidv4 } from "uuid";
import Canvas from "@/components/workarea/canvas.vue";
import { workareaOption } from "@/constants/workspace";
import { ref, onMounted, provide, computed, watch, nextTick } from "vue";
import { AtomSpinner } from "epic-spinners";
import { useStore } from "vuex";
const { dispatch, state, commit } = useStore();
const canvasRef = ref();
const handler = ref();
const workspace = ref(); // 操作区dom
const defaultOption = ref({ filters: [] });
const canvas = ref(); // 画布fabric对象
provide("handler", handler);
provide("canvas", canvas);
const loadOk = computed(() => {
  return state.loadOk;
});
// 页面数据加载完成后同步执行init方法
let loadResolve;
const loadPro = new Promise((resolve) => {
  loadResolve = resolve;
});
watch(loadOk, async (value) => {
  if (value) {
    await nextTick();
    workspace.value.$el.addEventListener("drop", onDrap, false);
    handler.value = canvasRef.value?.handler;
    canvas.value = handler.value.canvas;
    loadResolve();
  }
});
onMounted(async () => {
  dispatch("getMaterial");
});

function onDrap(e) {
  if (e.dataTransfer.getData("item")) {
    let data = JSON.parse(e.dataTransfer.getData("item"));
    const { layerX, layerY } = e;
    const pointerVpt = handler.value.canvas.restorePointerVpt({
      x: layerX,
      y: layerY,
    });
    const item = {
      option: {
        name: data.templateName,
        type: data.type,
        data,
        src: data.url || data.src,
        left: pointerVpt.x,
        top: pointerVpt.y,
      },
    };
    if (data.width && data.height) {
      item.option.width = data.width;
      item.option.height = data.height;
    }
    let options = Object.assign({}, item);
    onAddItem(options);
  }
}

function onAddItem(item) {
  const id = uuidv4();
  const option = Object.assign({}, item.option, { id });
  handler.value.add(option);
}

function onAdd(target) {
  commit("setActivateItem", target);
  handler.value.select(target);
}
// 初始化完成后执行的逻辑
async function init() {
  await loadPro;
  commit("setWorkarea", handler.value?.workareaHandler.workspace);
  await nextTick();
  workspace.value.initRuleRange();
}
</script>
<style lang="scss" scoped>
.spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
