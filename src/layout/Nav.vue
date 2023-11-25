<template>
  <div class="header_nav">
    <div class="menu popover" ref="menu">
      <el-tooltip
        effect="dark"
        content="文件"
        placement="bottom"
        :disabled="menuShow"
      >
        <div class="menu-btn" @click="onMenu">
          <svg viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 6.75L20 6.75V5.25H4V6.75ZM20 12.75H4V11.25H20V12.75ZM20 18.75H4V17.25H20V18.75Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </el-tooltip>
      <!-- <div class="logo">vue-design-editor</div> -->
    </div>
    <div class="starfish-link">
      <a
        href="https://github.com/haixin-fang/vue-design-editor"
        target="_black"
      >
        <i class="iconfont icon-GitHub"></i
      ></a>
    </div>
    <popover :dom="menu" :show="guideShow" @close="guideShow = false">
      <template v-slot="{ setSlotRef }">
        <div :ref="(el) => setSlotRef(el)">
          <upload-file @close="guideShow = false" @render="onRender" />
        </div>
      </template>
    </popover>
    <popover :dom="menu" :show="menuShow" @close="menuShow = false">
      <template v-slot="{ setSlotRef }">
        <div class="content" :ref="(el) => setSlotRef(el)">
          <template v-for="(menu, index) in menus" :key="index">
            <template v-for="item in menu" :key="item.type">
              <div
                class="dc-layout-scale-bar-item__menu__item"
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
import { Menu } from "@element-plus/icons-vue";
import { ElIcon, ElButton, ElTooltip } from "element-plus";
import { ref, inject } from "vue";
import UploadFile from "@/common/upload-file.vue";
const canvas = inject("canvas");
const handler = inject("handler");
const menu = ref();
const menuShow = ref(false);
const guideShow = ref(false);
const a = [
  {
    type: "rect",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: 0,
    top: 0,
    width: 260,
    height: 641,
    fill: "#fff",
    stroke: null,
    strokeWidth: 1,
    strokeDashArray: null,
    strokeLineCap: "butt",
    strokeDashOffset: 0,
    strokeLineJoin: "miter",
    strokeUniform: false,
    strokeMiterLimit: 4,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    flipX: false,
    flipY: false,
    opacity: 1,
    shadow: null,
    visible: true,
    backgroundColor: "",
    fillRule: "nonzero",
    paintFirst: "fill",
    globalCompositeOperation: "source-over",
    skewX: 0,
    skewY: 0,
    rx: 0,
    ry: 0,
    id: "workarea",
    name: "",
  },
  {
    type: "group",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: 30.4755,
    top: 231.5064,
    width: 220,
    height: 64.16,
    fill: "rgb(0,0,0)",
    stroke: null,
    strokeWidth: 0,
    strokeDashArray: null,
    strokeLineCap: "butt",
    strokeDashOffset: 0,
    strokeLineJoin: "miter",
    strokeUniform: true,
    strokeMiterLimit: 4,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    flipX: false,
    flipY: false,
    opacity: 1,
    shadow: null,
    visible: true,
    backgroundColor: "",
    fillRule: "nonzero",
    paintFirst: "fill",
    globalCompositeOperation: "source-over",
    skewX: 0,
    skewY: 0,
    id: "81bb3c84-e7cd-4c6b-86a7-33071d093d9e",
    name: "New group",
    objects: [
      {
        type: "FontCustom",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: -110,
        top: -32.08,
        width: 192,
        height: 36.16,
        fill: "rgb(0,0,0)",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: true,
        strokeMiterLimit: 4,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        fontFamily: "Times New Roman",
        fontWeight: "normal",
        fontSize: 32,
        text: "文字点击输入",
        underline: false,
        overline: false,
        linethrough: false,
        textAlign: "left",
        fontStyle: "normal",
        lineHeight: 1.16,
        textBackgroundColor: "",
        charSpacing: 0,
        styles: [],
        direction: "ltr",
        path: null,
        pathStartOffset: 0,
        pathSide: "left",
        pathAlign: "baseline",
        minWidth: 20,
        splitByGrapheme: false,
        id: "20abaac2-9fb2-40c2-8841-a015f01e576c",
        name: "自定义字体",
      },
      {
        type: "FontCustom",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: -83,
        top: -5.08,
        width: 192,
        height: 36.16,
        fill: "rgb(0,0,0)",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: true,
        strokeMiterLimit: 4,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        fontFamily: "Times New Roman",
        fontWeight: "normal",
        fontSize: 32,
        text: "文字点击输入",
        underline: false,
        overline: false,
        linethrough: false,
        textAlign: "left",
        fontStyle: "normal",
        lineHeight: 1.16,
        textBackgroundColor: "",
        charSpacing: 0,
        styles: [],
        direction: "ltr",
        path: null,
        pathStartOffset: 0,
        pathSide: "left",
        pathAlign: "baseline",
        minWidth: 20,
        splitByGrapheme: false,
        id: "1727e10d-9ae5-4f28-aeec-db5e6eeb8914",
        name: "自定义字体",
      },
    ],
  },
];
const menus = ref([
  [
    {
      type: "guide",
      title: "导入文件",
      status: () => {
        guideShow.value = true;
        menuShow.value = false;
      },
    },
  ],
  [
    {
      type: "json",
      title: "json打印",
      status: () => {
        console.log(JSON.stringify(handler.value.exportJSON()));
      },
    },
    {
      type: "exportImage",
      title: "导出图片",
      status: () => {
        const base64 = handler.value.exportImage();
        handler.value.utils.download(base64);
      },
    },
    {
      type: "exportJSON",
      title: "文件上传",
      status: () => {
        handler.value.importJSON(a);
      },
    },
  ],
]);
function onMenu() {
  menuShow.value = true;
}
function handlerEvent(item) {
  if (item.type == "guide") {
    guideShow.value = true;
  } else {
    item.status();
  }
  menuShow.value = false;
}

function onRender(data) {
  guideShow.value = false;
  handler.value.importJSON(data.json);
}
</script>
<style lang="scss">
.header_nav {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // -webkit-box-shadow: 0 2px 10px rgb(70 160 252 / 60%);
  // box-shadow: 0 2px 10px rgb(70 160 252 / 60%);
  padding: 0 10px;
  position: relative;
  border-bottom: 1px solid #d8dee8;
  padding: 0 15px;
  .menu {
    display: flex;
    align-items: center;
    .menu-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      font-size: 16px;
      border-radius: 8px;
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      svg {
        width: 20px;
        height: 20px;
        font-size: 20px;
      }
    }
    .logo {
      font-size: 20px;
      // color: white;
      font-weight: bold;
      display: inline-flex;
      span {
        font-size: 30px;
      }
    }
  }

  .starfish-link {
    a {
      color: black;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      margin-left: 15px;
      background: transparent;
      i {
        font-size: 30px;
      }
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
