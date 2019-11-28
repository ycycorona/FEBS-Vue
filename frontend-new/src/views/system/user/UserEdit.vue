<template>
  <a-drawer
    title="修改用户"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="userEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-form :form="form">
      <a-form-item label="用户名" v-bind="formItemLayout">
        <a-input v-decorator="['username']" read-only />
      </a-form-item>
      <a-form-item label="邮箱" v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'email',
            {rules: [
              { type: 'email', message: '请输入正确的邮箱' },
              { max: 50, message: '长度不能超过50个字符'}
            ]}
          ]"
        />
      </a-form-item>
      <a-form-item label="手机" v-bind="formItemLayout">
        <a-input
          v-decorator="['mobile', {rules: [
            { pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入正确的手机号'}
          ]}]"
        />
      </a-form-item>
      <a-form-item label="角色" v-bind="formItemLayout">
        <a-select
          v-decorator="[
            'roleId',
            {rules: [{ required: true, message: '请选择角色' }]}
          ]"
          mode="multiple"
          :allow-clear="true"
          style="width: 100%"
        >
          <a-select-option v-for="r in roleData" :key="r.roleId.toString()">{{ r.roleName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="部门" v-bind="formItemLayout">
        <a-tree-select
          :allow-clear="true"
          :dropdown-style="{ maxHeight: '220px', overflow: 'auto' }"
          :tree-data="deptTreeData"
          :value="userDept"
          @change="onDeptChange"
        />
      </a-form-item>
      <a-form-item label="状态" v-bind="formItemLayout">
        <a-radio-group
          v-decorator="[
            'status',
            {rules: [{ required: true, message: '请选择状态' }]}
          ]"
        >
          <a-radio value="0">锁定</a-radio>
          <a-radio value="1">有效</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="性别" v-bind="formItemLayout">
        <a-radio-group
          v-decorator="[
            'ssex',
            {rules: [{ required: true, message: '请选择性别' }]}
          ]"
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
            initialValue: [],
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
import { mapState, mapMutations } from 'vuex'

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'UserEdit',
  props: {
    userEditVisiable: {
      default: false
    },
    projectOpt: {
      type: Array
    }
  },
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      deptTreeData: [],
      roleData: [],
      userDept: [],
      userId: '',
      loading: false,
      projectAuth: [],
      record: null
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.account.user
    }),
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
    userEditVisiable() {
      if (this.userEditVisiable) {
        this.setFormValues(this.record)
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
    ...mapMutations({
      setUser: 'account/setUser'
    }),
    projectAuthChange(authIds, permissionIds = []) {
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
    onClose() {
      this.projectAuth = []
      this.loading = false
      this.form.resetFields()
      this.$emit('close')
    },
    setFormValues({ ...user }) {
      this.userId = user.userId
      const fields = ['username', 'email', 'status', 'ssex', 'mobile']
      // debugger

      Object.keys(user).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          const obj = {}
          obj[key] = user[key]

          this.form.setFieldsValue(obj)
        }
      })
      // 初始化权限
      this.form.getFieldDecorator('projectAuth')
      this.projectAuthChange(user.uppList.map(item => item.projectId),
        user.uppList.map(item => item.permissionId))

      this.form.setFieldsValue({
        projectAuth: user.uppList.map(item => item.projectId)
      })
      if (user.roleId) {
        this.form.getFieldDecorator('roleId')
        const roleArr = user.roleId.split(',')
        this.form.setFieldsValue({ 'roleId': roleArr })
      }
      if (user.deptId) {
        this.userDept = [user.deptId]
      }
    },
    onDeptChange(value) {
      this.userDept = value
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const user = this.form.getFieldsValue()
          user.roleId = user.roleId.join(',')
          user.userId = this.userId
          // user.deptId = this.userDept[0]
          delete user.projectAuth
          const uppList = this.projectAuth.map(item => {
            return {
              permissionId: item.permissionId,
              projectId: item.projectId
            }
          })
          this.$putJson('user', {
            user, uppList
          }).then((r) => {
            this.loading = false
            this.$emit('success')
            // 如果修改用户就是当前登录用户的话，更新其state
            if (user.username === this.currentUser.username) {
              this.$get(`user/${user.username}`).then((r) => {
                this.setUser(r.data)
              })
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }

}
</script>
