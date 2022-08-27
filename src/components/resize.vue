<template>
  <div class="resize">
    <el-form v-model="form">
      <el-form-item label="宽度(px)">
        <el-input-number
          v-model="form.width"
          controls-position="right"
          size="mini"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="高度(px)">
        <el-input-number
          v-model="form.height"
          controls-position="right"
          size="mini"
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
    <div class="customlist">
      <div class="item" v-for="(item, index) in preSize" :key="index">
        <el-button
          :type="index == activeIndex ? 'primary' : ''"
          @click="handleBtn(item)"
          >{{ item.name }}</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, ref } from 'vue'
export default defineComponent({
  setup(props, { emit }) {
    const form = reactive({
      width: 375,
      height: 800
    })
    const activeIndex = ref(-1)
    const morenResize = reactive({
      preSize: [
        {
          name: '普通专题头图 750x500px',
          width: 750,
          height: 750
        },
        {
          name: '朋友圈海报 750x1334px',
          width: 750,
          height: 1334
        },
        {
          name: '微信弹框 640x840px',
          width: 640,
          height: 840
        },
        {
          name: '微信banner 718x120px',
          width: 718,
          height: 120
        },
        {
          name: '列表页banner 750x80px',
          width: 750,
          height: 80
        }
      ]
    })
    return {
      form,
      activeIndex,
      handleChange() {
        activeIndex.value = -1
        emit('size', form)
      },
      handleBtn(item) {
        emit('size', item)
      },

      ...toRefs(morenResize)
    }
  }
})
</script>
<style lang="scss" scoped>
.customlist {
  display: flex;
  flex-direction: column;
  width: 100%;
  .item {
    width: 100%;
    margin-bottom: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
