<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="20">
        <a-form-item label="灯类型名称" v-bind="formItemLayout">
          <a-input
            v-decorator="['name',
                          {
                            rules:[{ required: true, message: '类型名称不能为空'}],
                            initialValue: formValues.name}]"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { save, add } from '@/service/lightTypeManageService'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      name: detailData.name
    }
  } else {
    return {
      name: ''
    }
  }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'LightTypeDetailPopContent',
  components: { },
  props: {
    detailData: {
      type: Object
    },
    isEdit: {
      default: false,
      type: Boolean
    }
  },
  data() {
    const formValues = this.$props.isEdit
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
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
  mounted() {

  },
  methods: {
    async handleSubmit() {
      if (!this.validateFields()) {
        return false
      }
      const formValues = this.collectData()
      if (this.isEdit) {
        await this.save(formValues)
      } else {
        await this.add(formValues)
      }
      return true
    },
    async add(formValues) {
      const params = {
        name: formValues.name
      }
      // debugger
      await add(params)
      this.$message.info('新增灯类型成功')
    },
    async save(formValues) {
      const params = {
        name: formValues.name
      }
      await save(params)
      this.$message.info('修改灯类型成功')
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
