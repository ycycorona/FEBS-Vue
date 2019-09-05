<template>
  <div class="device-list-pop">
    <a-modal
      :width="1200"
      title="设备查看"
      :body-style="{height: '500px'}"
      :visible="visible"
      destroy-on-close
      :footer="null"
      @cancel="onClose"
    >
      <a-row :gutter="16" style="height:100%">
        <a-col :span="24">
          <a-table
            ref="device-list-pop-table"
            :row-key="record => record.id"
            :columns="columns"
            :scroll="{x: 1100}"
            :data-source="dataSource"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <template slot="strategyStatus" slot-scope="strategyStatus">
              <span :class="{'red-text': [0,3,6,8].findIndex(item => item===strategyStatus) !== -1}">
                {{ strategyStatus | strategyToDeviceStatusFil(type) }}
              </span>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
const URLList = [
  '',
  '/business/cmd-strategy/getPickPhones',
  '/business/cmd-strategy/getPickPhones'
]
export default {
  name: 'DeviceListPop',
  components: { },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    strategyId: {
      type: [String, Number]
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      reqURL: '',
      columns: [
        {
          title: '设备名称',
          dataIndex: 'phoneModel'
        },
        {
          title: '用户名',
          dataIndex: 'username',
          scopedSlots: { customRender: 'strategyType' }
        },
        {
          title: 'IMEI',
          dataIndex: 'phoneImei'
        },
        {
          title: '状态',
          dataIndex: 'strategyStatus',
          scopedSlots: { customRender: 'strategyStatus' }
        }],
      loading: false,
      dataSource: null,
      pagination: {
        total: 0,
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      }
    }
  },
  computed: {

  },
  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
        // 显示
          this.reqURL = URLList[this.type]
          this.fetch({ pageSize: 10, pageNum: 1 })
        } else {
        // 销毁
          this.dataSource = null
          this.reqURL = ''
        }
      }
    }
  },
  created() {

  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    handleTableChange() {

    },
    fetch(params = {}) {
      params.strategyId = this.strategyId
      // 显示loading
      this.loading = true
      this.$get(this.reqURL, {
        ...params
      }).then((r) => {
        const data = r.data
        const pagination = { ...this.pagination }
        this.dataSource = data.rows || []
        pagination.total = data.total
        this.pagination = pagination
      }).catch()
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.flex-wrap {
  display:flex;
  justify-content: space-between;
  height: 100%;
}
.flex-wrap .flex-item {
  flex-grow: 1
}
.col-border-right {
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #e8e8e8;
  height: 100%
}
.red-text {
  color: red
}
</style>
