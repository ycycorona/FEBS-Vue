<template>
  <a-tree-select
    v-model="value"
    :allow-clear="true"
    :dropdown-style="{ maxHeight: '220px', overflow: 'auto' }"
    :tree-data="deptTreeData"
  />
</template>

<script>
export default {
  name: 'DetpInputTree',
  data() {
    return {
      deptTreeData: [],
      value: undefined
    }
  },
  watch: {
    value(value) {
      this.$emit('change', value)
    }
  },
  mounted() {
    this.$get('dept').then((r) => {
      this.deptTreeData = r.data.rows.children
    })
  },
  methods: {
    reset() {
      this.value = ''
    }
  }
}
</script>
