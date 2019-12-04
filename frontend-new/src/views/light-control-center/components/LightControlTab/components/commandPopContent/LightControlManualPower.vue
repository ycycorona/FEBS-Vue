<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="主路功率（0-100）" v-bind="formItemLayout">
          <a-input-number
            v-decorator="['power1',
                          {rules: [

                           ],
                           initialValue: formValues.power1}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="辅路功率（0-100）" v-bind="formItemLayout">
          <a-input-number
            v-decorator="['power2',
                          {rules: [

                           ],
                           initialValue: formValues.power2}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { pushSetSwitchPowerByBatch } from '@/service/approvedLightManageService'
import { configSerialize, configDeserialize } from '@/utils/common'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
function formValueFormater() {
  return {
    power1: 50,
    power2: 50
  }
}
export default {
  name: 'LightControlManualPower',
  components: { },
  props: {
    selectedRowKeys: {
      type: Array
    }
  },
  data() {
    const formValues = formValueFormater()
    return {
      loading: false,
      formItemLayout,
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
        lightIds: configSerialize(this.selectedRowKeys),
        power1: formValues.power1,
        power2: formValues.power2
      }

      return pushSetSwitchPowerByBatch(params)
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
