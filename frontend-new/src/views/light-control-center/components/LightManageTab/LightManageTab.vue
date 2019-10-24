<template>
  <a-spin :spinning="loading">
    <div class="light-manage-list-tab">
      <div class="float-add-btn">
        <a-button
          type="primary"
          style="border-radius:45px!important;"
          @click="openCreate"
        >
          <a-icon type="plus" /><span style="margin-left: 3px;">添加{{ Cons.LightName }}</span>
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
          <a-button :disabled="selectedRowKeys.length===0" type="danger">删除{{ Cons.LightName }}</a-button>
        </a-popconfirm>
      </div>
      <a-table
        ref="light-manage-list-tab-table"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :row-key="record => record.id"
        :columns="columns"
        :scroll="{x: 1200}"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="operation" slot-scope="record">
          <span class="operation-btn"><a-icon type="eye" class="eye-icon" />查看</span>
          <span class="operation-btn"><icon-edit title="编辑" />编辑</span>

        </template>
      </a-table>
      <LightManageDetailPop
        :visible.sync="lightManageDetailPopVisible"
        :is-edit.sync="isEdit"
        :edit-id.sync="editId"
        @close="handleEditPopClose"
        @success="handleEditPopSuccess"
      ></LightManageDetailPop>
    </div>
  </a-spin>

</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import LightManageDetailPop from './components/LightManageDetailPop'
// import { configSerialize } from '@/utils/common'
import { LightName } from '@/config/LightConstant'
export default {
  name: 'LightManageTab',
  components: { IconEdit, LightManageDetailPop },
  props: {},
  data() {
    return {
      Cons: {
        LightName
      },
      columns: [
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '网关名称',
          dataIndex: 'gatewayName'
        },
        {
          title: '编组名称',
          dataIndex: 'groupName'
        },
        {
          title: '智能灯编号',
          dataIndex: 'lightId'
        },
        {
          title: '审核状态',
          dataIndex: 'approveStatus'
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
      lightManageDetailPopVisible: false,
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
      this.$get('/light-control-center/light-manage/list', {
        ...params, type: 0
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
      this.lightManageDetailPopVisible = true
    },
    // 打开编辑弹窗
    openEditPop(id) {
      this.editId = id
      this.isEdit = true
      this.lightManageDetailPopVisible = true
    },
    // 编辑弹窗关闭
    handleEditPopClose() {

    },
    // 保存成功
    handleEditPopSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    // 删除
    doDelItems() {
      this.loading = true
      return new Promise((resolve, reject) => {
        resolve()
        // this.$delete('/business/black-white-app/deleteBlackWhiteAppByBatch', {
        //   appIds: configSerialize(this.selectedRowKeys)
        // })
        //   .then(r => {
        //     resolve(r.data.data)
        //     this.$message.info('删除成功')
        //     this.fetch({ pageSize: 10, pageNum: 1 })
        //   })
        //   .finally(() => {
        //     this.loading = false
        //   })
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
