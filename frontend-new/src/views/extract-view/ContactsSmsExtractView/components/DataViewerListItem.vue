<template>
  <div :class="{selected}" class="data-viewer-list-item">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'DataViewerListItem',
  components: { },
  props: {
    selected: {
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
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
