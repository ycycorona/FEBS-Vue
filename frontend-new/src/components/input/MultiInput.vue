<template>
  <span>
    <a-input
      v-for="n in inputNum"
      :key="n"
      :default-value="localValue[n-1]"
      class="input-width"
      on-change="inputValueChange"
    />
  </span>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { createArrayFromNum } from '@/utils/common'
export default {
  name: 'MultiInput',
  components: { },
  props: {
    inputNum: {
      default: 1,
      type: Number
    },
    value: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      localValue: []
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    if (Array.isArray(this.value) && this.value.length === this.inputNum) {
      this.localValue = cloneDeep(this.value)
    } else {
      this.localValue = createArrayFromNum(this.inputNum)
    }
    this.localValue[0] = 2
  },
  methods: {
    inputValueChange() {

    }
  }
}
</script>

<style lang="less" scoped>
.input-width {
  width: 50px;
  margin-right: 5px;
}
</style>
