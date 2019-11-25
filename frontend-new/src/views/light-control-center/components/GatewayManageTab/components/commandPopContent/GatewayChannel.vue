<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="12">
          <a-form-item label="频道" v-bind="formItemLayout">
            <a-input
              v-decorator="['channel',
                            {rules: [
                               { required: true, message: '频道不能为空'}
                             ],
                             initialValue: formValues.channel}]"
              palceholder=""
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script>
import { setChannel } from '@/service/gatewayManageService'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout_1 = {
  labelCol: { span: 0 },
  wrapperCol: { offset: 5, span: 19 }
}
function formValueFormater(detailData) {
  if (detailData) {
    return {
      channel: detailData.gatewayConfig.pindao
    }
  } else {
    return {
      channel: ''
    }
  }
}
export default {
  name: 'GatewayChannel',
  components: { },
  props: {
    detailData: {
      type: Object
    },
    editId: {
      type: [String, Number]
    }
  },
  data() {
    const formValues = this.$props.detailData
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
    return {
      loading: false,
      formItemLayout, formItemLayout_1,
      formValues,
      form: this.$form.createForm(this)
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.$store.commit('contact/setCurrentPopContent', this)
  },
  methods: {
    async handleSubmit() {
      if (!this.validateFields()) {
        return false
      }
      const formValues = this.collectData()
      await this.save(formValues)
      return true
    },
    async save(formValues) {
      await setChannel({
        gatewayId: this.editId,
        pindao: formValues.channel

      })
      this.$message.info('修改频道成功')
    },
    collectData() {
      return this.form.getFieldsValue()
    },
    validateFields(arr = []) {
      let fieldnames
      if (arr.length !== 0) {
        fieldnames = arr
      }
      let validateFlag = true
      this.form.validateFields(fieldnames, (err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
      })
      return validateFlag
    }
  }
}
</script>

<style lang="less" scoped>

</style>
