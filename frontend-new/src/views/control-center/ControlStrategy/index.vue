<template>
  <div class="full-width">
    <!-- <a-tabs default-active-key="controlStrategy" class="full-width-tab" @change="onTabChange">
      <a-tab-pane key="controlStrategy" tab="管控策略">
      </a-tab-pane>
      <a-tab-pane key="sendHistory" tab="下发历史">
        <strategy-send-history></strategy-send-history>
      </a-tab-pane>
    </a-tabs> -->
    <control-strategy-tab></control-strategy-tab>
  </div>
</template>

<script>
import ControlStrategyTab from './components/ControlStrategyTab'
export default {
  name: 'ControlStrategyWrap',
  components: { ControlStrategyTab },
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
