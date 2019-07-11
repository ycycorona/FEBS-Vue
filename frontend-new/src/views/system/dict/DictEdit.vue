<template>
  <a-drawer
    title="修改字典"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="dictEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-form :form="form">
      <a-form-item label="键" v-bind="formItemLayout">
        <a-input-number
          v-decorator="['keyy',
                        {rules: [
                          { required: true, message: '不能为空'}
                        ]}]"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="值" v-bind="formItemLayout">
        <a-input
          v-decorator="['valuee',
                        {rules: [
                          { required: true, message: '不能为空'},
                          { max: 20, message: '长度不能超过20个字符'}
                        ]}]"
        />
      </a-form-item>
      <a-form-item label="表名" v-bind="formItemLayout">
        <a-input
          v-decorator="['tableName',
                        {rules: [
                          { required: true, message: '不能为空'},
                          { max: 20, message: '长度不能超过20个字符'}
                        ]}]"
        />
      </a-form-item>
      <a-form-item label="字段" v-bind="formItemLayout">
        <a-input
          v-decorator="['fieldName',
                        {rules: [
                          { required: true, message: '不能为空'},
                          { max: 20, message: '长度不能超过20个字符'}
                        ]}]"
        />
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'DictEdit',
  props: {
    dictEditVisiable: {
      default: false
    }
  },
  data() {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      dict: {}
    }
  },
  methods: {
    reset() {
      this.loading = false
      this.form.resetFields()
    },
    onClose() {
      this.reset()
      this.$emit('close')
    },
    setFormValues({ ...dict }) {
      const fields = ['keyy', 'valuee', 'tableName', 'fieldName']
      Object.keys(dict).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          const obj = {}
          obj[key] = dict[key]
          this.form.setFieldsValue(obj)
        }
      })
      this.dict.dictId = dict.dictId
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const dict = this.form.getFieldsValue()
          dict.dictId = this.dict.dictId
          this.$put('dict', {
            ...dict
          }).then(() => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
