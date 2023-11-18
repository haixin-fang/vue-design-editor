<template>
  <!-- :gradientType="'linear'" -->
  <color-picker
    :pureColor="pureColor"
    :gradientColor="gradientColor"
    :isWidget="true"
    :useType="useType"
    @pureColorChange="onPureColor"
    @gradientDataChange="gradientColorChange"
  />
</template>
<script setup>
import { ColorPicker } from "colorpickers";
import "colorpickers/style.css";
import { defineProps, defineEmits } from "vue";
const emit = defineEmits(["select"]);
defineProps({
  useType: { type: String, default: "both" },
  pureColor: {
    type: String,
    default: "red",
  },
  gradientColor: {
    type: String,
    default: "",
  },
});
function onPureColor(color) {
  emit("select", {
    fill: color,
  });
}
function gradientColorChange(color) {
  emit("select", {
    gradient: color,
  });
}
</script>
