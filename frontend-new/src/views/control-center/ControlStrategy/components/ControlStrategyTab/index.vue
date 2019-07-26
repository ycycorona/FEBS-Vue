<template>
  <div class="control-strategy-tab">
    <div class="float-add-btn">
      <a-button
        type="primary"
        style="border-radius:45px!important;"
        @click="createControlStrategyPop"
      >
        <a-icon type="plus" /><span style="margin-left: 3px;">新建管控策略</span>
      </a-button>
    </div>
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
      <template slot="detail" slot-scope="text">
        <a-icon type="eye" theme="twoTone" two-tone-color="#42b983" title="详情" @click="detailPop" />
      </template>
      <template slot="operation" slot-scope="text, record">
        <span class="operation-btn" @click="openSendPop"><icon-send title="下发" />下发</span>
        <span class="operation-btn" @click="openEditPop"><icon-edit title="修改" />编辑</span>
        <span class="operation-btn" @click="openDelPop"><icon-delete title="删除" />删除</span>
      </template>
      <template slot="receivedUserNum" slot-scope="receivedUserNum">
        <span>{{ receivedUserNum }}</span>
      </template>
      <template slot="receivedDeviceNum" slot-scope="receivedDeviceNum">
        <span>{{ receivedDeviceNum }}</span>
      </template>
      <template slot="strategyType" slot-scope="strategyType">
        <span>长期</span>
      </template>
    </a-table>
    <CreateControlStrategyPop
      :create-control-strategy-pop-visiable="createControlStrategyPopVisiable"
      @close="handleCreateControlStrategyClose"
      @success="handleCreateControlStrategySuccess"
    ></CreateControlStrategyPop>
    <user-picker-pop :visible.sync="userPickerPopVisible"></user-picker-pop>
  </div>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import IconSend from '@/components/icons/IconSend'
import CreateControlStrategyPop from './CreateControlStrategyPop'
import UserPickerPop from '@/components/UserPickerPop'
export default {
  name: 'ControlStrategyTab',
  components: { IconEdit, IconDelete, IconSend, CreateControlStrategyPop,
    UserPickerPop },
  props: {},
  data() {
    return {
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
          dataIndex: 'createdBy'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '修改时间',
          dataIndex: 'editTime'
        },
        {
          title: '已下发用户',
          dataIndex: 'receivedUserNum',
          scopedSlots: { customRender: 'receivedUserNum' }
        },
        {
          title: '接收设备',
          dataIndex: 'receivedDeviceNum',
          scopedSlots: { customRender: 'receivedDeviceNum' }
        },
        {
          title: '详情',
          scopedSlots: { customRender: 'detail' }
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
      createControlStrategyPopVisiable: false,
      userPickerPopVisible: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    fetch(params = {}) {
      // 显示loading
      this.loading = true
      this.$get('/control-strategy/list', {
        ...params
      }).then((r) => {
        const data = r.data
        const pagination = { ...this.pagination }
        this.dataSource = data.rows
        pagination.total = data.total
        this.pagination = pagination
        this.loading = false
      })
    },
    // 打开新建控制策略弹窗
    createControlStrategyPop() {
      this.createControlStrategyPopVisiable = true
    },
    // 新建策略弹窗关闭
    handleCreateControlStrategyClose() {
      this.createControlStrategyPopVisiable = false
    },
    // 新建策略成功
    handleCreateControlStrategySuccess() {
      this.createControlStrategyPopVisiable = false
    },
    // 查看详情弹窗
    detailPop() {

    },
    // 打开下发弹窗
    openSendPop() {
      this.userPickerPopVisible = true
    },
    // 打开编辑策略弹窗
    openEditPop() {

    },
    // 打开删除策略弹窗
    openDelPop() {

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
