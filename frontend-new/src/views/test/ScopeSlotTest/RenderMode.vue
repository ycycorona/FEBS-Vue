<script>
import ChildCom from './ChildCom'
export default {
  name: 'RenderMode',
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
    return h('ChildCom', {
      props: {
        msg: 'template'
      },
      scopedSlots: {
        default(props) {
          return h('span', `${props.text}`)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>

</style>
