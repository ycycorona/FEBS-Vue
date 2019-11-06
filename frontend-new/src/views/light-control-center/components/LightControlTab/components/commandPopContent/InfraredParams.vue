<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="12">
          <a-form-item label="触发功率(%)" v-bind="formItemLayout">
            <a-input-number
              v-decorator="['power',
                            {rules: [

                             ],
                             initialValue: formValues.power}]"
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
              v-decorator="['time',
                            {rules: [

                             ],
                             initialValue: formValues.time}]"
              :min="30"
              :max="255"
            /> <span>(设置范围：30-255)</span>
          </a-form-item>
        </a-col>
      </a-row>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script>

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
    power: 20,
    time: 30
  }
}
export default {
  name: 'InfraredParams',
  components: { },
  props: {

  },
  data() {
    const formValues = formValueFormater()
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
    save(formValues) {
      // const params = []
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
