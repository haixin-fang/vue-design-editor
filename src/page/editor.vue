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
      <workspace v-if="loadOk">
        <template #canvas>
          <Canvas :workareaOption="workareaOption" ref="canvas" />
        </template>
      </workspace>
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
import Canvas from "@/components/workarea/canvas.vue";
import { workareaOption } from "@/constants/workspace";
import { ref, onMounted, provide, computed } from "vue";
import { AtomSpinner } from "epic-spinners";
import { useStore } from "vuex";
const { dispatch, state } = useStore();
const canvas = ref();
const handler = ref();
provide("handler", handler);
const loadOk = computed(() => {
  return state.loadOk;
});
onMounted(async () => {
  handler.value = canvas.value?.handler;
  dispatch("getMaterial");
});
</script>
<style lang="scss" scoped>
.spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
