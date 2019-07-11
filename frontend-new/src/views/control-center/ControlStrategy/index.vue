<template>
  <div>
    <a-tabs defaultActiveKey="controlStrategy" @change="onTabChange">
      <a-tab-pane tab="管控策略" key="controlStrategy">管控策略</a-tab-pane>
      <a-tab-pane tab="下发历史" key="sendHistory">下发历史</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: 'ControlStrategyWrap',
  props: {

  },
  components: {},
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    onTabChange () {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
