<template>
  <div class="read-user-selected">
    <a-modal
      :width="900"
      title="选择接收用户"
      :body-style="{height: '500px'}"
      :visible="visible"
      :confirm-loading="confirmLoading"
      destroy-on-close
      @cancel="onClose"
      @ok="handSubmit"
    >
      <a-row :gutter="16" style="height:100%">
        <!-- class="col-border-right" -->
        <a-col :span="24">
          <a-tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            @expand="onExpand"
            @check="onCheck"
          />
        </a-col>

      </a-row>
    </a-modal>
  </div>
</template>

<script>

const treeData = [{
  title: '0-0',
  key: '0-0',
  children: [{
    title: '0-0-0',
    key: '0-0-0',
    children: [
      { title: '0-0-0-0', key: '0-0-0-0', disableCheckbox: true },
      { title: '0-0-0-1', key: '0-0-0-1' },
      { title: '0-0-0-2', key: '0-0-0-2' }
    ]
  }, {
    title: '0-0-1',
    key: '0-0-1',
    children: [
      { title: '0-0-1-0', key: '0-0-1-0' },
      { title: '0-0-1-1', key: '0-0-1-1' },
      { title: '0-0-1-2', key: '0-0-1-2' }
    ]
  }, {
    title: '0-0-2',
    key: '0-0-2'
  }]
}, {
  title: '0-1',
  key: '0-1',
  children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' }
  ]
}, {
  title: '0-2',
  key: '0-2'
}]
export default {
  name: 'ReadUserSelected',
  components: { },
  props: {
    visible: {
      default: true,
      type: Boolean
    },
    value: {
      default: () => { return [] },
      type: Array
    }
  },
  data() {
    return {
      confirmLoading: false,
      options: [],
      selectUser: [],
      treeValue: [],
      console,
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData
    }
  },
  computed: {

  },
  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        const valueWithPrefix = this.value.map(item => `user_${item}`)
        if (newVal) {
        // 显示
          this.treeValue = [].concat(valueWithPrefix)
        } else {
        // 销毁
          this.selectUser = []
        }
      }
    },
    checkedKeys(val) {
      // console.log('onCheck', val)
    }
  },
  created() {
    this.$get('/business/cmd-strategy/getAllTree')
      .then(r => {
        const data = r.data.data
        this.options = data
      })
  },
  methods: {
    handSubmit() {
      // this.confirmLoading = true
      this.$emit('update:visible', false)
      this.$emit('success', this.selectUser)
      // this.confirmLoading = false
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    onTreeSelect(node, instanceId) {
      console.log(node)
      this.getSelectUser(this.$refs['tree-select'].selectedNodes.map(item => item.raw))
    },
    onDeselect(node, instanceId) {
      this.getSelectUser(this.$refs['tree-select'].selectedNodes.map(item => item.raw))
    },
    getSelectUser(rawItems) {
      this.selectUser = rawItems.filter((item) => {
        return item.id.indexOf('user') > -1
      })
    },
    showCountTag(node) {
      return node.isBranch
      // return node.isBranch && node.count.ALL_DESCENDANTS === node.count.LEAF_CHILDREN
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      console.log('onCh', this.checkedKeys.length)
      this.checkedKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.flex-wrap {
  display:flex;
  justify-content: space-between;
  height: 100%;
}
.flex-wrap .flex-item {
  flex-grow: 1
}
.col-border-right {
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #e8e8e8;
  height: 100%
}
</style>
