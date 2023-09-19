<template>
  <framework>
    <template #header>
      <Nav />
    </template>
    <template #module>
      <sidebar @module="selectedModule" v-show="loadOk" />
    </template>
    <template #left>
      <resource />
    </template>
    <template #workspace>
      <Workspace v-if="loadOk" ref="workspace">
        <template #canvas>
          <Canvas :workareaOption="workareaOption" ref="canvasRef" />
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
const { dispatch, state } = useStore();
const canvasRef = ref();
const handler = ref();
const workspace = ref();
provide("handler", handler);
const loadOk = computed(() => {
  return state.loadOk;
});
watch(loadOk, async (value) => {
  if (value) {
    await nextTick();
    workspace.value.$el.addEventListener("drop", onDrap, false);
    handler.value = canvasRef.value?.handler;
  }
});
onMounted(async () => {
  dispatch("getMaterial");
});

function onDrap(e) {
  if (e.dataTransfer.getData("item")) {
    let data = JSON.parse(e.dataTransfer.getData("item"));
    const { layerX, layerY } = e;
    const item = {
      option: {
        name: data.templateName,
        type: data.type,
        data,
        src: data.url,
        left: layerX,
        top: layerY,
      },
    };
    if (data.width && data.height) {
      item.option.width = data.width;
      item.option.height = data.height;
    }
    let options = Object.assign({}, item);
    onAddItem(options);
    return false;
  }
}

function onAddItem(item) {
  const id = uuidv4();
  const option = Object.assign({}, item.option, { id });
  handler.value.add(option);
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
