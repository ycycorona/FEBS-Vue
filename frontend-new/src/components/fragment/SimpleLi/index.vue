<script>
import SimpleLiContent from './SimpleLiContent'
export default {
  name: 'SimpleLi',
  functional: true,
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {

  },
  methods: {},
  render(h, c) {
    return [
      <SimpleLiContent title={c.props.title}>{c.slots().default}</SimpleLiContent>,
      <ADivider class='inline-divider'></ADivider>
    ]
  }
}
</script>

<style lang="less" scoped>

</style>
