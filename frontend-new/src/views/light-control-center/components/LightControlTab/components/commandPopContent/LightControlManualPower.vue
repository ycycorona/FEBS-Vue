<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="24">
          <a-form-item label="主路功率（0-100）" v-bind="formItemLayout">
            <a-input-number
              v-decorator="['powerI',
                            {rules: [

                             ],
                             initialValue: formValues.powerI}]"
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
              v-decorator="['powerII',
                            {rules: [

                             ],
                             initialValue: formValues.powerII}]"
              :min="0"
              :max="100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
function formValueFormater() {
  return {
    powerI: 50,
    powerII: 50
  }
}
export default {
  name: 'LightControlManualPower',
  components: { },
  props: {

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
      const params = []
      // this.loading = true
      // return new Promise((resolve, reject) => {
      //   this.$post('/business/black-white-app/addBlackWhiteAppByBatch', {
      //     jsonString: JSON.stringify(params)
      //   }).then(r => {
      //     this.$message.info('新增应用黑名单成功')
      //     resolve(r.data.data)
      //   })
      //     .finally(() => {
      //       this.loading = false
      //     })
      // })
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
