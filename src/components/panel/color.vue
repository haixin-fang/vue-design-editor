<template>
  <color-picker
    :pureColor="pureColor"
    :gradientColor="gradientColor"
    :isWidget="true"
    :useType="useType"
    @pureColorChange="onPureColor"
    @gradientColorChange="gradientColorChange"
  />
</template>
<script setup>
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { ref, defineProps } from "vue";
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
  console.log(color);
}
function gradientColorChange(color) {
  console.log("grandient", color);
}

</script>
