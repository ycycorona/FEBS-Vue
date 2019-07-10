<script>
import ChildCom from './ChildCom'
export default {
  name: 'JsxMode',
  props: {

  },
  render (h) {
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
        msg="template"
        scopedSlots={scopedSlots}
      ></ChildCom>
    )
  },
  components: {ChildCom},
  data () {
    return {
      activeKey: null
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    callback (key) {
      console.log(key)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
