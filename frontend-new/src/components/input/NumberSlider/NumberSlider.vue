<template>
  <a-row>
    <a-col :span="12">
      <a-slider :value="localValue" :min="min" :max="max" @change="sliderValueChange" />
    </a-col>
    <a-col :span="4">
      <a-input-number :value="localValue" :min="min" :max="max" style="marginLeft: 16px" @change="sliderValueChange" />
    </a-col>
  </a-row>
</template>

<script>

export default {
  name: 'NumberSlider',
  components: { },
  props: {
    min: {
      default: 0,
      type: Number
    },
    max: {
      type: Number,
      default: 1
    },
    value: {
      type: Number
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
    sliderValueChange(value) {
      this.$emit('change', value)
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
