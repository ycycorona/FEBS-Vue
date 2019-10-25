<script>
import { createArrayFromNum } from '@/utils/common'
import MultiInput from './MultiInput'
export default {
  name: 'MultiInputEnter',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    inputNum: {
      default: 1,
      type: Number
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
  render(createElement) {
    return createElement(
      MultiInput,
      {
        props: {
          inputNum: this.inputNum,
          value: this.value || createArrayFromNum(this.inputNum)
        },
        on: {

        }
      }
    )
  }
}
</script>
