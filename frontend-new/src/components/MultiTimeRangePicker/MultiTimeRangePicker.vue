<template>
  <a-row :gutter="24" style="margin:0 0;margin-bottom: 0!important">
    <a-col v-for="(item, index) in timeRanges" :key="index" :span="22">
      <a-form-item :label="index!==0?'':'时间'" :label-col="{ span: 5 }" :wrapper-col="{ span: 19, offset: index!==0?5:0}">
        <time-range-picker
          v-model="timeRanges[index]"
          :start-time-limit="index===0 ? undefined : timeRanges[index-1][1]"
          :disabled="index!==timeRanges.length-1 || disabled"
          @change="onTimeRangeChange"
        >
        </time-range-picker>
      </a-form-item>
    </a-col>
    <a-col v-if="timeRanges.length>1 && !disabled" :span="2" style="">
      <a-button
        type="danger"
        shape="circle"
        icon="delete"
        class="del-for-item"
        @click="removeFormItem"
      ></a-button>
    </a-col>
    <!-- <a-col :span="20">

    </a-col> -->
    <a-col v-if="isShowBtn && !disabled" :span="4" :offset="4" style="padding-left:22px;margin-bottom:14px;margin-top: -2px;">
      <a-button

        @click="addFormItem"
      >添加</a-button>
    </a-col>
  </a-row>
</template>
<script>
import TimeRangePicker from '@/components/timeRangePicker'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'MultiTimeRangePicker',
  components: { TimeRangePicker },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeRanges: []
    }
  },
  computed: {
    timeRangesLength() {
      return this.timeRanges.length
    },
    isShowBtn() {
      const l = this.timeRanges.length
      if (l === 0) { return false }
      let flag
      if (this.timeRanges[l - 1][1] !== '23:59') {
        flag = true
      } else {
        flag = false
      }
      return flag
    }
  },
  watch: {
    value(val) {
      this.setValue(val)
    }
  },
  created() {
    this.setValue(this.value)
  },
  methods: {
    setValue(val) {
      if (val && val.length !== 0) {
        this.timeRanges = cloneDeep(this.value)
      } else {
        this.timeRanges = [['00:01', '23:59']]
      }
    },
    onTimeRangeChange(val) {
      this.$emit('change', this.timeRanges)
    },
    removeFormItem() {
      this.timeRanges.splice(-1, 1)
    },
    addFormItem() {
      const l = this.timeRangesLength
      this.timeRanges.push([this.timeRanges[l - 1][1], '23:59'])
    }
  }
}
</script>

<style lang="less" scoped>

</style>
