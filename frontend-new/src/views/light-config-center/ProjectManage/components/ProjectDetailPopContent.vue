<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="20">
        <a-form-item label="项目名称" v-bind="formItemLayout">
          <a-input
            v-decorator="['name',
                          {
                            rules:[{ required: true, message: '项目名称不能为空'}],
                            initialValue: formValues.name}]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="项目类型" v-bind="formItemLayout">
          <a-select
            v-decorator="['type',
                          {
                            rules:[{ required: true, message: '不能为空'}],
                            initialValue: formValues.type}]"
            :options="projectOpt"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="所属城市" v-bind="formItemLayout">
          <a-select
            v-decorator="['cityId',
                          {
                            rules:[{ required: true, message: '不能为空'}],
                            initialValue: formValues.cityId}]"
            :options="cityOpt"
            placeholder="请选择所属城市"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="项目地址" v-bind="formItemLayout">
          <a-input
            v-decorator="['address',
                          {
                            rules:[{ required: true, message: '项目地址不能为空'}],
                            initialValue: formValues.address}]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="备注" v-bind="formItemLayout">
          <a-textarea
            v-decorator="['descr',
                          {rules: [

                           ],
                           initialValue: formValues.descr}]"
            class="text-area"
            :rows="15"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { save, add } from '@/service/projectManageService'

const projectOpt = [
  {
    value: '1',
    label: '普通项目'
  },
  {
    value: '2',
    label: '特殊项目'
  }
]
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      address: detailData.address,
      cityId: detailData.cityId,
      descr: detailData.descr,
      name: detailData.name,
      type: detailData.type
    }
  } else {
    return {
      address: '',
      cityId: '',
      descr: '',
      name: '',
      type: 1
    }
  }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'ProjectDetailPopContent',
  components: { },
  props: {
    detailData: {
      type: Object
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    cityOpt: {
      type: Array
    }
  },
  data() {
    const formValues = this.$props.isEdit
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
    return {
      formItemLayout, formItemLayout_1, projectOpt,
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
        address: formValues.address,
        cityId: formValues.cityId,
        descr: formValues.descr,
        name: formValues.name,
        type: formValues.type
      }
      // debugger
      await add(params)
      this.$message.info('新增城市成功')
    },
    async save(formValues) {
      const params = {
        address: formValues.address,
        cityId: formValues.cityId,
        descr: formValues.descr,
        name: formValues.name,
        type: formValues.type,
        id: formValues.id
      }
      await save(params)
      this.$message.info('修改城市成功')
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
