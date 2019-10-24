<template>
  <a-drawer
    destroy-on-close
    class="lightManageDetailPop"
    :title="titleOpt[0]"
    :mask-closable="false"
    width="800"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="项目名称" v-bind="formItemLayout">
              <a-select
                v-decorator="['project',
                              {rules: [
                                 { required: true, message: '应用名称不能为空'}
                               ],
                               initialValue: formValues.project}]"
                palceholder="请输入应用名称"
              >
                <a-select-option :value="0">项目1</a-select-option>
                <a-select-option :value="1">项目2</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="编组名称" v-bind="formItemLayout">
              <a-select
                v-decorator="['group',
                              {rules: [
                                 { required: true, message: '编组名称不能为空'}
                               ],
                               initialValue: formValues.group}]"
                palceholder="请选择编组"
              >
                <a-select-option :value="0">编组1</a-select-option>
                <a-select-option :value="1">编组2</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="智能灯编号" v-bind="formItemLayout">
              <a-input
                v-decorator="['lightId',
                              {rules: [
                                 { required: true, message: '智能灯编号不能为空'}
                               ],
                               initialValue: formValues.lightId}]"
                palceholder="请输入智能灯编号"
              />

            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="外壳编号" v-bind="formItemLayout">
              <a-input
                v-decorator="['lightShellId',
                              {rules: [
                                 { required: true, message: '外壳编号不能为空'}
                               ],
                               initialValue: formValues.lightShellId}]"
                palceholder="请输入外壳编号"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="智能灯类型" v-bind="formItemLayout">
              <a-select
                v-decorator="['lightType',
                              {rules: [
                                 { required: true, message: '智能灯类型不能为空'}
                               ],
                               initialValue: formValues.lightType}]"
                palceholder="请选择智能灯类型"
              >
                <a-select-option :value="0">1</a-select-option>
                <a-select-option :value="1">2</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安装状态" v-bind="formItemLayout">
              <a-select
                v-decorator="['installType',
                              {rules: [
                                 { required: true, message: '安装状态不能为空'}
                               ],
                               initialValue: formValues.installType}]"
                palceholder="请选择安装状态"
              >
                <a-select-option :value="0">1</a-select-option>
                <a-select-option :value="1">2</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="MAC地址" v-bind="formItemLayout_1">
              <multi-input
                v-decorator="['macAddress',
                              {rules: [
                                 { required: true, message: 'MAC地址不能为空'}
                               ],
                               initialValue: formValues.macAddress}]"
                :input-num="8"
              ></multi-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
        <a-button :loading="loading" style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { LightName } from '@/config/LightConstant'
import MultiInput from '@/components/input/MultiInput'
import { createArrayFromNum } from '@/utils/common'
const titleOpt = [
  '添加' + LightName,
  '编辑' + LightName,
  LightName + '详情'
]
function formValueFormater() {
  return {
    project: 0,
    group: 0,
    lightId: '',
    lightShellId: '',
    lightType: '',
    installType: '',
    macAddress: createArrayFromNum(8, 0)
  }
}
let counter = 0
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'LightManageDetailPop',
  components: { MultiInput },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    editId: {
      default: '',
      type: [String, Number]
    }
  },
  data() {
    return {
      titleOpt,
      formValues: formValueFormater(),
      loading: false,
      formItemLayout, formItemLayout_1,
      rawDetail: null
    }
  },
  computed: {

  },
  watch: {
    visible: {
      immediate: false,
      async handler(newVal) {
        if (newVal) {
        // 显示
          if (this.isEdit) {
            const rawDetail = this.rawDetail = await this.getDetail()
            this.$set(this.formValues.appName, 0, rawDetail.appName)
            this.$set(this.formValues.packageName, 0, rawDetail.packageName)
            this.$set(this.formValues.description, 0, rawDetail.description)
          }
        } else {
        // 销毁

        }
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [0], preserve: true })
  },
  mounted() {
    setTimeout(() => {
      this.formValues.project = 1
    })
  },
  methods: {
    onClose() {
      this.reset()
      this.$emit('close')
    },
    reset() {
      this.formValues = formValueFormater()
      this.form.resetFields()
      this.$emit('update:visible', false)
      this.$emit('update:isEdit', false)
      this.$emit('update:editId', '')
    },
    getDetail() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/black-white-app/getBlackWhiteAppById', {
          appId: this.editId
        })
          .then(r => {
            if (r.data.state === 1) {
              resolve(r.data.data)
            } else {
              reject()
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    async handleSubmit() {
      if (!this.validateFields()) {
        return
      }
      const formValues = this.form.getFieldsValue()
      console.log(formValues)
      if (this.isEdit) {
        await this.editSave(this.editId, formValues)
      } else {
        await this.createSave(formValues)
      }
      this.reset()
      this.$emit('success')
    },
    createSave(formValues) {
      const paramsList = []
      const keys = formValues.keys
      keys.forEach(key => {
        paramsList.push({
          appName: formValues.appName[key],
          description: formValues.description[key],
          packageName: formValues.packageName[key],
          type: 0
        })
      })
      console.log(paramsList)
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$post('/business/black-white-app/addBlackWhiteAppByBatch', {
          jsonString: JSON.stringify(paramsList)
        }).then(r => {
          this.$message.info('新增应用黑名单成功')
          resolve(r.data.data)
        })
          .finally(() => {
            this.loading = false
          })
      })
    },
    editSave(id, formValues) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$post('/business/black-white-app/updateBlackWhiteApp', {
          id,
          appName: formValues.appName[0],
          description: formValues.description[0],
          packageName: formValues.packageName[0],
          type: 0
        }).then(r => {
          this.$message.info('修改应用黑名单成功')
          resolve(r.data.data)
        })
          .finally(() => {
            this.loading = false
          })
      })
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
    addFormItem() {
      const { form } = this
      const keys = form.getFieldValue('keys')
      form.setFieldsValue({
        keys: keys.concat(++counter)
      })
    },
    removeFormItem(key) {
      console.log(key)
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      // We need at least one passenger
      if (keys.length === 1) {
        return
      }
      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(k => k !== key)
      })
    }
  }
}
</script>

<style lang="less" scoped>
#dateRange {
  width: 100%
}
.for-item {
  position: relative;
}
.del-for-item {
  position: absolute;
  bottom: 0;
  right: 103px;
  transform: translateY(-33px);
}
.ant-divider-horizontal {
  margin: 12px 0;
}
</style>
