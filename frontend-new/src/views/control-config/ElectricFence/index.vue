<template>
  <div class="electric-fence-list full-width table-page-search-wrapper">
    <div class="float-add-btn-wrap">
      <div class="left-text">
        <span>电子围栏配置</span>
      </div>
      <div class="float-add-btn">
        <a-button
          type="primary"
          style="border-radius:45px!important;"
          @click="createElectricFencePop"
        >
          <a-icon type="plus" @click="createElectricFencePopVisiable=true" /><span style="margin-left: 3px;">新建电子围栏</span>
        </a-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <a-table
      ref="electric-fence-list-table"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="rule" slot-scope="rule">
        <span>{{ rule | fenceTypeFil }}</span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <span class="operation-btn" @click="editElectricFencePop(record.id)"><icon-edit title="修改" />编辑</span>
        <a-popconfirm
          title="确认删除吗?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="dodelItem(record.id)"
        >
          <span class="operation-btn"><icon-delete title="删除" />删除</span>
        </a-popconfirm>
      </template>
    </a-table>
    <create-electric-fence-pop
      :visible.sync="createElectricFencePopVisiable"
      :edit-id.sync="currentEditId"
      :is-edit.sync="isEdit"
      @success="handleCreateElectricFenceSuccess"
    ></create-electric-fence-pop>
  </div>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import CreateElectricFencePop from './components/CreateElectricFencePop/CreateElectricFencePop'
export default {
  name: 'ElectricFenceList',
  components: { IconEdit, IconDelete, CreateElectricFencePop },
  props: {},
  data() {
    return {
      columns: [
        {
          title: '电子围栏名称',
          dataIndex: 'fenceName'
        },
        {
          title: '性质',
          dataIndex: 'rule',
          scopedSlots: { customRender: 'rule' }
        },
        {
          title: '中心位置',
          dataIndex: 'centerName'
        },
        {
          title: '半径',
          dataIndex: 'radius'
        },
        {
          title: '经度',
          dataIndex: 'centerLng'
        },
        {
          title: '纬度',
          dataIndex: 'centerLat'
        },
        {
          title: '创建人',
          dataIndex: 'createName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
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
      createElectricFencePopVisiable: false,
      currentEditId: '',
      isEdit: false
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
      this.$get('/business/electronic-fence/getElectronicFenceListByPage', {
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
    createElectricFencePop() {
      this.createElectricFencePopVisiable = true
    },
    editElectricFencePop(fenceId) {
      this.isEdit = true
      this.currentEditId = fenceId
      this.createElectricFencePopVisiable = true
    },
    // 新建策略弹窗关闭
    handleCreateElectricFencePopClose() {

    },
    // 新建策略成功
    handleCreateElectricFenceSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    dodelItem(fenceId) {
      return new Promise((resolve, reject) => {
        this.$delete('/business/electronic-fence/deleteElectronicFence', {
          fenceId
        }).then(r => {
          resolve(r.data.data)
          this.$message.info('电子围栏删除成功')
          this.fetch({ pageSize: 10, pageNum: 1 })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
