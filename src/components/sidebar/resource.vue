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
  </div>
</template>
<script setup>
import { computed, shallowRef } from "vue";
import { useStore } from "vuex";
import { addTab } from "@/constants/addtab";
const { state } = useStore();
const activeModule = computed(() => {
  return state.activeModule;
});
const addData = shallowRef(addTab);
</script>
<style lang="scss" scoped>
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
}
</style>
