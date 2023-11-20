<template>
  <div class="editor-props-panel">
    <div class="tab-panel-header">
      <div class="tab-panel-block__header">
        <div
          v-for="panelItem in headtool"
          :key="panelItem.text"
          @click="selectTabs(panelItem)"
          v-show="onTabShow(panelItem)"
        >
          <button class="tab-button">
            <div class="tab-content" :class="getActiveClass(panelItem)">
              {{ panelItem.text }}
            </div>
          </button>
        </div>
      </div>
      <div class="tab-panel-bloack_content" v-if="selectedItem">
        <Bar />
      </div>
    </div>
    <div class="tab-panel">
      <div class="tab-scrollbar__container">
        <div class="panel-block">
          <div class="panel-block__header">
            <div class="panel-block__header-title">画布</div>
          </div>
          <div class="panel-block__content">
            <div class="gda-space-item">
              <div class="panel-row">
                <div class="panel-row__label">尺寸</div>
                <div class="panel-row__content" v-if="workspace">
                  {{ workspace.width }} × {{ workspace.height }} px
                </div>
              </div>
              <div class="gda-space-item">
                <div class="panel-row">
                  <div class="panel-row__content">
                    <button
                      class="right-canvas-resize-btn"
                      @click="sizeShow = true"
                    >
                      调整尺寸
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-block">
          <div class="panel-block__header">
            <div class="panel-block__header-title">背景图</div>
          </div>
          <div class="panel-block__content">
            <div class="gda-space-item">
              <div class="gda-space-item">
                <div class="panel-row" v-if="!bgObject">
                  <div class="panel-row__content">
                    <el-upload
                      :show-file-list="false"
                      :auto-upload="false"
                      :on-change="(e) => uploadImage(e, 'background')"
                    >
                      <button class="right-canvas-resize-btn">上传图片</button>
                    </el-upload>
                  </div>
                </div>
                <div class="panel-row panel-row-bg" v-else>
                  <div class="panel-row-image">
                    <img :src="bgObject.src" alt="" v-if="bgObject.src" />
                    <div class="panel-row__content" v-show="false">
                      <el-upload
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="(e) => uploadImage(e, 'background')"
                      >
                        <button class="right-canvas-resize-btn">
                          上传图片
                        </button>
                      </el-upload>
                    </div>
                    <div class="background-edit-control__tools">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="翻转"
                        placement="top"
                      >
                        <i
                          class="iconfont icon-zuoyoufanzhuan"
                          @click="onflip"
                        ></i>
                      </el-tooltip>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="分离图片"
                        placement="top"
                      >
                        <i
                          class="iconfont icon-zhaopian"
                          @click="bgToImage"
                        ></i>
                      </el-tooltip>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除"
                        placement="top"
                      >
                        <i class="iconfont icon-delete" @click="remove"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <Opactiy :onChange="onChange" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-block">
          <div class="panel-block__header">
            <div class="panel-block__header-title">背景色</div>
            <div class="panel-block__header-action">
              <div class="popup popover">
                <div
                  ref="colorRound"
                  class="swatch--shape-round"
                  :style="`${getBgColor()}`"
                  @click="colorShow = true"
                ></div>
                <popover
                  :dom="colorRound"
                  :show="colorShow"
                  placement="left"
                  @close="colorShow = false"
                >
                  <template v-slot="{ setSlotRef }">
                    <div class="content" :ref="(el) => setSlotRef(el)">
                      <Color @select="selectColor" />
                    </div>
                  </template>
                </popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="anime">
      <workspace-size v-if="sizeShow" @back="sizeShow = false" />
    </transition>
  </div>
