<template>
  <span>
    <a-input
      v-for="n in inputNum"
      :key="n"
      :value="localValue[n-1]"
      class="input-width"
      :read-only="readonly"
      @change="inputValueChange(arguments[0], n)"
    />
  </span>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'MultiInput',
  components: { },
  props: {
    inputNum: {
      required: true,
      type: Number
    },
    value: {
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const { value } = this.$props
    return {
      localValue: value
    }
  },
  computed: {

  },
  watch: {
    value(newVal) {
      this.localValue = newVal
    }
  },
  created() {
    // if (Array.isArray(this.value) && this.value.length !== 0) {

    // } else {
    //   this.value = createArrayFromNum(this.inputNum)
    // }
  },
  methods: {
    inputValueChange(e, n) {
      const valNum = Number(e.target.value)
      if (/^\d{1,3}$/.test(valNum)) {
        if (valNum && valNum > 255) {
          return
        } else if (valNum && valNum < 0) {
          return
        }
      } else {
        return
      }

      const _localValueCopy = cloneDeep(this.localValue)
      _localValueCopy[n - 1] = valNum
      this.$emit('change', _localValueCopy)
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
