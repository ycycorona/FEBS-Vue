
<script>
export default {
  name: 'SubTest',
  props: {

  },
  data() {
    return {
      msg: 'scope-slot'
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

    return h('div', this.$scopedSlots.default({
      text: this.msg
    }))
  }
}
</script>

<style lang="less" scoped>

</style>
