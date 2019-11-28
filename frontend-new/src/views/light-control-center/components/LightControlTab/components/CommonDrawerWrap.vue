<template>
  <a-drawer
    ref="draw"
    destroy-on-close
    :title="drawTitle"
    :mask-closable="false"
    :width="drawWidth"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
  >
    <slot name="default" v-bind="$props"></slot>
    <div class="drawer-bootom-button">

      <a-popconfirm v-if="!readonly" title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
        <a-button style="margin-right: .8rem">{{ cancelText || '取消' }}</a-button>
      </a-popconfirm>
      <a-button v-else style="margin-right: .8rem" @click="onClose">{{ cancelText || '取消' }}</a-button>
      <a-button v-if="!readonly" type="primary" @click="handleSubmit">{{ confirmText || '确定' }}</a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'CommonDrawerWrap',
  components: { },
  props: {
    confirmText: {
      default: '确定',
      type: String
    },
    cancelText: {
      default: '取消',
      type: String
    },
    drawWidth: {
      default: 600,
      type: Number
    },
    drawTitle: {
      default: 'test',
      type: String
    },
    visible: {
      default: false,
      type: Boolean
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    editId: {
      default: '',
      type: [String, Number]
    },
    readonly: {
      default: false,
      type: Boolean
    },
    detailData: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  computed: {
    currentPopContent() {
      return this.$store.state.contact.currentPopContent
    }
  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.$emit('update:isEdit', false)
      this.$emit('update:editId', '')
      this.$emit('update:detailData', null)
      setTimeout(() => {
        this.$emit('update:readonly', false)
      }, 1000)
    },
    async handleSubmit() {
      const submitFlag = await this.currentPopContent.handleSubmit()
      if (!submitFlag) { return }
      this.$emit('success')
      this.onClose()
    }
  }
}
</script>

<style lang="less" scoped>
// .ant-divider-horizontal {
//   margin: 12px 0;
// }
.drawer-bootom-button {
  z-index: 10;
}
</style>
