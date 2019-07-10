<script>
import ChildCom from './ChildCom'
export default {
  name: 'RenderMode',
  props: {

  },
  render (h) {
    return h('ChildCom', {
      props: {
        msg: 'template'
      },
      scopedSlots: {
        default (props) {
          return h('span', `${props.text}`)
        }
      }
    })
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
