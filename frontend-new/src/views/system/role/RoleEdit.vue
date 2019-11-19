<template>
  <a-drawer
    title="修改角色"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="roleEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-form :form="form">
      <a-form-item label="角色名称" v-bind="formItemLayout">
        <a-input v-decorator="['roleName']" read-only />
      </a-form-item>
      <a-form-item label="角色描述" v-bind="formItemLayout">
        <a-textarea
          v-decorator="[
            'remark',
            {rules: [
              { max: 50, message: '长度不能超过50个字符'}
            ]}]"
          :rows="4"
        />
      </a-form-item>
      <a-form-item
        label="权限选择"
        style="margin-bottom: 2rem"
        :validate-status="menuSelectStatus"
        :help="menuSelectHelp"
        v-bind="formItemLayout"
      >
        <a-tree
          :key="menuTreeKey"
          ref="menuTree"
          :checkable="true"
          :check-strictly="checkStrictly"
          :default-checked-keys="defaultCheckedKeys[0]"
          :expanded-keys="expandedKeys"
          :tree-data="menuTreeData"
          @check="handleCheck"
          @expand="handleExpand"
        />
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="2" @click="closeAll">合并所有</a-menu-item>
          <a-menu-item key="3" @click="enableRelate">父子关联</a-menu-item>
          <a-menu-item key="4" @click="disableRelate">取消关联</a-menu-item>
        </a-menu>
        <a-button>
          树操作 <a-icon type="up" />
        </a-button>
      </a-dropdown>
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
  name: 'RoleEdit',
  props: {
    roleEditVisiable: {
      default: false
    },
    roleInfoData: {
      require: true
    }
  },
  data() {
    return {
      menuTreeKey: +new Date(),
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      menuSelectStatus: '',
      menuSelectHelp: '',
      role: {
        menuId: ''
      },
      menuTreeData: [],
      allTreeKeys: [],
      checkedKeys: [],
      defaultCheckedKeys: [],
      expandedKeys: [],
      checkStrictly: true
    }
  },
  watch: {
    roleEditVisiable() {
      if (this.roleEditVisiable) {
        this.$get('menu').then((r) => {
          this.menuTreeData = r.data.rows.children
          this.allTreeKeys = r.data.ids
          this.$get('role/menu/' + this.roleInfoData.roleId).then((r) => {
            this.defaultCheckedKeys.splice(0, this.defaultCheckedKeys.length, r.data)
            this.checkedKeys = r.data
            this.expandedKeys = r.data
            this.menuTreeKey = +new Date()
          })
        })
      }
    }
  },
  methods: {
    reset() {
      this.menuTreeKey = +new Date()
      this.expandedKeys = []
      this.checkedKeys = []
      this.defaultCheckedKeys = []
      this.menuSelectStatus = this.menuSelectHelp = ''
      this.loading = false
      this.form.resetFields()
    },
    onClose() {
      this.reset()
      this.$emit('close')
    },
    expandAll() {
      this.expandedKeys = this.allTreeKeys
    },
    closeAll() {
      this.expandedKeys = []
    },
    enableRelate() {
      this.checkStrictly = false
    },
    disableRelate() {
      this.checkStrictly = true
    },
    handleCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
      const checkedArr = Object.is(checkedKeys.checked, undefined) ? checkedKeys : checkedKeys.checked
      if (checkedArr.length) {
        this.menuSelectStatus = ''
        this.menuSelectHelp = ''
      } else {
        this.menuSelectStatus = 'error'
        this.menuSelectHelp = '请选择相应的权限'
      }
    },
    handleExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    setFormValues({ ...role }) {
      const fields = ['roleName', 'remark']
      Object.keys(role).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          const obj = {}
          obj[key] = role[key]
          this.form.setFieldsValue(obj)
        }
      })
    },
    handleSubmit() {
      const checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
      if (checkedArr.length === 0) {
        this.menuSelectStatus = 'error'
        this.menuSelectHelp = '请选择相应的权限'
      } else {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.loading = true
            const role = this.form.getFieldsValue()
            role.roleId = this.roleInfoData.roleId
            role.menuId = checkedArr.join(',')
            this.$put('role', {
              ...role
            }).then((r) => {
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
}
</script>