</template>
<script>
import { panel } from "@/constants/panel";
import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
import Bar from "./bar.vue";
import WorkspaceSize from "./workspace-size.vue";
import Opactiy from "./opactiy.vue";
import { ElUpload, ElTooltip } from "element-plus";
// const Color = () => import("./color.vue");
import Color from "./color.vue";
export default {
  components: { Bar, WorkspaceSize, ElUpload, ElTooltip, Opactiy, Color },
  props: {
    onChange: {
      type: Function,
    },
  },
  setup(props) {
    const headtool = ref(panel);
    const type = ref("design");
    const sizeShow = ref(false);
    const colorShow = ref(false);
    const colorRound = ref();
    const { state } = useStore();
    const handler = inject("handler");
    const canvas = inject("canvas");
    const workspace = computed(() => {
      return state.workspace;
    });
    const selectedItem = computed(() => {
      return state.selectedItem;
    });
    const bgObject = computed(() => {
      if (selectedItem.value && selectedItem.value.type == "background") {
        return selectedItem.value;
      }
      return null;
    });
    function selectColor(value) {
      props.onChange(null, value);
    }
    return {
      headtool,
      sizeShow,
      workspace,
      selectColor,
      bgObject,
      colorRound,
      colorShow,
      selectedItem,
      getActiveClass(panelItem) {
        if (Array.isArray(panelItem.type)) {
          return panelItem.type.includes(type.value) ? "tabActive" : "";
        }
        return panelItem.type == type.value ? "tabActive" : "";
      },
      selectTabs(item) {
        type.value = item.type;
      },
      getActiveTab(panelItem) {
        return panelItem.type == type.value;
      },
      onTabShow(item) {
        if (item.showList) {
          if (selectedItem.value) {
            const { type } = selectedItem.value;
            if (item.showList.includes(type)) {
              return true;
            }
            return false;
          }
        } else {
          return true;
        }
      },
      async uploadImage(e, type = "Image") {
        if (e) {
          await handler.value.utils.fileUpload(e.raw, e.name, type);
        }
      },
      getBgColor() {
        if (!workspace.value) return;
        if (typeof workspace.value.fill == "string") {
          debugger;
          return `background: ${workspace.value.fill}`;
        } else if (workspace.value.backgroundColor) {
          return `background: ${workspace.value.backgroundColor}`;
        }
      },
      onflip() {
        props.onChange(bgObject.value, { scaleX: -1 });
        const zoom = canvas.value.getZoom();
        handler.value.workareaHandler.setZoomAuto(zoom);
      },
      bgToImage() {
        handler.value.workareaHandler.bgToImage();
      },
      remove() {
        handler.value.remove(bgObject.value);
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.editor-props-panel {
  position: relative;
  background-color: #fff;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .anime-enter-from,
  .anime-leave-to {
    left: 100%;
  }
  .anime-enter-to,
  .anime-leave-from {
    left: 0;
  }
  .anime-enter-active {
    transition: left 0.3s cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .anime-leave-active {
    transition: left 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  .tab-panel {
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .tab-scrollbar__container {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      overflow: auto;
      scrollbar-width: none;
      cursor: default;
      .panel-block {
        margin-bottom: 16px;
        &:after {
          display: block;
          width: auto;
          margin: 16px 16px 0;
          border-top: var(--border-width-small) solid rgba(0, 0, 0, 0.08);
          content: "";
        }
        .panel-block__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 36px;
          padding: 0 16px;
          & + .panel-block__content {
            margin-top: 4px;
          }
          .panel-block__header-title {
            display: flex;
            flex: 1;
            flex-grow: 1;
            align-items: center;
            width: 100%;
            height: 100%;
            font: var(--text-p1-bold);
            color: var(--text-color-primary);
          }
          .panel-block__header-action {
            display: flex;
            flex: 1;
            flex-grow: 1;
            align-items: center;
            justify-content: flex-end;
            height: 100%;
            font: var(--text-p2-regular);
            color: var(--text-color-secondary);
            .popup {
              display: inline-block;
              cursor: pointer;
              .swatch--shape-round {
                border-radius: 4px;
                width: 24px;
                height: 24px;
                background: linear-gradient(
                  0deg,
                  rgb(133, 234, 143) 0%,
                  rgb(240, 252, 105) 29%,
                  rgb(237, 251, 197) 67%,
                  rgb(215, 240, 132) 100%
                );
                --0e969546: 4px;
                --62d7e12a: #4c535c;
                --4bff1efa: rgba(0, 0, 0, 0.12);
                border: 1px solid rgba(0, 0, 0, 0.24);
              }
            }
          }
        }
        .panel-block__content {
          margin: 16px 0;
          display: flex;
          flex-direction: column;
          .gda-space-item {
            width: 100%;
            .panel-row {
              display: flex;
              align-items: center;
              min-height: 40px;
              padding: 0 16px;
              width: 100%;
              text-align: left;
              justify-content: space-between;
              &.panel-row-bg {
                flex-direction: column;
                .opacity {
                  margin-top: 8px;
                  width: 100%;
                }
              }
              .panel-row-image {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 120px;
                padding: 16px;
                background: #f1f2f4;
                width: 100%;
                position: relative;
                border-radius: var(--border-radius-large);
                .background-edit-control__tools {
                  position: absolute;
                  top: 8px;
                  right: 4px;
                  z-index: 1;
                  display: flex;
                  align-items: center;
                  i {
                    width: 24px;
                    height: 24px;
                    padding: 0;
                    font-size: 14px;
                    border-radius: var(--border-radius-small);
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 4px;
                  }
                }
                &:hover {
                  .panel-row__content {
                    display: block !important;
                    position: absolute;
                    bottom: 8px;
                    z-index: 1;
                    width: 60%;
                    padding: 0 8px;
                    animation: background-edit-control-fade-in 0.5s forwards;
                    .right-canvas-resize-btn {
                      background-color: white;
                      height: 30px;
                    }
                  }
                  &::before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.08);
                    border-radius: var(--border-radius-large);
                    content: "";
                    opacity: 0;
                    animation: background-edit-control-fade-in 0.5s forwards;
                  }
                }
                img {
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                  background-color: #b8b8b8;
                  border-radius: var(--border-radius-large);
                  background-image: linear-gradient(
                      45deg,
                      #ccc 25%,
                      transparent 0
                    ),
                    linear-gradient(45deg, transparent 75%, #ccc 0),
                    linear-gradient(45deg, #ccc 25%, transparent 0),
                    linear-gradient(45deg, transparent 75%, #ccc 0);
                  background-position: 0 0, 5px 5px, 5px 5px, 10px 10px;
                  background-size: 10px 10px;
                  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.08),
                    0px 4px 12px 0px rgba(0, 0, 0, 0.04);
                }
              }
              .panel-row__label {
                width: 80px;
                font: var(--text-p1-regular);
                color: var(--text-color-secondary);
              }
              .panel-row__content {
                display: flex;
                flex: 1;
                flex-grow: 1;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
                font: var(--text-p1-regular);
                color: var(--text-color-primary);
                > div {
                  width: 100%;
                  :deep(.el-upload) {
                    width: 100%;
                  }
                }
                .right-canvas-resize-btn {
                  color: #222529;
                  background-color: #f1f2f4;
                  border-color: rgba(0, 0, 0, 0);
                  font-weight: 400;
                  width: 100%;
                  height: 40px;
                  padding: 0 16px;
                  outline: 0;
                  font-size: 14px;
                  border-radius: var(--border-radius-large);
                  &:hover {
                    color: #222529;
                    background-color: #e8eaec;
                    border-color: rgba(0, 0, 0, 0);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .tab-panel-header {
    display: flex;
    box-sizing: border-box;
    padding: 8px 0;
    flex-direction: column;
    border-bottom: var(--border-width-small) solid rgba(0, 0, 0, 0.08);
    .tab-panel-bloack_content {
      display: flex;
      align-items: center;
      padding: 0 16px 0;
    }
  }
  .tab-panel-block__header {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    background: white;
    z-index: 2;
    align-items: center;
    // justify-content: space-between;
    height: 36px;
    padding: 0 16px;

    .tabActive {
      color: #33383e;
    }

    .tab-button {
      padding: 4.5px 0 6.5px;
      font-weight: 500;
      margin-right: 16px;
      font-size: 14px;
      line-height: 20px;
      position: relative;
      cursor: pointer;
      border: none;
      outline: none;
      user-select: none;
      color: #9da3ac;
      background-color: #fff;
      .tab-content {
        position: relative;
        white-space: nowrap;
        font: var(--text-p1-bold);
      }
    }
  }
}

@keyframes background-edit-control-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
