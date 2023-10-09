<template>
  <div :class="{ 'waterfall-wrap': true }" ref="container">
    <div v-for="(item, index) of list" :key="index" class="column-item">
      <slot :item="item"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
    column: {
      type: Number,
      default: 4,
    },
    height: {
      type: Number,
      default: 225,
    },
  },
  data() {
    return {
      itemWidth: 0,
      columnData: [],
    };
  },
  watch: {
    list() {
      this.renderList();
    },
  },
  mounted() {
    this.renderList();
    window.addEventListener("resize", this.renderList);
  },
  methods: {
    renderList() {
      // 横向排列使用css进行排列

      // 纵向排列使用绝对定位排列
      if (!this.row) {
        // 存储每列已排列的高度
        this.columnData = [];
        // 计算出每列应该占总宽度的百分比
        this.itemWidth = `${100 / this.column}%`;
        if (this.$refs.container) {
          this.$nextTick(() => {
            // 对所有盒子进行计算绝对定位的位置
            const boxes =
              this.$refs.container.getElementsByClassName("column-item");
            for (let i = 0; i < boxes.length; i++) {
              this.setElementStyle(boxes[i], this.list[i], i);
            }
          });
        }
      }
    },
    setElementStyle(element, img, index) {
      // 计算出图片实际在项目中显示的高
      const w = this.$refs.container.offsetWidth / this.column;
      const h = ((w - 6) / img.width) * img.height + 6;
      if (index < this.column) {
        element.style.left = `${index * (100 / this.column)}%`;
        this.columnData[index] = this.columnData[index]
          ? this.columnData[index] + h
          : h;
      } else {
        // 找出最小高度的列
        let min = {};
        for (let i = 0; i < this.columnData.length; i++) {
          if (!Object.prototype.hasOwnProperty.call(min, "index")) {
            min = { index: i, value: this.columnData[i] };
          } else {
            if (this.columnData[i] < min.value) {
              min = { index: i, value: this.columnData[i] };
            }
          }
        }
        element.style.left = `${min.index * (100 / this.column)}%`;
        element.style.top = `${min.value}px`;
        this.columnData[min.index] += h;
      }
      element.style.width = this.itemWidth;
    },
  },
};
</script>
<style lang="scss" scoped>
.waterfall-wrap {
  position: relative;
  .column-item {
    position: absolute;
    padding: 3px;
    font-size: 0;
    box-sizing: border-box;
    transition: all 0.3s ease;
    img {
      max-width: 100%;
    }
  }
}
</style>
