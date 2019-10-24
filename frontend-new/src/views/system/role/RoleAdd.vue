<template>
  <a-drawer
    title="新增角色"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="roleAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-form :form="form">
      <a-form-item
        label="角色名称"
        v-bind="formItemLayout"
        :validate-status="validateStatus"
        :help="help"
      >
        <a-input v-model="role.roleName" v-decorator="['roleName']" @blur="handleRoleNameBlur" />
      </a-form-item>
      <a-form-item label="角色描述" v-bind="formItemLayout">
        <a-textarea
          v-model="role.remark"
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
  name: 'RoleAdd',
  props: {
    roleAddVisiable: {
      default: false
    }
  },
  data() {
    return {
      menuTreeKey: +new Date(),
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      validateStatus: '',
      menuSelectStatus: '',
      help: '',
      menuSelectHelp: '',
      role: {
        roleName: '',
        remark: '',
        menuId: ''
      },
      checkedKeys: [],
      expandedKeys: [],
      menuTreeData: [],
      allTreeKeys: [],
      checkStrictly: false
    }
  },
  watch: {
    roleAddVisiable() {
      if (this.roleAddVisiable) {
        this.$get('menu').then((r) => {
          this.menuTreeData = r.data.rows.children
          this.allTreeKeys = r.data.ids
        })
      }
    }
  },
  methods: {
    reset() {
      this.menuTreeKey = +new Date()
      this.expandedKeys = this.checkedKeys = []
      this.validateStatus = this.help = ''
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
    handleSubmit() {
      const checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
      if (this.validateStatus !== 'success') {
        this.handleRoleNameBlur()
      } else if (checkedArr.length === 0) {
        this.menuSelectStatus = 'error'
        this.menuSelectHelp = '请选择相应的权限'
      } else {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.loading = true
            this.role.menuId = checkedArr.join(',')
            this.$post('role', {
              ...this.role
            }).then((r) => {
              this.reset()
              this.$emit('success')
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    },
    handleRoleNameBlur() {
      const roleName = this.role.roleName.trim()
      if (roleName.length) {
        if (roleName.length > 10) {
          this.validateStatus = 'error'
          this.help = '角色名称不能超过10个字符'
        } else {
          this.validateStatus = 'validating'
          this.$get(`role/check/${roleName}`).then((r) => {
            if (r.data) {
              this.validateStatus = 'success'
              this.help = ''
            } else {
              this.validateStatus = 'error'
              this.help = '抱歉，该角色名称已存在'
            }
          })
        }
      } else {
        this.validateStatus = 'error'
        this.help = '角色名称不能为空'
      }
    }
  }
}
</script>
