<template>
  <div>
    <a-tabs default-active-key="controlStrategy" @change="onTabChange">
      <a-tab-pane key="controlStrategy" tab="管控策略">管控策略</a-tab-pane>
      <a-tab-pane key="sendHistory" tab="下发历史">下发历史</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: 'ControlStrategyWrap',
  components: {},
  props: {

  },
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    onTabChange() {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
