<template>
  <span>
    <span class="padding-right">经度</span>
    <a-input
      :read-only="readonly"
      class="input-width margin-right"
      :value="localValue[0]"
      @change="inputChange(0, arguments[0])"
    />
    <span class="padding-right">纬度</span>
    <a-input
      :read-only="readonly"
      class="input-width"
      :value="localValue[1]"
      @change="inputChange(1, arguments[0])"
    />
  </span>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'PositionInput',
  components: { },
  props: {
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

  },
  methods: {
    inputChange(tag, e) {
      const clonedVal = cloneDeep(this.localValue)
      clonedVal[tag] = e.target.value
      this.$emit('change', clonedVal)
    }

  }
}
</script>

<style lang="less" scoped>
.input-width {
  width: 200px
}
.margin-right {
  margin-right: 5px
}
</style>
