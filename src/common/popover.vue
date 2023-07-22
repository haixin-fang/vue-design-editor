<template>
  <teleport :to="to">
    <transition name="appear">
      <div class="gda-popover" ref="popover" v-show="show">
        <div class="gda-popover-content">
          <div class="gda-popover-arrow" v-if="arrow"></div>
          <div class="gda-popover-inner">
            <transition name="appear">
              <slot :setSlotRef="setSlotRef" />
            </transition>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import { defineProps, watch, ref, onUnmounted, useSlots, nextTick } from "vue";
import { throttle } from "lodash-es";
const props = defineProps({
  to: {
    type: String,
    default: "body",
  },
  arrow: {
    type: Boolean,
    default: false,
  },
  dom: {
    type: HTMLElement,
    default: null,
  },
  show: {
    type: Boolean,
    default: false,
  },
});
let el = null,
  resizeObserver = null;
const popover = ref();
const slots = useSlots();

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        init();
      });
    }
  }
);

onUnmounted(() => {
  window.removeEventListener("resize", init);
});

const observe = () => {
  window.addEventListener("resize", init);
  resizeObserver = new ResizeObserver(
    throttle(() => {
      init();
    }, 50)
  );
  resizeObserver.observe(el);
};

function init() {
  if (!resizeObserver) {
    observe();
  }
  const { width, height, left, top, bottom, right } =
    props.dom?.getBoundingClientRect();
  const { offsetWidth, offsetHeight } = el;
  let popoverTop = 0,
    popoverLeft = 0;
  if (top > offsetHeight + 10) {
    popoverTop = top - offsetHeight - 10;
    // 向上展示
    if (offsetWidth < right) {
      // 默认向右上角
      popoverLeft = left + width - offsetWidth;
    } else {
      popoverLeft = left;
    }
  } else if (bottom > offsetHeight + 10) {
    popoverTop = top + height + 10;
    // 向下展示
    if (offsetWidth < right) {
      // 默认向右下角
      popoverLeft = left + width - offsetWidth;
    } else {
      popoverLeft = left;
    }
  }
  popover.value.style.left = popoverLeft + "px";
  popover.value.style.top = popoverTop + "px";
}

const setSlotRef = (dom) => {
  el = dom;
};
</script>
<style lang="scss">
.gda-popover {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--text-color-primary);
  font-size: var(--font-size-medium);
  font-variant: tabular-nums;
  line-height: var(--line-height-medium);
  list-style: none;
  font-feature-settings: "tnum";
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2030;
  font-weight: 400;
  white-space: normal;
  text-align: left;
  cursor: auto;
  .gda-popover-arrow {
    right: 16px;
    bottom: -6.55634919px;
    position: absolute;
    display: block;
    width: 15.55634919px;
    height: 15.55634919px;
    overflow: hidden;
    background: transparent;
    pointer-events: none;
    z-index: 1;
  }
  .gda-popover-inner {
    position: relative;
    right: -5px;
    background: var(--background-color-primary-regular);
    border-radius: var(--border-radius-large);
    box-shadow: 0 6px 32px 4px #00000014, 0 0 1px #00000029;
  }
}
</style>
