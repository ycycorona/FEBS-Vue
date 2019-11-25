<template>
  <a-drawer
    destroy-on-close
    class="create-black-app-list-pop"
    title="添加应用黑名单"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <div v-for="(k, index) in form.getFieldValue('keys')" :key="k" class="for-item">
          <div>{{ `${index+1}、` }}</div>
          <a-row :gutter="24">
            <a-col :span="18">
              <a-form-item label="应用名称" v-bind="formItemLayout">
                <a-input
                  v-decorator="[`appName[${k}]`,
                                {rules: [
                                   { required: true, message: '应用名称不能为空'},
                                   { max: 20, message: '长度不能超过20个字符'}
                                 ],
                                 initialValue: formValues.appName[k]}]"
                  palceholder="请输入应用名称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="18">
              <a-form-item label="应用包名" v-bind="formItemLayout">
                <a-input
                  v-decorator="[`packageName[${k}]`,
                                {rules: [
                                   { required: true, message: '应用包名不能为空'}
                                 ],
                                 initialValue: formValues.packageName[k]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="18">
              <a-form-item label="备注" v-bind="formItemLayout">
                <a-input
                  v-decorator="[`description[${k}]`,
                                {initialValue: formValues.description[k]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider v-if="form.getFieldValue('keys').length-1!==index" />
          <div v-else style="margin-top:12px;height:1px"></div>
          <a-button
            v-if="index!==0"
            type="danger"
            shape="circle"
            icon="delete"
            class="del-for-item"
            @click="removeFormItem(k)"
          ></a-button>
        </div>
        <a-button v-if="!isEdit" ghost type="primary" @click="addFormItem">
          <a-icon type="plus" /><span style="margin-left: 3px;">继续添加</span>
        </a-button>
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
function formValueFormater() {
  return {
    appName: [''],
    packageName: [''],
    description: ['']
  }
}
let counter = 0
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
export default {
  name: 'CreateBlackAppListPop',
  components: { },
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
      formValues: formValueFormater(),
      loading: false,
      formItemLayout,
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
