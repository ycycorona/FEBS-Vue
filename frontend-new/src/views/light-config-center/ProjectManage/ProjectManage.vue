<template>
  <div class="standard-search-table-wrap table-page-search-wrapper full-width project-manage-page-wrap">
    <!-- 表单区域 -->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="8" :xl="6">
          <a-form-item label="项目名称">
            <a-input
              v-decorator="[
                'projectName'
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
      <template slot="position" slot-scope="record">
        <span class="bold">经度:</span>{{ record.lng }}<span class="padding-left bold">纬度:</span>{{ record.lat }}
      </template>
      <template slot="operation" slot-scope="record">
        <span class="operation-btn" @click="openEditPop(record.id)"><icon-edit title="修改" />编辑</span>
        <!-- <a-popconfirm
            title="确认删除吗?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="dodelItem(record.id)"
          >
            <span class="operation-btn"><icon-delete title="删除" />删除</span>
          </a-popconfirm> -->
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
import ProjectDetailPopContent from '@/views/light-config-center/ProjectManage/components/ProjectDetailPopContent'
import { getDetail as getCityById, del as deleteCityByIds, getList } from '@/service/cityManageService'
const PopTitleMap = new Map([
  ['create', '添加项目'],
  ['edit', '编辑项目']
])
export default {
  name: 'ProjectManage',
  components: { IconEdit, IconDelete, CommonDrawerWrap, ProjectDetailPopContent },
  filters: {

  },
  props: {},
  data() {
    return {
      filterForm: this.$form.createForm(this),
      columns: [
        {
          title: '项目名称',
          dataIndex: 'province'
        },
        {
          title: '城市',
          dataIndex: 'name'
        },
        {
          title: '城市定位',
          scopedSlots: { customRender: 'position' }
        },
        {
          title: '项目数',
          dataIndex: 'projectNum'
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
      currentCommandPop: ProjectDetailPopContent
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
      params.projectName = values.projectName
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
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
      this.detailData = await getCityById(id)
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
      await deleteCityByIds(configSerialize(this.selectedRowKeys))
      this.$message.info('删除成功')
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 生成excel报表
    exportExcel() {
      this.$download('/business/city/export_AllCity')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
