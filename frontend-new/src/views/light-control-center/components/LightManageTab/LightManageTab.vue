<template>
  <a-spin :spinning="loading">
    <div class="light-manage-list-tab">
      <!-- 添加按钮 -->
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
      <div style="margin-bottom:10px" class="">
        <a-popconfirm
          title="确认删除吗?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="doDelItems"
        >
          <a-button style="margin-right:5px" :disabled="selectedRowKeys.length===0" type="danger">删除{{ Cons.LightName }}</a-button>
        </a-popconfirm>
        <a-popconfirm
          title="确认审核吗?"
          ok-text="审核"
          cancel-text="取消"
          @confirm="doApprove"
        >
          <a-button :disabled="selectedRowKeys.length===0" type="primary">审核{{ Cons.LightName }}</a-button>
        </a-popconfirm>
        <a v-if="!showSearchForm" style="margin-left: 8px" @click="toggleSearchForm">
          {{ showSearchForm ? '隐藏搜索框' : '搜索框' }}
          <a-icon :type="showSearchForm ? 'up' : 'down'" />
        </a>
      </div>
      <!-- 搜索框 -->
      <a-form v-if="showSearchForm" layout="inline" :form="filterForm">
        <a-row :gutter="24">
          <a-col :span="8" :xl="6">
            <a-form-item label="编组">
              <a-input
                v-decorator="[
                  'group'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" :xl="6">
            <span>
              <a-button style="margin-left: 15px" type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetFilterForm">重置</a-button>
              <a style="margin-left: 8px" @click="toggleSearchForm">
                {{ showSearchForm ? '隐藏搜索框' : '搜索框' }}
                <a-icon :type="showSearchForm ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
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
          <span class="operation-btn" @click="openReadonlyPop(record.id)"><a-icon type="eye" class="eye-icon" />查看</span>
          <span class="operation-btn" @click="openEditPop(record.id)"><icon-edit title="编辑" />编辑</span>

        </template>
      </a-table>
      <LightManageDetailPop
        :visible.sync="lightManageDetailPopVisible"
        :is-edit.sync="isEdit"
        :edit-id.sync="editId"
        :readonly.sync="popReadonly"
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
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'LightManageTab',
  components: { IconEdit, LightManageDetailPop },
  props: {},
  data() {
    return {
      filterForm: this.$form.createForm(this),
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
      popReadonly: false,
      editId: '',
      selectedRowKeys: [],
      formItemLayout,
      showSearchForm: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    toggleSearchForm() {
      this.showSearchForm = !this.showSearchForm
    },
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
    // 打开只读弹窗
    openReadonlyPop(id) {
      this.editId = id
      this.isEdit = true
      this.popReadonly = true
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
    doApprove() {

    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    search() {

    },
    resetFilterForm() {

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
