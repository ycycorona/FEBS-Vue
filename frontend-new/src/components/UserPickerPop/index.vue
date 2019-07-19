<template>
  <div class="UserPicker">
    <a-modal
      :width="600"
      title="选择接收用户"
      :body-style="{height: '500px'}"
      :visible="visible"
      :confirm-loading="confirmLoading"
      destroy-on-close
      @cancel="onClose"
      @ok="handSubmit"
    >
      <a-row :gutter="16" style="height:100%">
        <!-- <a-col :span="12" class="col-border-right">
          <div>123</div>
        </a-col> -->
        <a-col :span="24">
          <treeselect
            v-model="value"
            :always-open="true"
            value-consists-of="BRANCH_PRIORITY"
            :multiple="true"
            :options="options"
          />
        </a-col>
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
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      confirmLoading: false,
      value: [],
      options: []
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.$get('/test/tree-select-data')
      .then(r => {
        const data = r.data
        this.options.push(data)
      })
  },
  methods: {
    handSubmit() {
      this.confirmLoading = true
      setTimeout(() => {
        this.$emit('update:visible', false)
        this.confirmLoading = false
      }, 2000)
    },
    onClose() {
      this.$emit('update:visible', false)
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
