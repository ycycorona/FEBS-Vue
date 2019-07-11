<template>
  <a-drawer
    title="新增部门"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="deptAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-form :form="form">
      <a-form-item label="部门名称" v-bind="formItemLayout">
        <a-input
          v-model="dept.deptName"
          v-decorator="['deptName',
                        {rules: [
                          { required: true, message: '部门名称不能为空'},
                          { max: 20, message: '长度不能超过20个字符'}
                        ]}]"
        />
      </a-form-item>
      <a-form-item label="部门排序" v-bind="formItemLayout">
        <a-input-number v-model="dept.orderNum" style="width: 100%" />
      </a-form-item>
      <a-form-item
        label="上级部门"
        style="margin-bottom: 2rem"
        v-bind="formItemLayout"
      >
        <a-tree
          :key="deptTreeKeys"
          :checkable="true"
          :check-strictly="true"
          :expanded-keys="expandedKeys"
          :tree-data="deptTreeData"
          @check="handleCheck"
          @expand="handleExpand"
        />
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'DeptAdd',
  props: {
    deptAddVisiable: {
      default: false
    }
  },
  data() {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      dept: {},
      checkedKeys: [],
      expandedKeys: [],
      deptTreeData: [],
      deptTreeKeys: +new Date()
    }
  },
  watch: {
    deptAddVisiable() {
      if (this.deptAddVisiable) {
        this.$get('dept').then((r) => {
          this.deptTreeData = r.data.rows.children
        })
      }
    }
  },
  methods: {
    reset() {
      this.loading = false
      this.deptTreeKeys = +new Date()
      this.expandedKeys = this.checkedKeys = []
      this.dept = {}
      this.form.resetFields()
    },
    onClose() {
      this.reset()
      this.$emit('close')
    },
    handleCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    handleExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    handleSubmit() {
      const checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
      if (checkedArr.length > 1) {
        this.$message.error('最多只能选择一个上级部门，请修改')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          if (checkedArr.length) {
            this.dept.parentId = checkedArr[0]
          } else {
            this.dept.parentId = ''
          }
          this.$post('dept', {
            ...this.dept
          }).then(() => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
