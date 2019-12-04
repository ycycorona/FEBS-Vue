<template>
  <a-form>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="电压上限(V)" v-bind="formItemLayout">
          <a-input-number
            :value="1"
          /> <span>(设置范围：85.0-305.0)</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="电压下限(V)" v-bind="formItemLayout">
          <a-input-number
            :value="1"
          /> <span>(设置范围：85.0-305.0)</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="电流上限(A)" v-bind="formItemLayout">
          <a-input-number
            :value="1"
          />(设置范围：0.000-16.000)
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import MultiInput from '@/components/input/MultiInput/MultiInput'
import { configSerialize, configDeserialize } from '@/utils/common'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'AlarmThreshold',
  components: { },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formItemLayout, formItemLayout_1, MultiInput
    }
  },
  computed: {

  },
  async created() {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
