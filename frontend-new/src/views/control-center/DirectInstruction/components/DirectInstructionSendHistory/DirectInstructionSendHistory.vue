<template>
  <div class="direct-instruction-sendHistory table-page-search-wrapper">
    <!-- 表单区域 -->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="8" :xl="6">
          <a-form-item label="日期">
            <a-range-picker
              v-decorator="['dateRange']"
            >
            </a-range-picker>
          </a-form-item>
        </a-col>
        <a-col :span="8" :xl="6">
          <span>
            <a-button style="margin-left: 15px" type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetFilterForm">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <!-- 表格区域 -->
    <a-table
      ref="direct-instruction-sendHistory-table"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :loading="loading"
      :data-source="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="pickUserCount" slot-scope="pickUserCount, record">
        <span class="blue-click" @click="showUserCountPop(record.id)">{{ pickUserCount }}</span>
      </template>
      <template slot="phoneCount" slot-scope="record">
        <span class="blue-click" @click="showDeviceCountPop(record.id)">{{ record.unreceivedPhoneCount }}/{{ record.pickPhoneCount }}</span>
      </template>
    </a-table>
    <user-picker-pop
      ref="userPickerPop"
      model-title="已下发人员"
      :opt="{footer: null}"
      :read-only="true"
      :value="userPickerPopValue"
      :visible.sync="readUserSelectedPopVisible"
      @close="userPickerPopValue=[];"
    ></user-picker-pop>
    <!-- 设备列表 -->
    <device-list-pop
      :type="2"
      :visible.sync="deviceListPopVisible"
      :strategy-id.sync="editId"
    ></device-list-pop>
  </div>
</template>

<script>
import { configSerialize } from '@/utils/common'
import UserPickerPop from '@/components/UserPickerPop'
import DeviceListPop from '@/components/DeviceList/DeviceListPop'
export default {
  name: 'DirectInstructionSendHistory',
  components: { UserPickerPop, DeviceListPop },
  props: {},
  data() {
    return {
      filterForm: this.$form.createForm(this),
      columns: [
        {
          title: '指令类型',
          dataIndex: 'typeName'
        },
        {
          title: '指令名称',
          dataIndex: 'configName'
        },
        {
          title: '下发人',
          dataIndex: 'sendUserName'
        },
        {
          title: '下发时间',
          dataIndex: 'sendTime'
        },
        {
          title: '已下发用户',
          dataIndex: 'pickUserCount',
          scopedSlots: { customRender: 'pickUserCount' }
        },
        {
          title: '未接受设备/全部设备',
          scopedSlots: { customRender: 'phoneCount' }
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
      dataSource: null,
      userPickerPopValue: [],
      readUserSelectedPopVisible: false,
      editId: '',
      deviceListPopVisible: false

    }
  },
  computed: {},
  watch: {},
  created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    search() {
      const values = this.filterForm.getFieldsValue()
      const params = {

      }

      if (values.dateRange) {
        params.startDate = values.dateRange[0].format('YYYY-MM-DD')
        params.endDate = values.dateRange[1].format('YYYY-MM-DD')
      }
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    fetch(params = {}) {
      // 显示loading
      this.loading = true
      this.$get('/business/instant-send-record/getInstantRecordListByPage', {
        ...params
      }).then((r) => {
        const data = r.data
        const pagination = { ...this.pagination }
        this.dataSource = data.rows
        pagination.total = data.total
        this.pagination = pagination
      }).finally(() => {
        this.loading = false
      })
    },
    showUserCountPop(id) {
      this.$get('/business/instant-send-record/getPickUsers', {
        recordId: id
      })
        .then(r => {
          if (r.data.state === 1) {
            this.userPickerPopValue = r.data.data
            this.readUserSelectedPopVisible = true
          }
        })
    },
    showDeviceCountPop(id) {
      this.editId = id
      this.deviceListPopVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

.float-add-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
