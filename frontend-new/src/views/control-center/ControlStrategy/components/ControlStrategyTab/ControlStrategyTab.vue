<template>
  <div class="control-strategy-tab table-page-search-wrapper">
    <div class="float-add-btn-wrap">
      <div class="float-add-btn">
        <a-button
          type="primary"
          style="border-radius:45px!important;"
          @click="createControlStrategyPop"
        >
          <a-icon type="plus" /><span style="margin-left: 3px;">新建管控策略</span>
        </a-button>
      </div>
    </div>
    <!-- 表单区域 -->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="8" :xl="6">
          <a-form-item label="策略名称">
            <a-input
              v-decorator="[
                'strategyName'
              ]"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" :xl="6">
          <a-form-item label="策略类型">
            <a-select
              v-decorator="['strategyType']"
              placeholder="策略类型"
              allow-clear
            >
              <a-select-option :value="0">长期策略</a-select-option>
              <a-select-option :value="1">临时策略</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
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
      ref="control-strategy-tab-table"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="operation" slot-scope="text, record">
        <span class="operation-btn" @click="openEditPop(record.id)"><icon-strategy-manage title="管控策略管理" />策略管理</span>
        <a-popconfirm title="确定删除吗?" ok-text="是" cancel-text="否" @confirm="deleteStrategy(record.id)">
          <span class="operation-btn"><icon-delete title="删除" />删除</span>
        </a-popconfirm>
      </template>
      <template slot="pickUserCount" slot-scope="pickUserCount, record">
        <span class="blue-click" @click="showUserCountPop(record.id)">{{ pickUserCount }}</span>
      </template>
      <template slot="deviceNum" slot-scope="record">
        <span class="blue-click" @click="showDeviceListPop(record.id)">{{ record.pickPhoneCount }}/{{ record.pickPhoneCount+record.failPhoneCount }}</span>
      </template>
      <template slot="strategyType" slot-scope="strategyType">
        <span>{{ strategyTypeShortMap[strategyType] }}</span>
      </template>
      <template slot="editRecord" slot-scope="record">
        <span class="normal-click" @click="showEditRecordsPop(record.id)">查看</span>
      </template>
    </a-table>
    <CreateControlStrategyPop
      :edit-id="editId"
      :is-edit-page.sync="isEdit"
      :visible.sync="controlStrategyPopVisible"
      @close="handleControlStrategyClose"
      @success="handleControlStrategySuccess"
    ></CreateControlStrategyPop>
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
      :visible.sync="deviceListPopVisible"
      :strategy-id.sync="editId"
    ></device-list-pop>
    <edit-records
      :visible.sync="editRecordsPopVisible"
      :strategy-id.sync="editId"
    >
    </edit-records>
  </div>
</template>

<script>
import { strategyTypeShortMap } from '@/utils/params'
import IconDelete from '@/components/icons/IconDelete'
import IconStrategyManage from '@/components/icons/IconStrategyManage'
import CreateControlStrategyPop from './CreateControlStrategyPop'
import UserPickerPop from '@/components/UserPickerPop'
import DeviceListPop from './components/DeviceList/DeviceListPop'
import EditRecords from './components/EditRecords/EditRecords'

export default {
  name: 'ControlStrategyTab',
  components: { IconDelete, CreateControlStrategyPop,
    IconStrategyManage, UserPickerPop, DeviceListPop, EditRecords
  },
  props: {},
  data() {
    return {
      filterForm: this.$form.createForm(this),
      columns: [
        {
          title: '策略名称',
          dataIndex: 'strategyName'
        },
        {
          title: '策略类型',
          dataIndex: 'strategyType',
          scopedSlots: { customRender: 'strategyType' }
        },
        {
          title: '创建人',
          dataIndex: 'createUserName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '已下发用户',
          dataIndex: 'pickUserCount',
          scopedSlots: { customRender: 'pickUserCount' }
        },
        {
          title: '未接收设备/全部设备',
          scopedSlots: { customRender: 'deviceNum' }
        },
        {
          title: '修改记录',
          scopedSlots: { customRender: 'editRecord' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
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
      controlStrategyPopVisible: false,
      isEdit: false,
      editId: '',
      strategyTypeShortMap,
      readUserSelectedPopVisible: false,
      deviceListPopVisible: false,
      editRecordsPopVisible: false,
      userPickerPopValue: []
    }
  },
  computed: {

  },
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
      params.strategyType = values.strategyType
      params.strategyName = values.strategyName
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
    },
    handleTableChange(pagination, filters, sorter) {
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    fetch(params = {}) {
      // 显示loading
      this.loading = true
      this.$get('/business/cmd-strategy/getStrategyByPage', {
        ...params
      }).then((r) => {
        const data = r.data
        const pagination = { ...this.pagination }
        this.dataSource = data.rows
        pagination.total = data.total
        this.pagination = pagination
      }).catch()
        .finally(() => {
          this.loading = false
        })
    },
    // 打开新建策略弹窗
    createControlStrategyPop() {
      this.controlStrategyPopVisible = true
    },
    // 打开编辑策略弹窗
    openEditPop(id) {
      this.editId = id
      this.isEdit = true
      this.controlStrategyPopVisible = true
    },
    // 策略弹窗关闭
    handleControlStrategyClose() {

    },
    // 策略新建/编辑成功
    handleControlStrategySuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    // 删除策略
    deleteStrategy(strategyId) {
      return new Promise((resolve, reject) => {
        this.$delete('/business/cmd-strategy/deleteByStrategyId', {
          strategyId
        })
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.message)
              this.$message.info('策略删除成功')
              this.fetch({ pageSize: 10, pageNum: 1 })
            } else {
              this.$error({
                title: '删除失败',
                content: res.data.message,
                onOk() {
                  this.fetch({ pageSize: 10, pageNum: 1 })
                }
              })
            }
          })
      })
    },
    // 查看已下发的用户
    showUserCountPop(id) {
      this.$get('/business/cmd-strategy/getPickUsers', {
        strategyId: id
      })
        .then(r => {
          if (r.data.state === 1) {
            this.userPickerPopValue = r.data.data
            this.readUserSelectedPopVisible = true
          }
        })
    },
    // 查看绑定设备列表
    showDeviceListPop(id) {
      this.editId = id
      this.deviceListPopVisible = true
    },
    // 查看修改记录
    showEditRecordsPop(id) {
      this.editId = id
      this.editRecordsPopVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
