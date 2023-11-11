<template>
  <div class="opacity">
    <Slider
      :onChange="onChange"
      typeKey="opacity"
      lw="40%"
      :precentage="true"
      :min="0"
      :max="100"
      :step="1"
    >
      <template #left>
        <span>不透明度</span>
      </template>
      <template #right>
        <!-- <span>{{ parseInt(scope.data * 100) }}%</span> -->
        <InputNumber
          type="opacity"
          :prefix="false"
          :endfix="false"
          :initValue="{
            opacity: parseInt(
              Number(selectedItem && selectedItem.opacity) * 100
            ),
          }"
          @change="onInputChange"
        >
          <!-- <template #endfix>%</template> -->
        </InputNumber>
      </template>
    </Slider>
  </div>
</template>
<script>
import Slider from "./slider.vue";
import InputNumber from "./data-input.vue";
import { mapState } from "vuex";
export default {
  components: {
    Slider,
    InputNumber,
  },
  props: {
    onChange: {
      type: Function,
    },
  },
  computed: {
    ...mapState({
      selectedItem: (state) => state.selectedItem,
    }),
  },
  methods: {
    onInputChange(value) {
      value.opacity = Number(value.opacity) / 100;
      this.onChange(this.selectedItem, value);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .data-input {
  background: white;
  &:hover {
    border-color: white;
    background: rgba(0, 0, 0, 0.04);
  }
}
.opacity ::v-deep .el-slider__bar {
  background-color: #d9dcdf !important;
}
</style>
