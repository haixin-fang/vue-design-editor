<template>
  <div class="panel-block__header">
    <div class="panel-block__header-title">{{ title }}</div>
    <div class="panel-block__header-action">
      <span @click="onClick"
        ><slot>{{ subTitle }}</slot></span
      >
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
const emit = defineEmits(["change"]);
defineProps({
  title: String,
  subTitle: String,
});
function onClick() {
  emit("change");
}
</script>
<style lang="scss" scoped>
.panel-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 16px;
  & + .panel-block__content {
    margin-top: 4px;
  }
  .panel-block__header-title {
    display: flex;
    flex: 1;
    flex-grow: 1;
    align-items: center;
    width: 100%;
    height: 100%;
    font: var(--text-p1-bold);
    color: var(--text-color-primary);
  }
  .panel-block__header-action {
    display: flex;
    flex: 1;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    font: var(--text-p2-regular);
    color: #4c535c;
    span {
      color: #4c535c;
    }
  }
}
</style>
