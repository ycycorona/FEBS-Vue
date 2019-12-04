<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="触发功率(%)" v-bind="formItemLayout">
          <a-input-number
            v-decorator="['trig_power',
                          {rules: [

                           ],
                           initialValue: formValues.trig_power}]"
            :min="20"
            :max="100"
          /> <span>(设置范围：20-100)</span>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="触发时间(秒)" v-bind="formItemLayout">
          <a-input-number
            v-decorator="['trig_time',
                          {rules: [

                           ],
                           initialValue: formValues.trig_time}]"
            :min="30"
            :max="255"
          /> <span>(设置范围：30-255)</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { pushSetTriggerByBatch } from '@/service/approvedLightManageService'
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
    trig_power: 20,
    trig_time: 30
  }
}
export default {
  name: 'InfraredParams',
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
    save(formValues) {
      const params = {
        lightIds: this.$configSerialize(this.selectedRowKeys),
        trig_power: formValues.trig_power,
        trig_time: formValues.trig_time
      }

      return pushSetTriggerByBatch(params)
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
