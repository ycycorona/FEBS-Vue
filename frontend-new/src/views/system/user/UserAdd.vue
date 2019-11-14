<template>
  <a-drawer
    title="新增用户"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="userAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-form :form="form">
      <a-form-item
        label="用户名"
        v-bind="formItemLayout"
        :validate-status="validateStatus"
        :help="help"
      >
        <a-input
          v-model="user.username"
          v-decorator="['username',{rules: [{ required: true, message: '用户名不能为空'}]}]"
          @blur="handleUserNameBlur"
        />
      </a-form-item>
      <a-form-item label="密码" v-bind="formItemLayout">
        <a-tooltip title="新用户默认密码为 1234qwer">
          <a-input type="password" read-only :value="defaultPassword" />
        </a-tooltip>
      </a-form-item>
      <a-form-item label="邮箱" v-bind="formItemLayout">
        <a-input
          v-model="user.email"
          v-decorator="['email',{rules: [
            { type: 'email', message: '请输入正确的邮箱' },
            { max: 50, message: '长度不能超过50个字符'}
          ]}]"
        />
      </a-form-item>
      <a-form-item label="手机" v-bind="formItemLayout">
        <a-input
          v-model="user.mobile"
          v-decorator="['mobile', {rules: [
            { pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入正确的手机号'}
          ]}]"
        />
      </a-form-item>
      <a-form-item label="角色" v-bind="formItemLayout">
        <a-select
          v-model="user.roleId"
          v-decorator="['role',{rules: [{ required: true, message: '请选择角色' }]}]"
          mode="multiple"
          :allow-clear="true"
          style="width: 100%"
        >
          <a-select-option v-for="r in roleData" :key="r.roleId">{{ r.roleName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="部门" v-bind="formItemLayout">
        <a-tree-select
          v-model="user.deptId"
          v-decorator="['deptId']"
          :allow-clear="true"
          :dropdown-style="{ maxHeight: '220px', overflow: 'auto' }"
          :tree-data="deptTreeData"
        />
      </a-form-item>
      <a-form-item label="状态" v-bind="formItemLayout">
        <a-radio-group
          v-model="user.status"
          v-decorator="['status',{rules: [{ required: true, message: '请选择状态'}]}]"
        >
          <a-radio value="0">锁定</a-radio>
          <a-radio value="1">有效</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="性别" v-bind="formItemLayout">
        <a-radio-group
          v-model="user.ssex"
          v-decorator="['ssex',{rules: [{ required: true, message: '请选择性别' }]}]"
        >
          <a-radio value="0">男</a-radio>
          <a-radio value="1">女</a-radio>
          <a-radio value="2">保密</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="项目权限" v-bind="formItemLayout">
        <a-select
          v-decorator="['projectAuth',{
            rules: [],
            initialValue: []
          }]"
          mode="multiple"
          style="width: 100%"
          option-filter-prop="children"
          @change="projectAuthChange(arguments[0])"
        >
          <a-select-option v-for="r in projectOpt" :key="r.id">{{ r.name }}</a-select-option>
        </a-select>
        <div v-for="p in projectAuth" :key="p.id">
          {{ p.name }}：
          <a-radio-group v-model="p.permissionId" :name="`radioGroup-${p.id}`">
            <a-radio :value="2">只读</a-radio>
            <a-radio :value="1">读写</a-radio>
          </a-radio-group>
        </div>
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
  name: 'UserAdd',
  props: {
    userAddVisiable: {
      default: false
    },
    projectOpt: {
      type: Array
    }
  },
  data() {
    return {
      user: {
        username: ''
      },
      loading: false,
      roleData: [],
      deptTreeData: [],
      formItemLayout,
      defaultPassword: '1234qwer',
      form: this.$form.createForm(this),
      validateStatus: '',
      help: '',
      projectAuth: []
    }
  },
  computed: {
    projectOptMap() {
      const projectOpt = this.projectOpt
      const obj = {}
      projectOpt.forEach(item => {
        obj[item.id] = item
      })
      return obj
    }
  },
  watch: {
    userAddVisiable() {
      if (this.userAddVisiable) {
        this.$get('role').then((r) => {
          this.roleData = r.data.rows
        })
        this.$get('dept').then((r) => {
          this.deptTreeData = r.data.rows.children
        })
      }
    }
  },
  methods: {
    projectAuthChange(authIds, permissionIds = []) {
      console.log(arguments)
      const authsProjects = authIds.map(authId => {
        return this.projectOptMap[authId]
      })
      const projectAuth = authsProjects.map(pro => {
        return {
          name: pro.name,
          projectId: pro.id,
          permissionId: 2 // 默认只读
        }
      })
      if (permissionIds.length !== 0) {
        permissionIds.forEach((permissionId, index) => {
          projectAuth[index].permissionId = permissionId
        })
      }
      this.projectAuth = projectAuth
    },
    reset() {
      this.projectAuth = []
      this.validateStatus = ''
      this.help = ''
      this.user.username = ''
      this.loading = false
      this.form.resetFields()
    },
    onClose() {
      this.reset()
      this.$emit('close')
    },
    handleSubmit() {
      if (this.validateStatus !== 'success') {
        this.handleUserNameBlur()
      }
      const uppList = this.projectAuth.map(item => {
        return {
          permissionId: item.permissionId,
          projectId: item.projectId
        }
      })

      this.form.validateFields((err, values) => {
        if (!err && this.validateStatus === 'success') {
          this.loading = true
          this.user.roleId = this.user.roleId.join(',')
          this.$postJson('user', {
            user: this.user,
            uppList: uppList
          }).then((r) => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleUserNameBlur() {
      const username = this.user.username.trim()
      if (username.length) {
        if (username.length > 10) {
          this.validateStatus = 'error'
          this.help = '用户名不能超过10个字符'
        } else if (username.length < 4) {
          this.validateStatus = 'error'
          this.help = '用户名不能少于4个字符'
        } else {
          this.validateStatus = 'validating'
          this.$get(`user/check/${username}`).then((r) => {
            if (r.data) {
              this.validateStatus = 'success'
              this.help = ''
            } else {
              this.validateStatus = 'error'
              this.help = '抱歉，该用户名已存在'
            }
          })
        }
      } else {
        this.validateStatus = 'error'
        this.help = '用户名不能为空'
      }
    }
  }
}
</script>
