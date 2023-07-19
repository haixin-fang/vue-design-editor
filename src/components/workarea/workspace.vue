<template>
  <div class="main">
    <div class="box" @click="onRestore" ref="box" />
    <div class="ruler horizontal">
      <Guides
        ref="guides1"
        type="horizontal"
        direction="start"
        textAlign="right"
        textBackgroundColor="transparent"
        rangeBackgroundColor="red"
        :textOffset="[0, -8]"
        :selectedRangesTextOffset="[0, -8]"
        :longLineSize="5"
        mainLineSize="50%"
        selectedBackgroundColor="#d9dcdf"
        backgroundColor="#f6f7f9"
        lineColor="#7f8792"
        :selectedRanges="horRange"
        :selectedRangesText="true"
        textColor="#7f8792"
        selectedRangesTextColor="red"
        :guidesOffset="shellPoi && shellPoi.top"
        :DragPosFormat="DragPosFormat"
        markColor="red"
        :segment="2"
        :textFormat="textFormat"
        :displayDragPos="true"
        :rulerStyle="{
          left: '10px',
          width: 'calc(100% - 20px)',
          height: '20px',
        }"
      />
    </div>
    <div class="ruler vertical">
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
        :guidesOffset="shellPoi && shellPoi.left"
        lineColor="#7f8792"
        :selectedRanges="verRange"
        :selectedRangesText="true"
        textColor="#7f8792"
        selectedRangesTextColor="red"
        :textFormat="verTextFormat"
        markColor="red"
        :segment="2"
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
  </div>
</template>
<script>
import Guides from "@/common/guides/index.vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
export default {
  components: {
    Guides,
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
    function onResize() {
      guides1.value.resize();
      guides2.value.resize();
      initRuleRange();
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
      shellPoi.value = {
        left: shell.value.offsetLeft + 20,
        top: shell.value.offsetTop + 4,
        width: shell.value.offsetWidth - 80,
        height: shell.value.offsetHeight - 120 - 24,
      };
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
      textFormat(value) {
        if (shellPoi.value) {
          if (value == shellPoi.value.left) {
            return 0;
          } else if (value == shellPoi.value.left + shellPoi.value.width) {
            return shellPoi.value.width;
          } else if (
            value >= shellPoi.value.left &&
            value <= shellPoi.value.left + shellPoi.value.width
          ) {
            return value - shellPoi.value.left;
          } else if (value <= shellPoi.value.left) {
            return Math.abs(value - shellPoi.value.left);
          } else if (value >= shellPoi.value.left + shellPoi.value.width) {
            return value - shellPoi.value.width;
          }
        }

        return "";
      },
      verTextFormat(value) {
        if (shellPoi.value) {
          if (value == shellPoi.value.top) {
            return 0;
          } else if (value == shellPoi.value.top + shellPoi.value.height) {
            return shellPoi.value.height;
          } else if (
            value >= shellPoi.value.top &&
            value <= shellPoi.value.top + shellPoi.value.height
          ) {
            return value - shellPoi.value.top;
          } else if (value <= shellPoi.value.top) {
            return Math.abs(value - shellPoi.value.top);
          } else if (value >= shellPoi.value.top + shellPoi.value.height) {
            return value - shellPoi.value.top;
          }
        }

        return "";
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
    box-sizing: content-box;
  }
  .ruler.vertical {
    top: 0px;
    width: 20px;
    height: 100%;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    box-sizing: content-box;
  }
  .box {
    position: relative;
    width: 20px;
    height: 20px;
    background: #f6f7f9;
    box-sizing: border-box;
    z-index: 21;
  }
  .box:before,
  .box:after {
    position: absolute;
    content: "";
    background: #f6f7f9;
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
    overflow: scroll;
    font: 14px/1.5 Arial, PingFangSC-Regular, STHeitiSC-Light, Helvetica Neue;
    color: #333;
    background: none;
    outline: none;
    cursor: image-set(url(https://cdn.dancf.com/fe-assets/img/c7ca2e9….svg) 2x, url(blob:https://www.gaoding.com/ced31cf5-7b1f-40e1-8555-987473b65174) 1x) 6 2, default;
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
}
</style>
