<template>
  <el-tooltip
    class="item"
    :effect="effect"
    :content="content"
    :placement="placement"
  >
    <div class="common-checkbox">
      <input
        type="checkbox"
        :id="'toggle' + '_' + typeKey"
        v-model="newValue"
      />
      <label
        :for="'toggle' + '_' + typeKey"
        class="switch"
        :class="[
          className,
          newValue ? 'switch-active' : '',
          newValue ? activeName : '',
          disabled ? 'switch-disabeld' : '',
        ]"
      >
        <slot />
      </label>
    </div>
  </el-tooltip>
</template>
<script setup>
import { defineProps, computed, useAttrs } from "vue";
const { emit } = useAttrs();
const props = defineProps({
  className: {
    type: String,
    default: "",
  },
  initValue: {
    type: Object,
    default: () => ({}),
  },
  typeKey: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // 激活类
  activeName: {
    type: String,
    default: "",
  },
  effect: {
    type: String,
    default: "dark",
  },
  placement: {
    type: String,
    default: "bottom",
  },
});
const newValue = computed({
  get() {
    return props.initValue[props.typeKey];
  },
  set(value) {
    emit("change", value);
  },
});
</script>
<style lang="scss" scoped>
.common-checkbox {
  width: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
input {
  display: none;
}
.switch {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &.switch-active {
    color: #2354f4;
    ::v-deep svg {
      fill: #2354f4 !important;
      path {
        fill: #2354f4 !important;
      }
    }
  }
  &.switch-disabeld {
    color: #f6f7f9;
  }
}
.switch:after {
  content: "";
  position: absolute;
  top: vw(4);
  left: vw(4);
  transition: all 0.3s;
}
input[type="checkbox"]:checked + .switch:after {
  top: auto;
  left: auto;
  bottom: vw(4);
  right: vw(4);
}
input[type="checkbox"]:checked + .switch {
  background-color: var(--comLineColor);
}
</style>
