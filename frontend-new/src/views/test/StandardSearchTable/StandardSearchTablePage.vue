<template>
  <StandardSearchTable>
  </StandardSearchTable>
</template>

<script>
import StandardSearchTable from './StandardSearchTable'
export default {
  name: 'StandardSearchTablePage',
  components: { StandardSearchTable },
  props: {
    example: {
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
