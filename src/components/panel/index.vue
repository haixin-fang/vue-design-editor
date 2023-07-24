<template>
  <div class="editor-props-panel">
    <div class="tab-panel-header">
      <div class="tab-panel-block__header">
        <div
          v-for="panelItem in headtool"
          :key="panelItem.text"
          @click="selectTabs(panelItem)"
          v-show="getActiveTab(panelItem)"
        >
          <button class="tab-button">
            <div class="tab-content" :class="getActiveClass(panelItem)">
              {{ panelItem.text }}
            </div>
          </button>
        </div>
      </div>
      <div class="tab-panel-bloack_content">
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
                <div class="panel-row__content">900 × 3300 px</div>
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
                <div class="panel-row">
                  <div class="panel-row__content">
                    <button class="right-canvas-resize-btn">上传图片</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-block">
          <div class="panel-block__header">
            <div class="panel-block__header-title">背景图</div>
            <div class="panel-block__header-action">
              <div class="popup">
                <div class="swatch--shape-round"></div>
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
import { ref } from "vue";
import Bar from "./bar.vue";
import WorkspaceSize from "./workspace-size.vue";
export default {
  components: { Bar, WorkspaceSize },
  setup() {
    const headtool = ref(panel);
    const type = ref("design");
    const sizeShow = ref(false);
    return {
      headtool,
      sizeShow,
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
        margin-top: 8px;
        margin-top: 8px;
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
    justify-content: space-between;
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
</style>
