<template>
  <div class="strategy-send-history">
    <!-- 表格区域 -->
    <a-table
      ref="strategy-send-tab-table"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >

      <template slot="detail">
        <a-icon type="eye" theme="twoTone" two-tone-color="#42b983" title="详情" />
      </template>
      <template slot="receivedUserNum" slot-scope="receivedUserNum">
        <span>{{ receivedUserNum }}</span>
      </template>
      <template slot="receivedDeviceNum" slot-scope="receivedDeviceNum">
        <span>{{ receivedDeviceNum }}</span>
      </template>
    </a-table>
  </div>
</template>

<script>

export default {
  name: 'StrategySendHistory',
  components: { },
  props: {},
  data() {
    return {
      columns: [
        {
          title: '策略名称',
          dataIndex: 'strategyName',
          width: '15%'
        },
        {
          title: '创建人',
          dataIndex: 'createdBy',
          width: '10%'
        },
        {
          title: '下发人',
          dataIndex: 'sendUser',
          width: '15%'
        },
        {
          title: '下发时间',
          dataIndex: 'sendTime',
          width: '15%'
        },
        {
          title: '策略详情',
          width: '10%',
          scopedSlots: { customRender: 'detail' }
        },
        {
          title: '已下发用户',
          dataIndex: 'receivedUserNum',
          width: '15%',
          scopedSlots: { customRender: 'receivedUserNum' }
        },
        {
          title: '接收设备',
          dataIndex: 'receivedDeviceNum',
          width: '20%',
          scopedSlots: { customRender: 'receivedDeviceNum' }
        }
      ],
      pagination: {
        total: 0,
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      loading: false,
      dataSource: null
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    handleTableChange() {

    },
    fetch(params = {}) {
      // 显示loading
      this.loading = true
      this.$get('/control-strategy-send-history/list', {
        ...params
      }).then((r) => {
        const data = r.data
        const pagination = { ...this.pagination }
        this.dataSource = data.rows
        pagination.total = data.total
        this.pagination = pagination
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
