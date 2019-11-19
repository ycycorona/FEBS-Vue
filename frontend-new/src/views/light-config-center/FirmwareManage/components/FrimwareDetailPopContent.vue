<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="20">
        <a-form-item label="固件文件" v-bind="formItemLayout">
          <a-upload
            v-decorator="[
              'upload',
              {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
                rules:[{ required: true, message: '文件不能为空'}]
              },
            ]"
            :disabled="file!==null"
            :before-upload="beforeUpload"
            name="file"
          >
            <a-button :disabled="file!==null"> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>
          <div v-if="isEdit" class="last-desc">已上传文件名: <span>{{ lastFileName }}</span></div>
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="版本号" v-bind="formItemLayout">
          <a-input
            v-decorator="['version',
                          {
                            rules:[{ required: true, message: '版本号不能为空'}],
                            initialValue: formValues.version}]"
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
import { save, add } from '@/service/firmwareManageService'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      version: detailData.id,
      descr: detailData.descr

    }
  } else {
    return {
      version: '',
      descr: ''
    }
  }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'FrimwareDetailPopContent',
  components: { },
  props: {
    detailData: {
      type: Object
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    fileType: {
      type: Number
    }
  },
  data() {
    const formValues = this.$props.isEdit
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
    let versionName = ''
    if (this.isEdit && this.detailData) {
      versionName = this.detailData.versionName
    }
    return {
      formItemLayout, formItemLayout_1,
      formValues,
      form: this.$form.createForm(this),
      file: null,
      lastFileName: versionName
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
      console.log(formValues)
      if (this.isEdit) {
        await this.save(formValues)
      } else {
        await this.add(formValues)
      }
      return true
    },
    async add(formValues) {
      const params = {
        version: formValues.version,
        descr: formValues.descr,
        file: formValues.upload[0].originFileObj,
        fileType: this.fileType
      }

      console.log(params)
      await add(params)
      this.$message.info('上传固件成功')
    },
    async save(formValues) {
      const params = {
        version: formValues.version,
        descr: formValues.descr,
        file: formValues.upload[0].originFileObj,
        fileType: this.fileType
      }
      await save(params)
      this.$message.info('修改固件成功')
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
    normFile(e) {
      // console.log('Upload event:', e)

      if (Array.isArray(e)) {
        return e
      }
      if (e.fileList.length === 0) {
        this.file = null
      } else {
        this.file = e.fileList[0]
      }
      return e && e.fileList
    },
    beforeUpload(file) {
      // console.log(file)

      return false
    }
  }
}
</script>

<style lang="less" scoped>
.last-desc {
  font-style: italic
}
</style>
