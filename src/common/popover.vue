<template>
  <teleport :to="to">
    <transition name="fade">
      <div class="gda-popover" ref="popover" v-show="show">
        <div class="gda-popover-content">
          <div class="gda-popover-arrow" v-if="arrow"></div>
          <div class="gda-popover-inner">
            <slot :setSlotRef="setSlotRef" />
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
    popoverLeft = 0,
    originX = 0,
    originY = 0;
  if (top > offsetHeight + 10) {
    popoverTop = top - offsetHeight - 10;
    originY = offsetHeight + 10;
    // 向上展示
    if (offsetWidth < right) {
      // 默认向右上角
      popoverLeft = left + width - offsetWidth;
      originX = offsetWidth;
    } else {
      popoverLeft = left;
      originX = 0;
    }
  } else if (bottom > offsetHeight + 10) {
    popoverTop = top + height + 10;
    originY = 10;
    // 向下展示
    if (offsetWidth < right) {
      // 默认向右下角
      popoverLeft = left + width - offsetWidth;
      originX = offsetWidth;
    } else {
      popoverLeft = left;
      originX = 0;
    }
  }
  popover.value.style.left = popoverLeft + "px";
  popover.value.style.top = popoverTop + "px";
  popover.value.style.transformOrigin = `${originX}px ${originY}px`;
}

const setSlotRef = (dom) => {
  el = dom;
};
</script>
<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
  transform: scale(0);
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  transform: scale(1);
  opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
  transition: opacity, transform 0.2s cubic-bezier(0.08, 0.82, 0.17, 1);
}

.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
}

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
  transform-origin: center center;
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
