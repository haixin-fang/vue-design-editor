<template>
  <framework>
    <template #header>
      <Nav />
    </template>
    <template #module>
      <sidebar @module="selectedModule" />
    </template>
    <template #left>
      <resource />
    </template>
    <template #workspace>
      <workspace />
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
</script>
