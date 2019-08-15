<template>
  <a-drawer
    destroy-on-close
    class="create-black-app-list-pop"
    title="添加应用黑名单"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="visiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
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
                              ]}]"
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
                              ]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="18">
            <a-form-item label="备注" v-bind="formItemLayout">
              <a-input
                v-decorator="[`remark[${k}]`]"
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
      <a-button ghost type="primary" @click="addFormItem">
        <a-icon type="plus" /><span style="margin-left: 3px;">继续添加</span>
      </a-button>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
        <a-button :loading="loading" style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
let counter = 0
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
export default {
  name: 'CreateBlackAppListPop',
  components: { },
  props: {
    visiable: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      loading: false,
      formItemLayout
    }
  },
  computed: {

  },
  watch: {

  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [0], preserve: true })
  },
  methods: {
    onClose() {
      this.$emit('close')
      this.form.resetFields()
    },
    async handleSubmit() {
      let validateFlag = true
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
        console.log(fieldsValue)
      })
      if (!validateFlag) { return }
      this.loading = true
      await new Promise((r) => {
        setTimeout(() => {
          this.$message.success('新增菜单成功')
          r()
        }, 2000)
      })
      this.loading = false
      this.$emit('success')
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
