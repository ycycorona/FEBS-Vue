<template>
  <a-drawer
    destroy-on-close
    class="create-control-strategy-pop"
    title="新增管控策略"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="createControlStrategyPopVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <tab-title title="策略生效条件"></tab-title>
    <a-form :form="formCondition">
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="策略名称" v-bind="formItemLayout">
            <a-input
              v-decorator="['strategyName',
                            {rules: [
                              { required: true, message: '策略名称不能为空'},
                              { max: 20, message: '长度不能超过20个字符'}
                            ]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="日期" v-bind="formItemLayout">
            <a-range-picker
              v-decorator="['dateRange',
                            {rules: [
                              { required: !dateRangeDisable, type: 'array', message: '日期不能为空'}
                            ]}]"
              :disabled="dateRangeDisable"
            >
            </a-range-picker>

          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="长期：" :wrapper-col="{ span: 12 }" :label-col="{ span: 12 }">
            <a-switch v-decorator="['isLongTerm']" @change="isLongTermChange" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="管控区域" v-bind="formItemLayout">
            <a-select v-decorator="['controlArea']" placeholder="根据策略需要是否填写本条件">
              <a-select-option value="电子围栏1">电子围栏1</a-select-option>
              <a-select-option value="电子围栏2">电子围栏2</a-select-option>
              <a-select-option value="电子围栏3">电子围栏3</a-select-option>
              <a-select-option value="电子围栏4">电子围栏4</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <tab-title title="策略内容"></tab-title>
    <a-form :form="formContent">
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="指令类型" v-bind="formItemLayout">
            <a-select
              v-decorator="['directiveTypes',
                            {rules: [
                              { required: true, type: 'array', message: '指令不能为空'}
                            ]}]"
              placeholder="请选择指令类型"
              mode="multiple"
              @change="onDirectiveTypesChange"
            >
              <a-select-option value="应用黑名单">应用黑名单</a-select-option>
              <a-select-option value="电子围栏">电子围栏</a-select-option>
              <a-select-option value="禁用摄像头">禁用摄像头</a-select-option>
              <a-select-option value="图片提取">图片提取</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item v-if="isGeoFenceSelector" label="电子围栏" v-bind="formItemLayout">
            <a-select
              v-decorator="['geoFenceConfig',{rules: [
                { required: true, type: 'array', message: '电子围栏不能为空'}
              ]}]"
              placeholder="点击选择电子围栏"
            >
              <a-select-option value="电子围栏1">电子围栏1</a-select-option>
              <a-select-option value="电子围栏2">电子围栏2</a-select-option>
              <a-select-option value="电子围栏3">电子围栏3</a-select-option>
              <a-select-option value="电子围栏4">电子围栏4</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item v-if="isExtractImgs" label="图片提取配置" v-bind="formItemLayout">
            <a-select
              v-decorator="['geoFenceConfig', {rules: [
                { required: true, type: 'array', message: '指令不能为空'}
              ]}]"
              placeholder="点击选择电子围栏"
            >
              <a-select-option value="电子围栏1">电子围栏1</a-select-option>
              <a-select-option value="电子围栏2">电子围栏2</a-select-option>
              <a-select-option value="电子围栏3">电子围栏3</a-select-option>
              <a-select-option value="电子围栏4">电子围栏4</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
        <a-button :loading="loading" style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import TabTitle from '@/components/fragment/TabTitle'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
// const formTailLayout = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 8, offset: 4 }
// }
export default {
  name: 'CreateControlStrategyPop',
  components: { TabTitle },
  props: {
    createControlStrategyPopVisiable: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      moment,
      loading: false,
      formCondition: this.$form.createForm(this),
      formContent: this.$form.createForm(this),
      mForm: { isLongTerm: false },
      formItemLayout,
      dateRangeDisable: false,
      isGeoFenceSelector: false,
      isExtractImgs: false
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    async handleSubmit() {
      let validateFlag = true
      this.formCondition.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
        console.log(fieldsValue)
      })
      this.formContent.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
        console.log(fieldsValue)
      })
      if (!validateFlag) { return }

      this.loading = true

      await new Promise((r) => {
        setTimeout(() => {
          this.$message.success('新增菜单成功')
          r()
        }, 2000)
      })
      this.loading = false
      this.$emit('success')
    },
    // 长期按钮改变
    isLongTermChange(val) {
      if (val) {
        this.formCondition.setFieldsValue({
          dateRange: undefined
        })
        this.dateRangeDisable = true
      } else {
        this.dateRangeDisable = false
      }
    },
    onDirectiveTypesChange(val) {
      if (val.find(item => item === '电子围栏')) {
        this.isGeoFenceSelector = true
      } else {
        this.isGeoFenceSelector = false
      }
      if (val.find(item => item === '图片提取')) {
        this.isExtractImgs = true
      } else {
        this.isExtractImgs = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
#dateRange {
  width: 100%
}
</style>
