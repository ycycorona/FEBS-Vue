<template>
  <a-drawer
    destroy-on-close
    :title="drawTitle"
    :mask-closable="false"
    width="800"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <slot></slot>
  </a-drawer>
</template>

<script>

export default {
  name: 'CommonDrawerWrap',
  components: { },
  props: {
    drawTitle: {
      default: '',
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
    }
  },
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  beforeCreate() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.ant-divider-horizontal {
  margin: 12px 0;
}
.drawer-bootom-button {
  z-index: 10;
}
</style>
