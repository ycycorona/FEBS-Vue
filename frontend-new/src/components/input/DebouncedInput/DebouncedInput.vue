<template>
  <a-input v-model="localValue" :disabled="disabled" @change="inputChange" />
</template>

<script>

import debounce from 'lodash/debounce'

export default {
  name: 'DebouncedInput',
  components: { },
  props: {
    value: {
      type: [String, Number]
    },
    disabled: {
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
    value(val) {
      if (this.localValue !== val) {
        this.localValue = val
      }
    }
  },
  created() {
    this.debouncedInputChange = debounce((value) => {
      this.$emit('change', value)
    }, 150)
  },
  methods: {
    inputChange(e) {
      // this.$emit('change', e.target.value)
      this.debouncedInputChange(e.target.value)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
