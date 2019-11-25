<template>
  <div class="device-manage-page">
    <div class="float-add-btn-wrap">
      <div class="float-add-btn">
        <a-button
          type="primary"
          style="border-radius:45px!important;"
          @click="openCreate"
        >
          <a-icon type="plus" /><span style="margin-left: 3px;">添加设备</span></a-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <a-table
      ref="device-manage-list--table"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="linestate" slot-scope="linestate">
        <a-tag :color="linestate | deviceStatusColorFil">{{ linestate | deviceStatusFil }}</a-tag>
      </template>
      <template slot="operation" slot-scope="record">
        <span class="operation-btn" @click="openEditPop(record.id)"><icon-edit title="修改" />编辑</span>
        <a-popconfirm
          title="确认删除吗?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="dodelItem(record.id)"
        >
          <span class="operation-btn"><icon-delete title="删除" />删除</span>
        </a-popconfirm>
        <a-popconfirm
          title="确认擦除数据吗?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="doClearItemData(record.id)"
        >
          <span class="operation-btn"><icon-delete title="一键擦除" />一键擦除</span>
        </a-popconfirm>
      </template>
    </a-table>
    <AddDevicesPop
      :user-id="userId"
      :edit-id.sync="editId"
      :is-edit-page.sync="isEditPop"
      :visible.sync="createDeviceVisiable"
      @success="createDeviceSuccess"
    ></AddDevicesPop>
  </div>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import AddDevicesPop from './AddDevicesPop'
export default {
  name: 'DevicesManage',
  components: { IconEdit, IconDelete, AddDevicesPop },
  props: {
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      columns: [
        {
          title: '设备型号',
          dataIndex: 'phoneModel'
        },
        {
          title: '设备IMEI',
          dataIndex: 'phoneImei'
        },
        {
          title: '手机号',
          dataIndex: 'phoneNumber'
        },
        {
          title: '状态',
          dataIndex: 'linestate',
          scopedSlots: { customRender: 'linestate' }
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
      createDeviceVisiable: false,
      isEditPop: false,
      editId: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    fetch(params = {}) {
      params.userId = this.userId
      // 显示loading
      this.loading = true
      this.$get('/business/controlUserStatus/getAllPhonesByUserid', {
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
    // 打开新建弹窗
    openCreate() {
      this.createDeviceVisiable = true
    },
    // 打开编辑弹窗
    openEditPop(deviceId) {
      this.isEditPop = true
      this.editId = deviceId
      this.createDeviceVisiable = true
    },
    // 删除设备
    dodelItem(deviceId) {
      return new Promise((resolve, reject) => {
        this.$delete('/business/controlUserStatus/deletePhoneById', {
          phoneId: deviceId
        }).then(r => {
          resolve(r.data.data)
          this.$message.info('设备删除成功')
          this.fetch({ pageSize: 10, pageNum: 1 })
        })
      })
    },
    // 擦除设备数据
    doClearItemData(deviceId) {
      this.$message.info('设备数据擦除成功')
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    createDeviceSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
      this.$message.info('设备状态保存成功')
    }
  }
}
</script>

<style lang="less" scoped>

.float-add-btn-wrap {
  height: 45px;
  position: relative;
  .float-add-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
