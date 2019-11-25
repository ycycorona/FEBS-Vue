<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="12">
          <a-form-item label="电表地址" v-bind="formItemLayout">
            <a-input
              v-decorator="['electricAddress',
                            {rules: [
                               { required: true, message: '电表地址不能为空'}
                             ],
                             initialValue: formValues.electricAddress}]"
              palceholder=""
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script>
import { setMeterAddress } from '@/service/gatewayManageService'
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
      electricAddress: detailData.gatewayObj.electricMeterAddress
    }
  } else {
    return {
      electricAddress: ''
    }
  }
}
export default {
  name: 'GatewayElectricAddress',
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
    this.formValues = formValues
    return {
      loading: false,
      formItemLayout, formItemLayout_1,
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
      await setMeterAddress({
        gatewayId: this.editId,
        electricMeterAddress: formValues.electricAddress

      })
      this.$message.info('修改电表地址成功')
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
