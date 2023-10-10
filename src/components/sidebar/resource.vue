<template>
  <div
    class="resource-station__panel page-scrollbar_container"
    v-if="activeModule"
  >
    <div class="add" v-if="activeModule.type == 'add'">
      <div class="addList" v-for="(list, index) in addData" :key="index">
        <div class="header">
          <div class="title">{{ list.title }}</div>
        </div>
        <div class="container">
          <div class="list">
            <div class="content">
              <div
                class="addItem"
                v-for="(item, vindex) in list.list"
                :key="vindex"
              >
                <img :src="item.icon" alt="" />
                <div class="name" v-if="item.title">{{ item.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="material" v-if="activeModule.type == 'material'">
      <div class="nav-container">
        <div class="navlist">
          <div
            class="navItem"
            @click="selectItem = null"
            :class="!selectItem ? 'navItemActive' : ''"
          >
            全部
          </div>
          <div
            class="navItem"
            v-for="item in materialList.slice(0, 4)"
            :class="
              selectItem && selectItem.title == item.title
                ? 'navItemActive'
                : ''
            "
            :key="item.id"
            @click="onChange(item)"
          >
            {{ item.title }}
          </div>
          <el-dropdown
            @command="onChange"
            v-if="materialList.length > 4"
            class="navItem"
            popper-class="navItem"
            trigger="click"
            :teleported="false"
          >
            <span class="el-dropdown-link">
              更多
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :command="item"
                  v-for="item in materialList.slice(4)"
                  :key="item.id"
                  >{{ item.title }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="material-container">
        <div class="container page-scrollbar_container">
          <div class="panel-block" v-for="item in materialList" :key="item.id">
            <panel-block
              :title="item.title"
              subTitle="查看更多"
              @change="onChange(item)"
            />
            <div class="panel-content">
              <div class="panel-batch" v-if="item.interval">
                <div
                  class="material-detail"
                  v-for="i in getIndex(item.interval).slice(0, 8)"
                  :key="i"
                >
                  <el-image
                    :src="`${repoSrc}svg/${i}.svg`"
                    lazy
                    :draggable="true"
                    @dragstart="handleDragStart($event, item, i)"
                  ></el-image>
                </div>
              </div>
              <div class="panel-batch" v-else>
                <div
                  class="material-detail"
                  style="width: 60px; height: 60px"
                  v-for="(item, index) in icons.slice(0, 8)"
                  :key="index"
                >
                  <el-image
                    :src="item.url"
                    lazy
                    :draggable="true"
                    @dragstart="handleDragStart($event, item)"
                  ></el-image>
                </div>
              </div>
            </div>
          </div>
        </div>
        <transition name="anime">
          <div class="detail-list page-scrollbar_container" v-if="selectItem">
            <template v-if="selectItem.interval">
              <div
                class="detail-item"
                v-for="item in getIndex(selectItem.interval)"
                :key="item"
              >
                <el-image
                  style="width: 88px; height: 88px"
                  :src="`${repoSrc}svg/${item}.svg`"
                  :draggable="true"
                  @dragstart="handleDragStart($event, item)"
                  lazy
                ></el-image>
              </div>
            </template>
            <template v-else>
              <div
                class="detail-item"
                v-for="(item, index) in icons"
                :key="index"
              >
                <el-image
                  style="width: 88px; height: 88px"
                  :src="item.url"
                  :draggable="true"
                  @dragstart="handleDragStart($event, item)"
                  lazy
                ></el-image>
              </div>
            </template>
          </div>
        </transition>
      </div>
    </div>
    <div class="Image" v-if="activeModule.type == 'Image'">
      <Waterifall :list="imageList" :column="2">
        <template v-slot="{ item }">
          <el-image
            :src="item.url"
            loading="lazy"
            lazy
            @dragstart="handleDragStart($event, item)"
          >
            <template #placeholder>
              <div class="image-slot"></div>
            </template>
          </el-image>
        </template>
      </Waterifall>
    </div>
  </div>
</template>
<script setup>
import { computed, shallowRef, ref } from "vue";
import { useStore } from "vuex";
import { addTab } from "@/constants/addtab";
import material from "@/constants/material";
import { ArrowDown } from "@element-plus/icons-vue";
import PanelBlock from "@/common/panel-block.vue";
import Waterifall from "@/common/waterfall.vue";
import {
  ElImage,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
} from "element-plus";
const { state } = useStore();
const repoSrc = ref("https://haixin-fang.github.io/vue-design-editor-static/");
const selectItem = ref();
const activeModule = computed(() => {
  return state.activeModule;
});

const imageList = computed(() => {
  if (state.imageList) {
    state.imageList.forEach((item) => {
      item.url = repoSrc.value + "image/" + item.url;
    });
    return state.imageList;
  }
  return [];
});

const icons = computed(() => {
  return state.icons;
});

const addData = shallowRef(addTab);
const materialList = shallowRef(
  material.map((item, index) => ({ ...item, id: index }))
);
function onChange(item) {
  selectItem.value = item;
}

const getIndex = ([start, end]) => {
  const arr = Array(end - (start - 1)).fill("");
  return arr.map((item, i) => i + start);
};

function handleDragStart(e, item, i) {
  item.type = activeModule.value.type;
  if (item.interval) {
    item.url = `${repoSrc.value}svg/${i}.svg`;
  }
  e.dataTransfer.setData("item", JSON.stringify(item));
}
</script>
<style lang="scss" scoped>
.anime-enter-from,
.anime-leave-to {
  left: 100% !important;
}
.anime-enter-to,
.anime-leave-from {
  left: 0 !important;
}
.anime-enter-active {
  transition: left 0.3s cubic-bezier(0.08, 0.82, 0.17, 1);
}
.anime-leave-active {
  transition: left 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
}
.resource-station__panel {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  cursor: default;
  overflow: auto;
  background-color: #ffffff;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .add {
    display: flex;
    flex-direction: column;
    .addList {
      margin-bottom: 16px;
      &:first-child {
        margin-top: 8px;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 36px;
        padding: 0 16px;
        .title {
          display: flex;
          flex: 1;
          flex-grow: 1;
          align-items: center;
          width: 100%;
          height: 100%;
          font: var(--text-p1-bold);
          color: var(--text-color-primary);
        }
      }
      .container {
        margin: 4px 0 0;
        .list {
          display: flex;
          align-items: center;
          min-height: 40px;
          padding: 0 16px;
          .content {
            display: flex;
            flex-wrap: wrap;
            flex: 1;
            width: 100%;
            font: var(--text-p1-regular);
            color: var(--text-color-primary);
            justify-content: space-between;
            .addItem {
              margin-right: 8px;
              margin-bottom: 8px;
              position: relative;
              display: flex;
              width: 88px;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font: var(--text-p2-regular);
              line-height: 18px;
              color: var(--text-color-secondary);
              text-align: center;
              background-color: var(--background-color-tertiary-regular);
              border-radius: var(--border-radius-large);
              cursor: pointer;
              -webkit-user-select: none;
              user-select: none;
              padding: 15px 22px;
              &:nth-child(3n + 3) {
                margin-right: 0;
              }
              .name {
                margin-top: 6px;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }
  .material {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    .nav-container {
      padding: 16px;
      .navlist {
        display: flex;
        flex-wrap: wrap;
        .navItem {
          color: var(--actionbutton-color-regular);
          background-color: #f1f2f4;
          border-color: rgba(0, 0, 0, 0);
          font-weight: 400;
          height: 32px;
          padding: 0 12px;
          font-size: 14px;
          border-radius: var(--border-radius-medium);
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          text-align: center;
          background-image: none;
          border-color: transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          touch-action: manipulation;
          vertical-align: middle;
          margin-bottom: 4px;
          margin-left: 4px;
          &.navItemActive {
            background-color: #2254f4;
            color: white;
          }
          &:not(.navItemActive):hover {
            color: #222529;
            background-color: #e8eaec;
            border-color: rgba(0, 0, 0, 0);
          }
          .el-icon {
            margin-left: 0;
          }
        }
      }
    }
    .material-container {
      flex: 1;
      width: 100%;
      position: relative;
      overflow: hidden;
      &.disabled-scroll {
        overflow: hidden;
      }
      .container {
        overflow: auto;
        height: 100%;
        width: 100%;
      }

      .detail-list {
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        align-self: center;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        background: white;
        justify-content: space-around;
        padding: 0 16px;
        align-content: flex-start;
        .detail-item {
          background: rgb(241, 242, 244);
          transition: all 0.1s ease-in;
          margin-bottom: 8px;
          &:hover {
            background-color: rgb(232, 234, 236);
          }
        }
      }
      .panel-content {
        display: flex;
        flex: 1;
        flex-grow: 1;
        align-items: center;
        width: 100%;
        font: var(--text-p1-regular);
        color: var(--text-color-primary);
        min-height: 40px;
        padding: 0 16px;
        margin: 8px 0 16px;
        .panel-batch {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding: 4px;
          background: #f1f2f4;
          border-radius: var(--border-radius-large);
        }
        .material-detail {
          margin: 4px;
          border-radius: 8px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(241, 242, 244);
          transition: all 0.1s ease-in;
          img {
            width: 100%;
            height: 100%;
          }
          &:hover {
            background-color: rgb(232, 234, 236);
          }
        }
      }
    }
  }
}
::v-deep img[draggable="true"] {
  cursor: pointer;
}
.Image {
  padding: 5px;
  .el-image {
    width: 100%;
    min-height: 100px;
  }
  .image-slot {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // width: 100%;
    // height: 100%;
    // background: #f5f7fa;
    // color: #a8abb2;
    // font-size: 14px;
    position: absolute;
    top: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: dui-skeleton-loading 1.4s ease infinite;
  }
  @keyframes dui-skeleton-loading {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .dot {
    animation: dot 2s infinite steps(3, start);
    overflow: hidden;
  }
}
</style>
