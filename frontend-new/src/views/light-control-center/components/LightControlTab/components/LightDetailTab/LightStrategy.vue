<template>
  <a-form>
    <!-- <a-row :gutter="12">
      <a-col :span="6">
        <span class="col-title">配置项名称</span>
      </a-col>
      <a-col :span="6">
        <span class="col-title">配置项参数</span>
      </a-col>
      <a-col :span="6">
        <span class="col-title">配置项名称</span>
      </a-col>
      <a-col :span="6">
        <span class="col-title">配置项参数</span>
      </a-col>
    </a-row> -->
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="控制器时间" v-bind="formItemLayout">
          <span>123</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="经度" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="纬度" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="开灯时间" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="关灯时间" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路工作模式" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路工作模式" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路手动开灯功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路手动开灯功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="开灯延时" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="关灯延时" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路第一时段时间" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路第一时段时间" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路第二时段时间" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路第二时段时间" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路第三时段时间" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路第三时段时间" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路第一时段功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路第一时段功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路第二时段功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路第二时段功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路第三时段功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路第三时段功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路第四时段功率" v-bind="formItemLayout">
          <span></span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路第四时段功率" v-bind="formItemLayout">
          <span></span>
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
  name: 'LightStrategy',
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
.col-title {
  font-weight: 700
}
</style>
