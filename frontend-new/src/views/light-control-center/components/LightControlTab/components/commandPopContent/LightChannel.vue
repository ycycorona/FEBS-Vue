<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="频道(11-26)" v-bind="formItemLayout">
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
</template>
<script>
import { pushSetPindaoByBatch } from '@/service/approvedLightManageService'
import { configSerialize, configDeserialize } from '@/utils/common'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout_1 = {
  labelCol: { span: 0 },
  wrapperCol: { offset: 5, span: 19 }
}
function formValueFormater() {
  return {
    channel: ''
  }
}
export default {
  name: 'LightChannel',
  components: { },
  props: {
    selectedRowKeys: {
      type: Array
    }
  },
  data() {
    const formValues = formValueFormater()
    return {
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
      const params = {
        lightIds: configSerialize(this.selectedRowKeys),
        pindao: formValues.channel
      }

      return pushSetPindaoByBatch(params)
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
