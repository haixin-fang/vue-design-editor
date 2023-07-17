<template>
  <div class="main">
    <div class="editor-container">
      <div class="editor-shell-wrap">
        <div class="editor-shell"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main {
  position: relative;
  height: 100%;
  background: #f6f7f9;
  .editor-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    overflow: scroll;
    font: 14px/1.5 Arial, PingFangSC-Regular, STHeitiSC-Light, Helvetica Neue;
    color: #333;
    background: none;
    outline: none;
    cursor: image-set(url(https://cdn.dancf.com/fe-assets/img/c7ca2e9….svg) 2x, url(blob:https://www.gaoding.com/ced31cf5-7b1f-40e1-8555-987473b65174) 1x) 6 2, default;
    .editor-shell-wrap {
      height: 641px;
      width: 256.4px;
      padding: 24px 40px 130px;
      position: relative;
      box-sizing: content-box;
      margin: 0 auto;
      overflow: visible;
      .editor-shell {
        height: 641px;
        width: 256.4px;
        position: relative;
        margin: 0 auto;
        background: no-repeat 0 0;
        box-shadow: 1px 1px 15px #0000001a;
      }
    }
  }
}
</style>
