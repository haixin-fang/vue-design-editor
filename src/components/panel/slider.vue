<template>
  <div class="slider" :class="[selectedItem ? '' : 'slider-disable']">
    <div class="slider-icon" :style="{ width: lw }">
      <slot name="left"></slot>
    </div>
    <div class="slide" v-if="item">
      <el-slider
        :value="getValue(item[typeKey])"
        :size="size"
        :min="min"
        :max="max"
        @input="onInputChange"
        :step="step"
        height="6"
        @change="slideChange"
      ></el-slider>
    </div>
    <div class="slide" v-else>
      <el-slider
        v-model="slideValue"
        :size="size"
        :min="min"
        :max="max"
        @input="onInputChange"
        :step="step"
        @change="slideChange"
      ></el-slider>
    </div>
    <div class="slide-text">
      <slot name="right" :data="slideData"></slot>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { ElSlider } from "element-plus";
export default {
  components: { ElSlider },
  props: {
    onChange: {
      type: Function,
    },
    step: {
      type: Number,
      default: 0.01,
    },
    /** 自定义绑定的数据,默认是选择的元素*/
    item: {
      type: Object,
      default: null,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
    size: {
      type: String,
      default: "mini",
    },
    value: {
      type: Number,
      default: 1,
    },
    typeKey: {
      type: String,
      default: "",
    },
    lw: {
      type: String,
      default: "30%",
    },
    /** 二级key */
    twoKey: {
      type: String,
      default: "",
    },
    precentage: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      selectedItem: (state) => state.selectedItem,
    }),
    slideData() {
      if (this.selectedItem && this.selectedItem[this.typeKey]) {
        return Number(this.selectedItem[this.typeKey]).toFixed(2);
      }
      return 0;
    },
    slideValue() {
      return this.getValue(
        this.selectedItem && this.selectedItem[this.typeKey]
      );
    },
  },
  methods: {
    onInputChange(value) {
      if (this.precentage) {
        value = value / 100;
      }
      if (this.twoKey) {
        this.onChange(
          this.selectedItem,
          {
            [this.twoKey]: {
              [this.typeKey]: value,
            },
          },
          {
            start: true,
          }
        );
      } else {
        this.onChange(
          null,
          { [this.typeKey]: value },
          {
            start: true,
          }
        );
      }
    },
    slideChange(value) {
      if (this.precentage) {
        value = value / 100;
      }
      if (this.twoKey) {
        this.onChange(
          this.selectedItem,
          {
            [this.twoKey]: {
              [this.typeKey]: value,
            },
          },
          {
            end: true,
          }
        );
      } else {
        this.onChange(
          null,
          { [this.typeKey]: value },
          {
            end: true,
          }
        );
      }
    },
    getValue(value) {
      console.log("888", value);
      if (!value) return 0;
      if (this.precentage) {
        return value * 100;
      } else {
        return value;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.slider {
  height: 40px;
  color: #33383e;
  // background: #f6f7f9;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .slide {
    width: 60%;
    :deep(.el-slider) {
      //   .el-slider__runway {
      //     height: 3px;
      //   }
      //   .el-slider__bar {
      //     height: 3px;
      //   }
      .el-slider__button-wrapper {
        top: -16px;
      }
      .el-slider__button {
        height: 13px;
        width: 13px;
        box-sizing: border-box;
        background: #fff;
        border-color: #fff;
        box-shadow: 0 0 4px rgb(0 0 0 / 25%);
      }
    }
  }
  .slider-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 5px;
    // color: #85878c;
    font-size: 14px;
    text-align: left;
    width: 72px;
    white-space: nowrap;
  }
  .slide-text {
    width: 25%;
    display: flex;
    justify-content: flex-start;
    margin-left: 8px;
  }

  span {
    margin-left: 5px;
  }
}
.slider-disable {
  cursor: not-allowed;
  color: #bec3c9;
  &:hover {
    background: #f6f7f9;
  }
  .slide-text {
    :deep(.data-input) {
      .input-number .input-number-input {
        color: #bec3c9 !important;
      }
      border-color: #f6f7f9 !important;
    }
  }
}
</style>
