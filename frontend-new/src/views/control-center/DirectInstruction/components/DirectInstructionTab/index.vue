<template>
  <div>
    <div>
      <a-button
        type="primary"
        style="border-radius:45px!important;"
        @click="openSendPop"
      >
        <icon-send-white title="下发" /><span style="margin-left: 3px;">下发</span>
      </a-button>
    </div>
    <!-- 表格区域 -->
    <a-table
      ref="direct-instruction-tab-table"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      style="width:50%;margin-top:10px"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 600}"
      :data-source="dataSource"
      :pagination="false"
      :loading="false"
      @change="handleTableChange"
    >
      <template v-slot:params="record">
        <!-- {{ record.id }} -->
        <a-select v-if="selectedRowKeys.findIndex(key => key===record.id)!==-1" default-value="lucy" style="width: 120px">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="disabled" disabled>Disabled</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
      </template>
    </a-table>
    <user-picker-pop :visible.sync="userPickerPopVisible"></user-picker-pop>
  </div>
</template>

<script>
import IconSendWhite from '@/components/icons/IconSendWhite'
import UserPickerPop from '@/components/UserPickerPop'
export default {
  name: 'DirectInstructionTab',
  components: { IconSendWhite, UserPickerPop },
  props: {},
  data() {
    return {
      selectedRowKeys: [],
      dataSource: [
        {
          id: 0,
          strategyName: '前摄像头拍照'
        },
        {
          id: 1,
          strategyName: '后置摄像头拍照'
        },
        {
          id: 2,
          strategyName: '开启WIFI'
        },
        {
          id: 3,
          strategyName: '关闭WIFI'
        }
      ],
      columns: [
        {
          title: '指令名称',
          dataIndex: 'strategyName'
        },
        {
          title: '指令参数',
          // dataIndex: 'params'
          scopedSlots: { customRender: 'params' }
        }
      ],
      userPickerPopVisible: false
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  methods: {
    handleTableChange() {

    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 打开下发弹窗
    openSendPop() {
      this.userPickerPopVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
