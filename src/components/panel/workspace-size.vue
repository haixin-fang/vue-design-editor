<template>
  <div class="workspace-size">
    <div class="size-header">
      <div class="header_back" @click="$emit('back')">
        <ArrowLeft style="width: 16px; height: 16px" />
        <span>调整尺寸</span>
      </div>

      <div class="header_toolbar">
        <div class="custom-size">
          <div class="input-number-group">
            <div class="input-number" type="number">
              <el-input v-model="width" />
            </div>
            <div class="input-number" type="number">
              <el-input v-model="height" />
            </div>
            <div class="input-number-group__suffix">
              <el-tooltip
                class="item"
                effect="dark"
                content="锁定宽高比"
                placement="top"
              >
                <button type="button">
                  <i class="iconfont icon-link-outline"></i>
                </button>
              </el-tooltip>
            </div>
          </div>
          <el-popover
            placement="bottom-start"
            popper-class="unit-menu"
            :width="200"
            :offset="2"
            trigger="hover"
            :show-arrow="false"
          >
            <template #reference>
              <button type="button" class="btn-px">
                <span class="dbu-resize-panel__unit-select__text">px</span
                ><el-icon :size="12"><ArrowUp /></el-icon>
                <!-- <el-icon><ArrowDown /></el-icon> -->
              </button>
            </template>
            <template #default>
              <div class="unit-menu-list">
                <div class="unit-menu-item">
                  <div class="unit-menu-item-select">
                    px&nbsp;&nbsp;(像素)
                    <el-icon style="width: 1em; height: 1em"
                      ><Select
                    /></el-icon>
                  </div>
                </div>
                <div class="unit-menu-item">
                  <div>cm&nbsp;&nbsp;(厘米)</div>
                </div>
                <div class="unit-menu-item">
                  <div>mm&nbsp;&nbsp;(毫米)</div>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="size-body">
      <div class="size-list">
        <div class="size-item size-item-select">
          <el-icon style="width: 1em; height: 1em"><Select /></el-icon>
          <div class="size-name">自定义尺寸</div>
        </div>
        <div class="size-item" v-for="(item, index) in sizeList" :key="index">
          <el-icon style="width: 1em; height: 1em" v-show="false"
            ><Select
          /></el-icon>
          <div class="size-name">{{ item.title }}</div>
          <div class="size-info">
            <span>{{ item.material.width }}</span
            ><span class="m03">×</span><span>{{ item.material.height }}</span
            ><span class="m03">{{ item.material.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { ArrowLeft, ArrowUp, ArrowDown, Select } from "@element-plus/icons-vue";
import { size } from "@/constants/size";
const sizeList = ref(size);
const width = ref();
const height = ref();
</script>
<style lang="scss">
.unit-menu {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.unit-menu-list {
  display: flex;
  flex-direction: column;
  padding: 4px;
  .unit-menu-item {
    min-height: var(--dropdown-height-loose);
    clear: both;
    padding: 10px 12px;
    color: var(--dropdown-color-regular);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-medium);
    line-height: 20px;
    white-space: nowrap;
    position: relative;
    cursor: pointer;
    cursor: pointer;
    border-radius: 8px;

    .unit-menu-item-select {
      font: var(--text-p1-bold);
      color: var(--dropdown-color-checked);
      .el-icon {
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
      }
    }
  }
}
.workspace-size {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 2;
  display: flex;
  flex-direction: column;

  .size-header {
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
        box-shadow: 0 0 0 1px #e8eaec inset;
        font: var(--text-p1-regular);
        color: var(--text-color-primary);
        .el-input {
          ::v-deep {
            .el-input__wrapper {
              box-shadow: none;
              .el-input__inner {
                color: inherit;
              }
            }
          }
        }
        .input-number {
          position: relative;
          width: 54px;
        }
        .input-number + .input-number {
          ::before {
            position: absolute;
            top: 50%;
            left: -12px;
            width: 1px;
            height: 16px;
            background-color: rgba(0, 0, 0, 0.08);
            content: "";
            transform: translateY(-50%);
          }
          margin-left: 20px;
        }
        .input-number-group__suffix {
          margin-left: 8px;
          button {
            width: 32px;
            height: 32px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--font-size-250);
            background: #e8eaec;
            border-radius: var(--border-radius-medium);
            outline: 0;
            border: none;
            &:active {
              outline: 0;
              border: none;
            }
          }
        }
      }
      .custom-size {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 12px 0 8px;
        padding: 0 16px;

        .btn-px {
          display: flex;
          flex: 0 0 54px;
          align-items: center;
          justify-content: center;
          height: 32px;
          padding: 0;
          margin-left: 4px;
          font: var(--text-p1-regular);
          border-radius: var(--border-radius-medium);
          color: var(--text-color-primary);
          background-color: var(--color-transparent-regular);
          border-color: transparent;
          outline: 0;
          border: none;
          span {
            display: inline-flex;
            pointer-events: none;
            line-height: 1;
            width: 24px;
            margin-right: 4px;
          }
          &:active {
            outline: 0;
            border: none;
          }
          &:hover {
            color: var(--text-color-primary);
            background-color: rgba(0, 0, 0, 0.04);
            border-color: transparent;
          }
        }
      }
    }
  }
  .size-body {
    flex: 1;
    position: relative;
    z-index: 1;
    overflow: auto;
    scrollbar-width: none;
    cursor: default;
    .size-list {
      padding: 12px 16px 6px;
      margin: 0;
      .size-item {
        position: relative;
        display: flex;
        align-items: center;
        height: 40px;
        padding-left: 30px;
        border-radius: var(--border-radius-large);
        cursor: pointer;
        &.size-item-select {
          background-color: #f0f6ff;
        }
        &:hover {
          background-color: #f6f7f9;
        }
        .el-icon {
          position: absolute;
          left: 4px;
        }
        .size-name {
          margin-right: 12px;
          overflow: hidden;
          font: var(--text-p1-regular);
          color: var(--text-color-primary);
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .size-info {
          font: var(--text-p2-regular);
          color: var(--text-color-disabled);
          .m02 {
            margin: 0 4px;
          }
        }
      }
    }
  }
}
</style>
