
<script>
export default {
  name: 'RenderChild',
  props: {
    msg: {
      type: String
    }
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {

  },
  render(h) {
    // return (<div>
    //   {this.$scopedSlots.default({
    //     text: this.msg
    //   })}
    // </div>)

    // 将参数映射到父组件对应的slot中
    return h('div', this.$scopedSlots.default({
      text: this.msg
    }))
  }
}
</script>

<style lang="less" scoped>

</style>
