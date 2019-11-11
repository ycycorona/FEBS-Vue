<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="24">
          <a-form-item label="PANID" v-bind="formItemLayout">
            <multi-input
              v-decorator="['panId',
                            {rules: [
                               { required: true, message: 'panId不能为空'}
                             ],
                             initialValue: formValues.panId}]"
              :input-num="8"
            ></multi-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script>
import { createArrayFromNum } from '@/utils/common'
import MultiInput from '@/components/input/MultiInput/MultiInput'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const formItemLayout_1 = {
  labelCol: { span: 0 },
  wrapperCol: { offset: 5, span: 19 }
}
function formValueFormater() {
  return {
    panId: createArrayFromNum(8, 0)
  }
}
export default {
  name: 'GatewayPanId',
  components: { MultiInput },
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
