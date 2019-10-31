<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="12">
          <a-form-item label="I路" v-bind="formItemLayout">
            <a-radio-group
              v-decorator="['typeI',
                            {rules: [

                             ],
                             initialValue: formValues.typeI}]"
            >
              <a-radio :style="radioStyle" :value="1">开灯</a-radio>
              <a-radio :style="radioStyle" :value="2">关灯</a-radio>
              <a-radio :style="radioStyle" :value="3">启用</a-radio>
              <a-radio :style="radioStyle" :value="4">禁用</a-radio>
              <a-radio :style="radioStyle" :value="5">定时</a-radio>
              <a-radio :style="radioStyle" :value="6">经纬度</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="II路" v-bind="formItemLayout">
            <a-radio-group
              v-decorator="['typeII',
                            {rules: [

                             ],
                             initialValue: formValues.typeII}]"
            >
              <a-radio :style="radioStyle" :value="1">开灯</a-radio>
              <a-radio :style="radioStyle" :value="2">关灯</a-radio>
              <a-radio :style="radioStyle" :value="3">启用</a-radio>
              <a-radio :style="radioStyle" :value="4">禁用</a-radio>
              <a-radio :style="radioStyle" :value="5">定时</a-radio>
              <a-radio :style="radioStyle" :value="6">经纬度</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
function formValueFormater() {
  return {
    typeI: 1,
    typeII: 1
  }
}
export default {
  name: 'LightControlType',
  components: { },
  props: {

  },
  data() {
    const formValues = formValueFormater()
    return {
      loading: false,
      formItemLayout,
      formValues,
      form: this.$form.createForm(this),
      radioStyle: {
        display: 'block',
        height: '39px',
        lineHeight: '39px'
      }
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
