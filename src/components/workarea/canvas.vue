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
    /**
     * 是否可编辑
     */
    editable: {
      type: Boolean,
      default: true,
    },
    objectOption: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 新增素材
     */
    onAdd: {
      type: Function,
    },
    /**
     * 选择元素
     */
    onSelect: {
      type: Function,
    },
    /**
     * 画布加载完成后初始化回调
     */
    init: {
      type: Function,
    },
  },
  setup(props) {
    const id = ref(uuidv4());
    // 禁止把画布设置成响应式,否则缩放和旋转功能失效
    let canvas;
    const parentCanvas = ref();
    const handler = ref();
    onMounted(() => {
      const { offsetWidth, offsetHeight } =
        parentCanvas.value.parentElement.parentElement;
      // 要减去滚动条的高度
      const canvasOptions = Object.assign({
        height: offsetHeight - scrollWidth,
        width: offsetWidth - scrollWidth,
        fireRightClick: true, // 启用右键，button的数字为3
        stopContextMenu: true, // 禁止默认右键菜单
        enableRetinaScaling: true,
        controlsAboveOverlay: true,
      });
      canvas = new fabric.Canvas(`canvas_${id.value}`, canvasOptions);
      canvas.renderAll();
      handler.value = new Handler({
        id: id.value,
        canvas,
        container: parentCanvas.value,
        ...props,
      });
      canvas.selectionColor = "rgba(196,235,255,0.3)";
      canvas.selectionBorderColor = "#6ccfff";
      canvas.selectionLineWidth = 1;
    });
    return {
      id,
      parentCanvas,
      handler,
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
