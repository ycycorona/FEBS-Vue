<template>
  <div class="full-width">
    <a-tabs default-active-key="directInstruction" class="full-width-tab" @change="onTabChange">
      <a-tab-pane key="directInstruction" tab="立即指令">
        <direct-instruction-tab></direct-instruction-tab>
      </a-tab-pane>
      <a-tab-pane key="sendHistory" tab="下发历史">
        <direct-instruction-send-history></direct-instruction-send-history>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import DirectInstructionTab from './components/DirectInstructionTab/DirectInstructionTab'
import DirectInstructionSendHistory from './components/DirectInstructionSendHistory/DirectInstructionSendHistory'
export default {
  name: 'DirectInstructionTabWrap',
  components: { DirectInstructionTab, DirectInstructionSendHistory },
  props: {},
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {

  },
  methods: {
    onTabChange() {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
