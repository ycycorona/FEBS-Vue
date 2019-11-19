<template>
  <div class="standard-search-table-wrap table-page-search-wrapper full-width light-profile-manage-page-wrap">
    <!-- 表单区域 -->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="8" :xl="6">
          <a-form-item label="定时策略名称">
            <a-input
              v-decorator="[
                'lightProfileName'
              ]"
            />
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
    <!-- 操作按钮 -->
    <div class="float-add-btn-wrap">
      <a-popconfirm
        title="确认删除吗?"
        ok-text="删除"
        cancel-text="取消"
        @confirm="doDelItems"
      >
        <a-button class="operation-btn" :disabled="selectedRowKeys.length===0" type="danger">删除</a-button>
      </a-popconfirm>
      <a-button type="primary" @click="exportExcel">生成报表</a-button>
      <div class="float-add-btn" style="margin-bottom:10px">
        <a-button
          type="primary"
          style="border-radius:45px!important;"
          @click="openCreate"
        >
          <a-icon type="plus" /><span style="margin-left: 3px;">添加</span>
        </a-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <a-table
      ref="filter-table"
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
      </template>
    </a-table>
    <CommonDrawerWrap
      :detail-data.sync="detailData"
      :is-edit.sync="isEdit"
      :edit-id.sync="editId"
      :draw-width="800"
      :visible.sync="createEditPopVisible"
      :draw-title="currentCommandTitle"
      @close="handleCommandPopClose"
      @success="handleCommandPopSuccess"
    >
      <template v-slot:default="slotProps">
        <component :is="currentCommandPop" v-bind="slotProps"></component>
      </template>
    </CommonDrawerWrap>
  </div>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import { configSerialize } from '@/utils/common'
import CommonDrawerWrap from '@/views/light-control-center/components/LightControlTab/components/CommonDrawerWrap'
import LightProfileDetailPopContent from '@/views/light-config-center/LightProfileManage/components/LightProfileDetailPopContent'
import { getDetail, del, getList, exportExcel } from '@/service/lightProfileManageService'

const PopTitleMap = new Map([
  ['create', '添加定时策略'],
  ['edit', '编辑定时策略']
])
export default {
  name: 'LightProfileManage',
  components: { IconEdit, IconDelete, CommonDrawerWrap, LightProfileDetailPopContent },
  filters: {

  },
  props: {},
  data() {
    return {
      filterForm: this.$form.createForm(this),
      columns: [
        {
          title: '模式名称',
          dataIndex: 'name'
        },
        {
          title: '开灯时间',
          dataIndex: 'onTime'
        },
        {
          title: '熄灯时间',
          dataIndex: 'offTime'
        },
        {
          title: '延迟开灯时间',
          dataIndex: 'offset4on'
        },
        {
          title: '经纬度模式',
          dataIndex: 'offset4off'
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
      createEditPopVisible: false,
      currentCommandTitle: '',
      isEdit: false,
      editId: '',
      detailData: null,
      selectedRowKeys: [],
      currentCommandPop: LightProfileDetailPopContent
    }
  },
  computed: {

  },
  watch: {},

  async created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    search() {
      const values = this.filterForm.getFieldsValue()
      const params = {

      }
      params.lightProfileName = values.lightProfileName
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    handleTableChange(pagination, filters, sorter) {
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    async fetch(params = {}) {
      const data = await getList(params)
      const pagination = { ...this.pagination }
      this.dataSource = data.rows
      pagination.total = data.total
      this.pagination = pagination
      this.selectedRowKeys = []
    },
    // 打开新建弹窗
    openCreate() {
      this.currentCommandTitle = PopTitleMap.get('create')
      this.createEditPopVisible = true
    },
    // 打开编辑弹窗
    async openEditPop(id) {
      this.currentCommandTitle = PopTitleMap.get('edit')
      this.detailData = await getDetail(id)
      this.editId = id
      this.isEdit = true
      this.createEditPopVisible = true
    },
    // 编辑弹窗关闭
    handleCommandPopClose() {

    },
    // 保存成功
    handleCommandPopSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    // 删除
    async doDelItems() {
      await del(configSerialize(this.selectedRowKeys))
      this.$message.info('删除成功')
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 生成excel报表
    exportExcel() {
      const values = this.filterForm.getFieldsValue()
      const params = {

      }
      params.lightTypeName = values.lightTypeName
      exportExcel(params)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
