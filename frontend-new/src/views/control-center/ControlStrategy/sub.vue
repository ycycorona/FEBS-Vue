
<script>
export default {
  name: 'subTest',
  props: {

  },
  render (h) {
    // return (<div>
    //   {this.$scopedSlots.default({
    //     text: this.msg
    //   })}
    // </div>)

    return h('div', this.$scopedSlots.default({
      text: this.msg
    }))
  },
  data () {
    return {
      msg: 'scope-slot'
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
