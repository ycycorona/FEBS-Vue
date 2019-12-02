<template>
  <a-form>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="MAC地址" v-bind="formItemLayout_1">
          <multi-input
            :value="[]"
            :input-num="8"
            :readonly="true"
          ></multi-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="校表码" v-bind="formItemLayout_1">
          <multi-input
            :value="[]"
            :input-num="12"
            :readonly="true"
          ></multi-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="扩展PANID" v-bind="formItemLayout_1">
          <multi-input
            :value="[]"
            :input-num="8"
            :readonly="true"
          ></multi-input>
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
  name: 'LightConfig',
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
