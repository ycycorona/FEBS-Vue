<template>
  <a-form>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="项目名称" v-bind="formItemLayout">
          <span>123</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="编组名称" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="智能灯编号" v-bind="formItemLayout">
          <span>{{ detailData.projectName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="外壳编号" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="智能灯编号" v-bind="formItemLayout">
          <span>{{ detailData.projectName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="外壳编号" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="开关状态" v-bind="formItemLayout">
          <span>{{ detailData.projectName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="日能耗（kWh）" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="实时电流(A)" v-bind="formItemLayout">
          <span>{{ detailData.projectName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="实时电压(V)" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="日出时间" v-bind="formItemLayout">
          <span>{{ detailData.projectName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="日落时间" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路调光信号" v-bind="formItemLayout">
          <span>{{ detailData.projectName }}</span>
        </a-form-item>I
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路调光信号" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I路点亮时间" v-bind="formItemLayout">
          <span>{{ detailData.projectName }}</span>
        </a-form-item>I
      </a-col>
      <a-col :span="12">
        <a-form-item label="II路点亮时间" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="功率因数" v-bind="formItemLayout">
          <span>{{ detailData.projectName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="频率值" v-bind="formItemLayout">
          <span>{{ detailData.groupName }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'RealTimeStatus',
  components: { },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formItemLayout, formItemLayout_1
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
