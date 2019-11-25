<template>
  <a-drawer
    destroy-on-close
    class="add-device-pop"
    :title="isEditPage ? '编辑设备': '添加设备'"
    :mask-closable="readOnly"
    width="650"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-spin size="small" :spinning="isLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="设备型号" v-bind="formItemLayout">
              <a-input
                v-decorator="['phoneModel',
                              {rules: [
                                 { required: true, message: '设备型号不能为空'},
                               ],
                               initialValue: formValue.phoneModel}]"
                :read-only="readOnly"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="设备IMEI" v-bind="formItemLayout">
              <a-input
                v-decorator="['phoneImei',
                              {rules: [
                                 { required: true, message: '设备IMEI不能为空'},
                               ],
                               initialValue: formValue.phoneImei}]"
                :read-only="readOnly"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="手机号" v-bind="formItemLayout">
              <a-input
                v-decorator="['phoneNumber',
                              {rules: [
                                 { required: true, message: '手机号不能为空'},
                               ],
                               initialValue: formValue.phoneNumber}]"
                :read-only="readOnly"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template v-if="!readOnly">
      <div class="drawer-bootom-button">
        <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
          <a-button style="margin-right: .8rem">取消</a-button>
        </a-popconfirm>
        <a-button type="primary" style="margin-right: .8rem" @click="doSubmit">保存</a-button>
      </div>
    </template>
  </a-drawer>

</template>

<script>

import moment from 'moment'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
function formValueFormater() {
  return {
    phoneModel: '',
    phoneImei: '',
    phoneNumber: ''
  }
}
export default {
  name: 'CreateControlStrategyPop',
  components: { },
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    isEditPage: {
      type: Boolean,
      default: false
    },
    editId: {
      type: [Number, String],
      default: null
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formValue: formValueFormater(),
      moment,
      isLoading: false,
      form: this.$form.createForm(this),
      formItemLayout,
      detail: null
    }
  },
  computed: {
  },
  watch: {
    visible: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          // 显示
          // 如果是编辑页面
          if (this.isEditPage) {
            this.isLoading = true
            this.detail = await this.getDetail()
            const { detail } = this
            this.formValue = {
              phoneModel: detail.phoneModel,
              phoneImei: detail.phoneImei,
              phoneNumber: detail.phoneNumber
            }
            this.isLoading = false
          }
        } else {
        // 销毁
          this.formValue = formValueFormater()
          this.form.resetFields()
        }
      }
    }
  },
  async created() {

  },
  methods: {
    onClose() {
      this.resetPopParams()
      this.$emit('close')
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        this.$get('/business/controlUserStatus/getPhoneDetailById', {
          phoneId: this.editId
        })
          .then((r) => {
            if (r.data.state === 1) {
              resolve(r.data.data)
            } else {
              reject(r.data.message)
            }
          })
      })
    },
    validateFields() {
      let validateFlag = true
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
      })
      return validateFlag
    },
    // 提交
    async doSubmit() {
      if (!this.validateFields()) { return }
      // 先提交策略
      if (!this.isEditPage) {
        await this.createItem()
      } else {
        await this.saveEditedItem()
      }
      this.resetPopParams()
      this.$emit('success')
    },
    resetPopParams() {
      this.$emit('update:visible', false)
      this.$emit('update:isEditPage', false)
      this.$emit('update:editId', '')
    },
    // 新建
    createItem() {
      const params = Object.assign({ userId: this.userId }, this.form.getFieldsValue())
      return new Promise((resolve, reject) => {
        this.$post('/business/controlUserStatus/createPhone', params).then(r => {
          resolve(r.data.data)
        })
      })
    },
    // 编辑 todo
    saveEditedItem() {
      const params = Object.assign({ id: this.editId }, this.form.getFieldsValue())
      return new Promise((resolve, reject) => {
        params
        this.$post('/business/controlUserStatus/updatePhone', params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
#dateRange {
  width: 100%
}
</style>
