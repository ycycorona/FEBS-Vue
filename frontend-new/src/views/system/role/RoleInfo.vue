<template>
  <a-drawer
    title="角色信息"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="true"
    :visible="roleInfoVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="close"
  >
    <p><a-icon type="crown" />&nbsp;&nbsp;角色名称：{{ roleInfoData.roleName }}</p>
    <p :title="roleInfoData.remark"><a-icon type="book" />&nbsp;&nbsp;角色描述：{{ roleInfoData.remark }}</p>
    <p><a-icon type="clock-circle" />&nbsp;&nbsp;创建时间：{{ roleInfoData.createTime }}</p>
    <p><a-icon type="clock-circle" />&nbsp;&nbsp;修改时间：{{ roleInfoData.modifyTime? roleInfoData.modifyTime : '暂未修改' }}</p>
    <p><a-icon type="trophy" />&nbsp;&nbsp;所拥有的权限：
      <a-tree
        :key="key"
        :check-strictly="true"
        :checkable="true"
        :default-checked-keys="checkedKeys[0]"
        :default-expanded-keys="checkedKeys[0]"
        :tree-data="menuTreeData"
      />
    </p>
  </a-drawer>
</template>
<script>
export default {
  name: 'RoleInfo',
  props: {
    roleInfoVisiable: {
      require: true,
      default: false
    },
    roleInfoData: {
      require: true
    }
  },
  data() {
    return {
      key: +new Date(),
      loading: true,
      checkedKeys: [],
      menuTreeData: []
    }
  },
  watch: {
    roleInfoVisiable() {
      if (this.roleInfoVisiable) {
        this.$get('menu').then((r) => {
          this.menuTreeData = r.data.rows.children
          this.$get('role/menu/' + this.roleInfoData.roleId).then((r) => {
            const length = this.checkedKeys.length
            this.checkedKeys.splice(0, length, r.data)
            this.key = +new Date()
          })
        })
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.checkedKeys = []
    }
  }
}
</script>
