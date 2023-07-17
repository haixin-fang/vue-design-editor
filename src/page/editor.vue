<template>
  <framework>
    <template #module>
      <sidebar @module="selectedModule" />
    </template>
    <template #left>
      <Resource />
    </template>
    <template #workspace>
      <Workspace />
    </template>
  </framework>
</template>
<script setup>
import Framework from "../layout/Framework.vue";
import Sidebar from "../components/sidebar/bar.vue";
import Resource from "../components/sidebar/resource.vue";
import Workspace from "../components/workarea/workspace.vue";
</script>
