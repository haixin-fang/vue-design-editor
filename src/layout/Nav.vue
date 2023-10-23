<template>
  <div class="header_nav">
    <div class="menu" ref="menu">
      <el-tooltip effect="dark" content="文件" placement="bottom">
        <div class="menu-btn">
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
      <popover></popover>
    </div>
    <div class="logo"></div>
    <div class="starfish-link">
      <a
        href="https://github.com/haixin-fang/vue-design-editor"
        target="_black"
      >
        <i class="iconfont icon-GitHub"></i
      ></a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Menu } from "@element-plus/icons-vue";
import { ElIcon, ElButton, ElTooltip } from "element-plus";
import { ref } from "vue";
const menu = ref();
</script>
<style lang="scss">
.header_nav {
  height: 60px;
  display: flex;
  align-items: center;
  // -webkit-box-shadow: 0 2px 10px rgb(70 160 252 / 60%);
  // box-shadow: 0 2px 10px rgb(70 160 252 / 60%);
  padding: 0 10px;
  position: relative;
  border-bottom: 1px solid #d8dee8;
  padding: 0 15px;
  .menu {
    .menu-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      font-size: 16px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.04);
      &:hover {
      }
      svg {
        width: 20px;
        height: 20px;
        font-size: 20px;
      }
    }
  }
  .logo {
    font-size: 20px;
    color: white;
    font-weight: bold;
    display: flex;
    span {
      font-size: 30px;
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
</style>
