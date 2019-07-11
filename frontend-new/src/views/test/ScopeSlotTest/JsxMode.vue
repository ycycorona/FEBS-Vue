<script>
import ChildCom from './ChildCom'
export default {
  name: 'JsxMode',
  components: { ChildCom },
  props: {

  },
  data() {
    return {
      activeKey: null
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    callback(key) {
      console.log(key)
    }
  },
  render(h) {
    // return h('ChildCom', {
    //   props: {
    //     msg: 'template'
    //   },
    //   scopedSlots: {
    //     default (props) {
    //       return h('span', `${props.text}`)
    //     }
    //   }
    // })
    const scopedSlots = {
      default: (props) => <span>{props.text}</span>
    }
    return (
      <ChildCom
        msg='template'
        scopedSlots={scopedSlots}
      ></ChildCom>
    )
  }
}
</script>

<style lang="less" scoped>

</style>
