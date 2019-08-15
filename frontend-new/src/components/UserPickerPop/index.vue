<template>
  <div class="UserPicker">
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
          <treeselect
            ref="tree-select"
            v-model="treeValue"
            :readonly="true"
            :always-open="true"
            value-consists-of="BRANCH_PRIORITY"
            :multiple="true"
            placeholder="请选择人员"
            :options="options"
            :default-expand-level="Infinity"
            :show-count="true"
            @select="onTreeSelect"
            @deselect="onDeselect"
          >
            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
              {{ node.label }}
              <!-- {{ node.isBranch ? 'Branch' : 'Leaf' }}: {{ node.label }} -->
              <!-- {{ console.log(node) }} -->
              <span v-if="showCountTag(node)" :class="countClassName">({{ count }})</span>
            </label>
          </treeselect>
        </a-col>
        <!-- <a-col :span="12">
          <div>123</div>
        </a-col> -->
      </a-row>
    </a-modal>
  </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'UserPickerPop',
  components: { Treeselect },
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
      console
    }
  },
  computed: {

  },
  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
        // 显示
          this.treeValue = [].concat(this.value)
        } else {
        // 销毁
          this.selectUser = []
        }
      }
    }
  },
  created() {
    this.$get('/business/cmd-strategy/getAllTree')
      .then(r => {
        const data = r.data.data
        // data.isDisabled = true
        this.options = data
      })
  },
  methods: {
    handSubmit() {
      this.confirmLoading = true
      setTimeout(() => {
        this.$emit('update:visible', false)
        this.$emit('success', this.selectUser)
        this.confirmLoading = false
      }, 2000)
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
