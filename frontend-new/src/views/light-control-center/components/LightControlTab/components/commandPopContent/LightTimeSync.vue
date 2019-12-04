<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="校准系统时间" v-bind="formItemLayout">
          <a-date-picker
            v-decorator="['sysDateTime',
                          {rules: [
                             { required: true, message: '时间不能为空'}
                           ],
                           initialValue: formValues.sysDateTime}]"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="" v-bind="formItemLayout_1">
          <a-button @click="getLocalDate">同步本地时间</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { pushSetSysTimeByBatch } from '@/service/approvedLightManageService'
import { configSerialize, configDeserialize } from '@/utils/common'
import moment from 'moment'
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
    sysDateTime: null
  }
}
export default {
  name: 'LightTimeSync',
  components: { },
  props: {
    selectedRowKeys: {
      type: Array
    }
  },
  data() {
    const formValues = formValueFormater()
    return {
      moment,
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
        lightIds: configSerialize(this.selectedRowKeys),
        time: formValues.sysDateTime.format('YYYY-MM-DD HH:mm:ss')
      }

      return pushSetSysTimeByBatch(params)
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
    },
    getLocalDate() {
      this.form.setFieldsValue({ 'sysDateTime': moment(new Date()) })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
