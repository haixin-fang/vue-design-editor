<template>
  <div class="workspace-size">
    <div class="header">
      <div class="header_back" @click="$emit('back')">
        <ArrowLeft style="width: 16px; height: 16px" />
        <span>调整尺寸</span>
      </div>

      <div class="header_toolbar">
        <div class="custom-size">
          <div class="input-number-group">
            <div class="dinput-number" type="number">
              <el-input v-model="input" />
            </div>
            <div class="dinput-number" type="number">
              <el-input v-model="input" />
            </div>
            <div class="dui-input-number-group__suffix">
              <button
                type="button"
                class="gda-btn gda-btn-action gda-btn-sm gda-btn-icon-only dbu-resize-panel__ratio-action"
              >
                <svg
                  role="img"
                  aria-label="link-unlink"
                  focusable="false"
                  data-icon="link-unlink"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="gd_design_icon gd_design_icon-link-unlink"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14 8.5H17C18.933 8.5 20.5 10.067 20.5 12C20.5 13.933 18.933 15.5 17 15.5H14V17L17 17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H14V8.5ZM10 8.5V7L7 7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H10V15.5H7C5.067 15.5 3.5 13.933 3.5 12C3.5 10.067 5.067 8.5 7 8.5L10 8.5Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <button type="button" class="btn-px">
            <span class="dbu-resize-panel__unit-select__text">px</span
            ><el-icon><ArrowUp /></el-icon>
            <el-icon><ArrowDown /></el-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ArrowLeft, ArrowUp, ArrowDown } from "@element-plus/icons-vue";
</script>
<style lang="scss" scoped>
.workspace-size {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 2;
  .header {
    .header_back {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e6e9ef;
      color: #232321;
      font-size: 14px;
      font-weight: 700;
      padding-left: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      svg {
        color: var(--text-color-icon-regular);
      }
      &:hover {
        svg {
          color: var(--text-color-icon-hover);
        }
      }
    }
    .header_toolbar {
      display: flex;
      flex: 1;
      flex-grow: 1;
      align-items: center;
      width: 100%;
      font: var(--text-p1-regular);
      color: var(--text-color-primary);
      .input-number-group {
        height: 40px;
        border-radius: var(--border-radius-large);
        position: relative;
        display: flex;
        align-items: center;
        padding: 4px 4px 4px 8px;
        background-color: var(--background-color-primary-regular);
        box-shadow: 0 0 0 1px var(--border-color-primary-regular) inset;
      }
      .custom-size {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 12px 0 8px;
        .btn-px {
        }
      }
    }
  }
}
</style>
