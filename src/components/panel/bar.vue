<template>
  <div class="bar">
    <div class="func-content" v-show="getBarShow('layer')">
      <el-tooltip
        class="item"
        effect="dark"
        content="图层顺序"
        placement="top"
        :disabled="islocked"
      >
        <i class="iconfont icon-cengji" @click.stop="onLayerShow"></i>
      </el-tooltip>
    </div>
    <div class="func-content" v-show="getBarShow('flip')">
      <el-tooltip
        class="item"
        effect="dark"
        content="翻转"
        placement="top"
        :disabled="islocked"
      >
        <i class="iconfont icon-zuoyoufanzhuan" @click.stop="handleFlip"></i>
      </el-tooltip>
    </div>
    <div class="func-content" v-show="getBarShow('locked')">
      <Checkbox
        :className="'iconfont icon-unlock'"
        :activeName="'icon-suoding_huaban'"
        content="锁定图层"
        :initValue="{ locked: false }"
        typeKey="locked"
        effect="dark"
        placement="top"
        @change="myCheck"
      />
    </div>
    <div class="func-content" v-show="getBarShow('copy')">
      <el-tooltip
        class="item"
        effect="dark"
        content="创建副本"
        placement="top"
        :disabled="islocked"
      >
        <i class="iconfont icon-fuzhi" @click="copy"></i>
      </el-tooltip>
    </div>
    <div class="func-content" v-show="getBarShow('delete')">
      <el-tooltip
        class="item"
        effect="dark"
        content="删除"
        placement="top"
        :disabled="islocked"
      >
        <i
          class="iconfont icon-delete"
          @click="handleDelete"
          :class="islocked ? 'icon_noactive' : ''"
        ></i>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import Checkbox from "./checkbox.vue";
export default {
  components: {
    Checkbox,
  },
  props: {
    onChange: {
      type: Function,
      default: () => {},
    },
    canvasRef: {
      type: Object,
      default: {},
    },
    barShow: {
      type: Array,
      default: () => ["locked", "layer", "flip", "copy", "delete"],
    },
    poi: {
      type: String,
      default: "bottom",
    },
  },

  computed: {
    islocked() {
      return false;
    },
  },
  methods: {
    myCheck() {},
    getBarShow(type) {
      return this.barShow.includes(type);
    },
    copy() {},
    handleDelete() {},
  },
};
</script>
<style lang="scss" scoped>
.bar {
  position: relative;
  text-align: left;
  display: inline-flex;
  align-items: center;

  .icon_noactive {
    ::v-deep .switch {
      color: #bec3c9;
      cursor: not-allowed;
      font-size: 20px;
    }
  }
  .func-content {
    color: #000;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    // padding: 0 12px;
    line-height: 40px;
    display: inline-flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    font-size: var(--font-size-medium);
    border-radius: var(--border-radius-medium);
    cursor: pointer;
    &:first-child {
      margin-left: -4px;
    }
    .icon_noactive {
      color: #bec3c9;
      cursor: not-allowed;
    }
    > i,
    > div {
      width: 100%;
      // font-size: 20px;
      display: flex;
      justify-content: center;
    }
    &:hover {
      color: #222529;
      background: rgba(0, 0, 0, 0.04);
    }
  }
}
</style>
