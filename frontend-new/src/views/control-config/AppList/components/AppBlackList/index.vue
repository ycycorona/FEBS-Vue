<template>
  <div class="app-black-list-tab">
    <div class="float-add-btn">
      <a-button
        type="primary"
        style="border-radius:45px!important;"
        @click="openCreate"
      >
        <a-icon type="plus" /><span style="margin-left: 3px;">添加应用黑名单</span>
      </a-button>
    </div>
    <!-- 表格区域 -->
    <a-table
      ref="app-black-list-tab-table"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="operation" slot-scope="text, record">
        <span class="operation-btn" @click="openEditPop"><icon-edit title="修改" />编辑</span>
        <a-popconfirm
          title="确认删除吗?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="dodelItem"
        >
          <span class="operation-btn"><icon-delete title="删除" />删除</span>
        </a-popconfirm>

      </template>
    </a-table>
    <CreateBlackAppListPop
      :visiable="createBlackAppListPopVisiable"
      @close="handleCreateBlackAppListClose"
      @success="handleCreateBlackAppListSuccess"
    ></CreateBlackAppListPop>
  </div>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import CreateBlackAppListPop from './components/CreateBlackAppListPop'
export default {
  name: 'AppBlackList',
  components: { IconEdit, IconDelete, CreateBlackAppListPop },
  props: {},
  data() {
    return {
      columns: [
        {
          title: '应用名称',
          dataIndex: 'appName'
        },
        {
          title: '包名',
          dataIndex: 'packageName'
        },
        {
          title: '创建人',
          dataIndex: 'createdBy'
        },
        {
          title: '添加时间',
          dataIndex: 'createTime'
        },
        {
          title: '备注',
          dataIndex: 'remark'
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
      createBlackAppListPopVisiable: false
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
      this.$get('/control-config/black-app-list/list', {
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
    openCreate() {
      this.createBlackAppListPopVisiable = true
    },
    // 新建策略弹窗关闭
    handleCreateBlackAppListClose() {
      this.createBlackAppListPopVisiable = false
    },
    // 新建策略成功
    handleCreateBlackAppListSuccess() {
      this.createBlackAppListPopVisiable = false
    },
    // 打开编辑策略弹窗
    openEditPop() {

    },
    // 删除策略
    dodelItem() {
      this.$message.info('策略删除成功')
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
