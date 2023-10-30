<template>
  <div class="main">
    <div class="box" @click="onRestore" ref="box" v-show="ruleShow">
      <span>{{ unitType }}</span>
    </div>
    <div class="ruler horizontal" v-show="ruleShow">
      <!-- :selectedRanges="horRange" -->
      <!-- :DragPosFormat="DragPosFormat" -->
      <!-- :textFormat="textFormat" -->

      <Guides
        ref="guides1"
        type="horizontal"
        direction="start"
        textAlign="left"
        textBackgroundColor="transparent"
        rangeBackgroundColor="red"
        :textOffset="[0, -8]"
        :selectedRangesTextOffset="[0, -8]"
        :longLineSize="5"
        :textFormat="textFormat"
        mainLineSize="50%"
        selectedBackgroundColor="#d9dcdf"
        backgroundColor="#f6f7f9"
        lineColor="#7f8792"
        :defaultPixelScale="1"
        :scrollPos="20"
        :selectedRangesText="true"
        textColor="#7f8792"
        selectedRangesTextColor="red"
        :zoom="shellPoi && shellPoi.zoom"
        markColor="red"
        :segment="2"
        :displayDragPos="false"
        :rulerStyle="{
          left: '20px',
          width: 'calc(100% - 20px)',
          height: '20px',
        }"
        :unit="unit"
        :useResizeObserver="true"
        @changeGuides="OnChangeGuides"
      />
    </div>
    <!-- :selectedRanges="verRange" -->
    <!-- :textFormat="verTextFormat" -->

    <div class="ruler vertical" v-show="ruleShow">
      <Guides
        ref="guides2"
        type="vertical"
        direction="start"
        textAlign="right"
        textBackgroundColor="transparent"
        rangeBackgroundColor="red"
        :textOffset="[-8, 0]"
        :selectedRangesTextOffset="[-8, 0]"
        :longLineSize="5"
        mainLineSize="50%"
        selectedBackgroundColor="#d9dcdf"
        backgroundColor="#f6f7f9"
        lineColor="#7f8792"
        :selectedRangesText="true"
        :textFormat="verTextFormat"
        textColor="#7f8792"
        selectedRangesTextColor="red"
        markColor="red"
        :zoom="shellPoi && shellPoi.zoom"
        :segment="1"
        :useResizeObserver="true"
        :unit="unit"
        :displayDragPos="true"
        :rulerStyle="{
          top: '20px',
          height: 'calc(100% - 20px)',
          width: '20px',
        }"
      />
    </div>
    <div class="editor-container" ref="container">
      <div class="editor-shell-wrap" ref="shell">
        <!-- <div class="editor-shell"></div> -->
        <slot name="canvas"></slot>
      </div>
    </div>
    <div class="edit-bottom">
      <ScaleBar
        :clearRule="clearRule"
        :lockRule="lockRule"
        :ruleShow="ruleShow"
        :onRuleShow="onRuleShow"
      />
    </div>
  </div>
