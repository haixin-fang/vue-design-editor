<template>
  <div class="dc-layout-scale-bar popover" ref="scaleDom">
    <svg
      role="img"
      aria-label="minus"
      focusable="false"
      data-icon="minus"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="gd_design_icon gd_design_icon-minus"
      @click="onMinus"
    >
      <path
        d="M12.75 12.75H21V11.25H12.75H11.25H3V12.75H11.25H12.75Z"
        fill="currentColor"
      ></path></svg
    ><svg
      role="img"
      aria-label="add"
      focusable="false"
      data-icon="add"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="gd_design_icon gd_design_icon-add"
      @click="onBig"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.25 12.75V21H12.75V12.75H21V11.25H12.75V3H11.25V11.25H3V12.75H11.25Z"
        fill="currentColor"
      ></path></svg
    ><span
      class="dc-layout-scale-bar__percent gda-popover-open"
      @click="showMenu"
      :random="random"
    >
      {{ getZoom() }}
    </span>
    <popover :dom="scaleDom" :show="menuShow" @close="menuShow = false">
      <template v-slot="{ setSlotRef }">
        <div class="content" :ref="(el) => setSlotRef(el)">
          <template v-for="(menu, index) in menus" :key="index">
            <template v-for="item in menu" :key="item.type">
              <div
                class="dc-layout-scale-bar-item__menu__item"
                :class="getActive(item) ? 'menu-active' : ''"
                @click="handlerEvent(item)"
              >
                <span class="dc-layout-scale-bar-item__menu__item--main">{{
                  item.title
                }}</span>
              </div>
            </template>
            <hr />
          </template>
        </div>
      </template>
    </popover>
  </div>
</template>
<script setup>
import { ref, inject, onMounted, onUnmounted, defineProps } from "vue";
const menuShow = ref(false);
const scaleDom = ref();
const canvas = inject("canvas");
const handler = inject("handler");
const props = defineProps({
  clearRule: {
    type: Function,
  },
  lockRule: {
    type: Function,
  },
  onRuleShow: {
    type: Function,
  },
  ruleShow: {
    type: Boolean,
  },
});
// 强制执行getZoom()
const random = ref();

const menus = ref([
  [
    {
      type: "showRule",
      title: "显示标尺和参考线",
      status: () => {
        props.onRuleShow();
      },
    },
  ],
  [
    // {
    //   type: "lock",
    //   title: "锁定参考线",
    //   status: () => {
    //     props.lockRule();
    //   },
    // },
    {
      type: "clearRule",
      title: "清除参考线",
      status: () => {
        props.clearRule();
      },
    },
  ],
  [
    {
      type: "size",
      title: "400%",
      value: 4,
      status: () => {
        handler.value?.workareaHandler.setZoomAuto(4);
      },
    },
    {
      type: "size",
      title: "200%",
      value: 2,
      status: () => {
        handler.value?.workareaHandler.setZoomAuto(2);
      },
    },
    {
      type: "size",
      title: "100%",
      value: 1,
      status: () => {
        handler.value?.workareaHandler.setZoomAuto(1);
      },
    },
    {
      type: "size",
      title: "50%",
      value: 0.5,
      status: () => {
        handler.value?.workareaHandler.setZoomAuto(0.5);
      },
    },
  ],
  [
    {
      type: "fullscreen",
      title: "适合满屏",
      status: () => {
        handler.value?.workareaHandler.one();
      },
    },
    {
      type: "fullscreen",
      title: "填满屏幕",
      status: () => {
        handler.value?.workareaHandler.one();
      },
    },
  ],
]);
function handlerEvent(item) {
  item.status();
}

function showMenu() {
  menuShow.value = !menuShow.value;
}

function getActive(menu) {
  if (menuShow.value) {
    const viewportTransform = handler.value?.canvas?.viewportTransform || [];
    const one = handler.value?.workareaHandler?.one();
    switch (menu.type) {
      case "showRule":
        return props.ruleShow;
      case "size":
        return menu.value == viewportTransform[0];
      case "fullscreen":
        return one == viewportTransform[0];
    }
  }
}
function getZoom() {
  if (canvas.value) {
    return parseInt(canvas.value.getZoom() * 100) + "%";
  }
  return "0%";
}
function setRandom() {
  random.value = Math.random() * 1000;
}
function onMinus() {
  handler.value?.workareaHandler.small();
}
function onBig() {
  handler.value?.workareaHandler.big();
}
onMounted(() => {
  window.addEventListener("resize", setRandom);
});
onUnmounted(() => {
  window.removeEventListener("resize", setRandom);
});
</script>
<style lang="scss" scoped>
.dc-layout-scale-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 52px;
  height: 32px;
  padding: 0 4px;
  overflow: hidden;
  color: #222529;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.08),
    0px 4px 12px 0px rgba(0, 0, 0, 0.04);
  -webkit-user-select: none;
  user-select: none;
  transition: all 0.2s;
  &:hover {
    width: 108px;
  }
  svg {
    box-sizing: content-box;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    border: 4px solid rgba(0, 0, 0, 0);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }
  .dc-layout-scale-bar__percent {
    display: inline-block;
    flex: none;
    width: 44px;
    font: 400 14px/1.5 "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB",
      "WenQuanYi Micro Hei", Arial, sans-serif, Apple Color Emoji,
      Segoe UI Emoji;
    text-align: center;
    border: 4px solid rgba(0, 0, 0, 0);
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #f6f7f9;
      border-color: #f6f7f9;
    }
  }
}
.content {
  min-width: 232px;
  padding: 4px;
  font-size: 13px;
  color: #222529;
  font-weight: 400;
  .dc-layout-scale-bar-item__menu__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      background-color: var(--background-color-primary-hover);
    }
    &.menu-active {
      font-weight: 600;
    }
    .dc-layout-scale-bar-item__menu__item--main {
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: space-between;
    }
  }
  hr {
    position: relative;
    left: -4px;
    width: calc(100% + 8px);
    height: 1px;
    margin: 4px 0;
    background-color: rgba(0, 0, 0, 0.08);
    border: none;
  }
  hr:last-child {
    display: none;
  }
}
</style>
