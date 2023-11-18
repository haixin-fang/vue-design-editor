<template>
  <div class="data-input">
    <div
      class="prefix"
      v-if="prefix"
      :class="disabled ? 'prefix_disabled' : ''"
    >
      <slot name="prefix"></slot>
    </div>
    <div class="input-number">
      <input
        :type="inputType"
        class="input-number-input"
        :placeholder="placeholder"
        :class="[
          prefix ? '' : 'input-number-input-nopadding',
          disabled ? 'input-disabled' : '',
        ]"
        v-model="newinitValue[type]"
        @input="$emit('change', newinitValue)"
        @change="$emit('end', newinitValue)"
        :disabled="disabled"
      />
      <slot name="inputprefix"></slot>
    </div>
    <div class="prefix endfix" v-if="endfix">
      <slot name="endfix"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    initValue: {
      type: Object,
      default: () => ({}),
    },
    prefix: {
      type: Boolean,
      default: true,
    },
    endfix: {
      type: Boolean,
      default: true,
    },
    inputType: {
      type: String,
      default: "number",
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    newinitValue() {
      return this.initValue;
    },
  },
};
</script>
<style lang="scss" scoped>
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}
:deep(input[type="number"]) {
  -moz-appearance: textfield;
}
.data-input {
  display: flex;
  background-color: #f5f6f8;
  height: 32px;
  line-height: 32px;
  padding: 0 3px;
  border: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-radius: 6px;
  box-sizing: border-box;
  &:hover {
    border-color: #2c63ff;
    border: 1px solid #2c63ff;
  }
  .prefix {
    align-items: center;
    background-color: transparent;
    display: flex;
    margin: 0 0 0 12px;
    width: 12px;
    height: 32px;
    // line-height: 32px;
    opacity: 1;
    pointer-events: none;
    transition: none;
    z-index: 2;
    &.endfix {
      margin-left: 3px;
    }
    &.prefix_disabled {
      color: #bec3c9;
    }
  }
  .input-number {
    flex: 1 1 0%;
    width: 100%;
    border: none;
    box-shadow: none;
    background-color: transparent;
    z-index: 2;
    .input-number-input {
      appearance: textfield !important;
      background-color: transparent;
      border: 0;
      border-radius: 2px;
      outline: 0;
      padding: 0 12px 0 6px;
      text-align: left;
      transition: all 0.3s linear;
      width: 100%;
      touch-action: manipulation;
      height: 32px;
      line-height: 32px;
      color: #232321;
      font-size: 12px;
      &.input-number-input-center {
        text-align: center !important;
      }
      &.input-number-input-nopadding {
        padding: 0;
        text-align: right;
        font-size: 13px;
      }
      &.input-disabled {
        cursor: not-allowed;
        color: #bec3c9;
      }
    }
  }
}
</style>
