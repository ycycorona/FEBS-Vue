<template>
  <a-spin :spinning="loading">
    <div class="app-white-list-tab">
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
      <div style="margin-bottom:10px">
        <a-popconfirm
          title="确认删除吗?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="doDelItems"
        >
          <a-button :disabled="selectedRowKeys.length===0" type="danger">删除</a-button>
        </a-popconfirm>
      </div>
      <a-table
        ref="app-white-list-tab-table"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :row-key="record => record.id"
        :columns="columns"
        :scroll="{x: 1200}"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
      >
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
        </template>
      </a-table>
      <CreateWhiteAppListPop
        :visible.sync="createWhiteAppListPopVisible"
        :is-edit.sync="isEdit"
        :edit-id.sync="editId"
        @close="handleCreateWhiteAppListClose"
        @success="handleCreateWhiteAppListSuccess"
      ></CreateWhiteAppListPop>
    </div>
  </a-spin>

</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import CreateWhiteAppListPop from './components/CreateWhiteAppListPop'
import { configSerialize } from '@/utils/common'
export default {
  name: 'AppWhiteList',
  components: { IconEdit, IconDelete, CreateWhiteAppListPop },
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
          dataIndex: 'createUserName'
        },
        {
          title: '添加时间',
          dataIndex: 'createTime'
        },
        {
          title: '备注',
          dataIndex: 'description'
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
      createWhiteAppListPopVisible: false,
      isEdit: false,
      editId: '',
      selectedRowKeys: []
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
      this.$get('/business/black-white-app/getAppListByPage', {
        ...params, type: 1
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
    // 打开新建弹窗
    openCreate() {
      this.createWhiteAppListPopVisible = true
    },
    // 打开编辑弹窗
    openEditPop(id) {
      this.editId = id
      this.isEdit = true
      this.createWhiteAppListPopVisible = true
    },
    // 编辑弹窗关闭
    handleCreateWhiteAppListClose() {

    },
    // 保存成功
    handleCreateWhiteAppListSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    // 删除
    dodelItem(id) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$delete('/business/black-white-app/deleteBlackWhiteAppById', {
          appId: id
        })
          .then(r => {
            resolve(r.data.data)
            this.$message.info('删除成功')
            this.fetch({ pageSize: 10, pageNum: 1 })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    doDelItems() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$delete('/business/black-white-app/deleteBlackWhiteAppByBatch', {
          appIds: configSerialize(this.selectedRowKeys)
        })
          .then(r => {
            resolve(r.data.data)
            this.$message.info('删除成功')
            this.fetch({ pageSize: 10, pageNum: 1 })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
