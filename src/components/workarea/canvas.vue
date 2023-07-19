<template>
  <div
    :style="{ width: '100%', height: '100%' }"
    ref="parentCanvas"
    class="parentCanvas"
    :id="id"
  >
    <canvas :id="`canvas_${id}`"></canvas>
  </div>
</template>
<script>
import { fabric } from "fabric";
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import Handler from "@/core/handler";
const scrollWidth = 12;
export default {
  props: {
    workareaOption: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const id = ref(uuidv4());
    const canvas = ref();
    const parentCanvas = ref();
    const handler = ref();
    onMounted(() => {
      const { offsetWidth, offsetHeight } =
        parentCanvas.value.parentElement.parentElement;
      // 要减去滚动条的高度
      const canvasOptions = Object.assign(
        {},
        {
          height: offsetHeight - scrollWidth,
          width: offsetWidth - scrollWidth,
        }
      );
      canvas.value = new fabric.Canvas(`canvas_${id.value}`, canvasOptions);
      canvas.value.renderAll();
      handler.value = new Handler({
        id: id.value,
        canvas: canvas.value,
        container: parentCanvas.value,
        ...props,
      });
    });
    return {
      id,
      parentCanvas,
    };
  },
};
</script>

<style>
.parentCanvas {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 0,
      transparent 75%,
      #eee 0,
      #eee
    ),
    linear-gradient(45deg, #eee 25%, #fff 0, #fff 75%, #eee 0, #eee);
  box-shadow: 0 5px 30px 0 rgb(0 0 0 / 10%); */
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
}
</style>
