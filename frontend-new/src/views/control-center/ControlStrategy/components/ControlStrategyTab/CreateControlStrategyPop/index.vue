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
    <a-form :form="form">
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
              v-decorator="['dateRange.value',
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
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
}
export default {
  name: 'CreateControlStrategyPop',
  components: { },
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
      form: this.$form.createForm(this),
      mForm: { isLongTerm: false },
      formItemLayout,
      dateRangeDisable: false
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
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        console.log(fieldsValue)
      })

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
    isLongTermChange(val) {
      if (val) {
        this.form.setFieldsValue({
          dateRange: undefined
        })
        this.dateRangeDisable = true
      } else {
        this.dateRangeDisable = false
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