</template>
<script>
import Guides from "@/common/guides/index.vue";
import { ref, onMounted, onUnmounted, computed, inject, watch } from "vue";
import { useStore } from "vuex";
import ScaleBar from "./scale-bar.vue";
export default {
  components: {
    Guides,
    ScaleBar,
  },
  setup() {
    /**
     * 标尺相关逻辑
     */
    const guides1 = ref();
    const guides2 = ref();
    const shell = ref();
    const shellPoi = ref(null);
    const container = ref();
    const handler = inject("handler");
    const lockGuides = ref(true);
    const unit = ref();
    const ruleShow = ref(true);
    const { state } = useStore();
    const workspace = computed(() => {
      const viewportTransform = handler.value?.canvas?.viewportTransform;
      const workspace = state.workspace;
      // updateUnit();
      if (viewportTransform && workspace) {
        return {
          left: parseInt(viewportTransform[4]),
          top: parseInt(viewportTransform[5]),
          zoom: viewportTransform[0],
          width: workspace.width,
          height: workspace.height,
        };
      }
      return {
        left: 0,
        x: 1,
        y: 1,
        top: 0,
      };
    });
    const unitType = computed(() => {
      return state.workspace?.unit;
    });
    watch(
      () => workspace.value?.zoom,
      () => {
        initRuleRange();
        // updateUnit();
      },
      { deep: true }
    );
    watch(
      () => [state.workspace?.width, state.workspace?.height, unitType.value],
      () => {
        updateUnit();
      }
    );
    onMounted(() => {
      initRuleRange();
      window.addEventListener("resize", onResize);
      container.value.addEventListener("scroll", onScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", onResize);
    });
    /**
     * 标尺
     */
    const horRange = computed(() => {
      if (shellPoi.value) {
        return [
          [shellPoi.value.left, shellPoi.value.left + shellPoi.value.width],
        ];
      } else {
        return [];
      }
    });
    const verRange = computed(() => {
      if (shellPoi.value) {
        return [
          [shellPoi.value.top, shellPoi.value.top + shellPoi.value.height],
        ];
      } else {
        return [];
      }
    });
    const diff = computed(() => {
      if (shellPoi.value) {
        return (
          shellPoi.value.width -
          (shellPoi.value.width * (1 - shellPoi.value.zoom)) / 2
        );
      } else {
        return 0;
      }
    });

    function updateUnit() {
      if (container.value && handler.value) {
        const { offsetWidth, offsetHeight } = container.value;
        const { width, height } = handler.value.workareaHandler.option;
        let unitValue = handler.value.workareaHandler?.unitEnum[unitType.value];
        const maxUnit = {
          px: 1000,
          cm: 100,
          mm: 100,
        };
        let zoom = workspace.value?.zoom
          ? workspace.value.zoom > 1
            ? 1
            : workspace.value.zoom
          : 1; // 缩放比例,越小刻度越大
        // 超过1000 后 刻度显示比较拥挤
        const scale = handler.value?.workareaHandler.getAutoScale();
        // 缩放比例小于最适应尺寸时
        if (zoom < scale) {
          zoom = zoom / scale;
        }
        const base = width > 1000 || height > 1000 ? 100 : 50;
        const KEDU = 50; // 相比于改值是几倍
        const MORENUNIT = 50; // 默认刻度
        // mm 刻度比较拥挤
        if (unitType.value == "mm") {
          unitValue /= 3;
        }
        console.log("zoom", zoom);
        console.log("unitValue", unitValue);
        if (offsetWidth / width < offsetHeight / height) {
          unit.value = parseInt(
            (Math.floor(
              parseInt(MORENUNIT / (offsetWidth / width) / zoom) / KEDU
            ) || 1) * base || 10
          );
        } else {
          unit.value = parseInt(
            (Math.floor(
              parseInt(MORENUNIT / (offsetHeight / height) / zoom) / KEDU
            ) || 1) * base || 10
          );
        }
        if (unit.value < unitValue) {
          unit.value = (unitValue / zoom) * 2;
        } else if (unit.value > maxUnit[unitType.value]) {
          unit.value = maxUnit[unitType.value];
        }
      }
    }

    function onResize() {
      guides1.value.resize();
      guides2.value.resize();
      if (workspace.value) {
        initRuleRange();
      }
    }

    function onScroll() {
      const scrollTop = container.value.scrollTop;
      const scrollLeft = container.value.scrollLeft;
      guides1.value.scroll(scrollLeft);
      guides2.value.scrollGuides(scrollLeft);
      guides2.value.scroll(scrollTop);
      guides1.value.scrollGuides(scrollTop);
    }

    function initRuleRange() {
      if (workspace.value) {
        // 要减去标尺的x,y坐标
        shellPoi.value = {
          left: workspace.value.left,
          top: workspace.value.top,
          width: workspace.value.width,
          height: workspace.value.height,
          zoom: workspace.value.zoom,
        };
      }
    }

    function clearRule() {
      guides1.value.loadGuides([]);
      guides2.value.loadGuides([]);
    }
    function lockRule() {
      lockGuides.value = !lockGuides.value;
    }

    function OnChangeGuides(e) {
      e.isChange = false;
    }

    function onRuleShow() {
      ruleShow.value = !ruleShow.value;
    }

    return {
      /**
       * 标尺相关逻辑
       */
      guides1,
      guides2,
      horRange,
      verRange,
      shell,
      shellPoi,
      container,
      clearRule,
      lockRule,
      unitType,
      unit,
      OnChangeGuides,
      ruleShow,
      onRuleShow,
      textFormat(value) {
        // if (shellPoi.value) {
        //   if (value == shellPoi.value.left) {
        //     return 0;
        //   } else if (value == shellPoi.value.left + shellPoi.value.width) {
        //     return shellPoi.value.width;
        //   } else if (
        //     value >= shellPoi.value.left &&
        //     value <= shellPoi.value.left + shellPoi.value.width
        //   ) {
        //     return value - shellPoi.value.left;
        //   } else if (value <= shellPoi.value.left) {
        //     return Math.abs(value - shellPoi.value.left);
        //   } else if (value >= shellPoi.value.left + shellPoi.value.width) {
        //     return value - shellPoi.value.width;
        //   }
        // }

        return parseInt(
          value / handler.value?.workareaHandler.unitEnum[unitType.value]
        );
      },
      verTextFormat(value) {
        // if (shellPoi.value) {
        //   if (value == shellPoi.value.top) {
        //     return 0;
        //   } else if (value == shellPoi.value.top + shellPoi.value.height) {
        //     return shellPoi.value.height;
        //   } else if (
        //     value >= shellPoi.value.top &&
        //     value <= shellPoi.value.top + shellPoi.value.height
        //   ) {
        //     return value - shellPoi.value.top;
        //   } else if (value <= shellPoi.value.top) {
        //     return Math.abs(value - shellPoi.value.top);
        //   } else if (value >= shellPoi.value.top + shellPoi.value.height) {
        //     return value - shellPoi.value.top;
        //   }
        // }

        return parseInt(
          value / handler.value?.workareaHandler.unitEnum[unitType.value]
        );
      },
      DragPosFormat(value) {
        console.log("value", value);
        return value;
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.main {
  position: relative;
  height: 100%;
  width: 100%;
  background: #f6f7f9;
  .ruler {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
  .ruler.horizontal {
    left: 0px;
    width: 100%;
    height: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
  }
  .ruler.vertical {
    top: 0px;
    width: 20px;
    height: 100%;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
  }
  .box {
    position: relative;
    width: 20px;
    height: 20px;
    background: #f6f7f9;
    box-sizing: border-box;
    z-index: 21;
    display: flex;
    align-items: center;
    font-size: 12px;
    justify-content: center;
    color: #9da3ac;
    span {
      transform: translate(1px, -1px) scale(0.83);
      transform-origin: center;
    }
  }
  .box:before,
  .box:after {
    position: absolute;
    content: "";
    background: #e8eaec;
  }
  .box:before {
    width: 1px;
    height: 100%;
    left: 100%;
  }
  .box:after {
    height: 1px;
    width: 100%;
    top: 100%;
  }
  .editor-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    overflow: hidden;
    font: 14px/1.5 Arial, PingFangSC-Regular, STHeitiSC-Light, Helvetica Neue;
    color: #333;
    background: none;
    outline: none;
    .editor-shell-wrap {
      // padding: 24px 40px 120px;
      position: relative;
      box-sizing: content-box;
      margin: 0 auto;
      overflow: visible;
      // .editor-shell {
      //   height: 1641px;
      //   width: 260px;
      //   position: relative;
      //   margin: 0 auto;
      //   background: no-repeat 0 0;
      //   box-shadow: 1px 1px 15px #0000001a;
      // }
    }
  }
  .edit-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
