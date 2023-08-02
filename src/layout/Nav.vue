<template>
  <div class="header_nav">
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
