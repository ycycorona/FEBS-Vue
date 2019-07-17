<template>
  <div class="tree-select">
    <a-card title="人员选择" class="card">
      <treeselect
        v-model="value"
        :always-open="true"
        :append-to-body="true"
        value-consists-of="BRANCH_PRIORITY"
        :multiple="true"
        :options="options"
      />
    </a-card>
  </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'TreeSelectTest',
  components: { Treeselect },
  props: {},
  data() {
    return {
      activeKey: 'template',
      // define the default value
      value: [],
      // define options
      options: [

      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.$get('/test/tree-select-data')
      .then(r => {
        const data = r.data
        this.options.push(data)
      })
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.tree-select .card {
  width: 50%;
  min-height: 500px
}
</style>
