<template>
  <div class="standard-search-table-wrap table-page-search-wrapper full-width light-firmware-manage-tab-wrap">
    <!-- 表单区域 -->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="8" :xl="6">
          <a-form-item label="文件名称">
            <a-input
              v-decorator="[
                'versionName'
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
      <a-button type="primary" @click="refresh">刷新</a-button>
      <!-- <a-button type="primary" @click="exportExcel">生成报表</a-button> -->
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
        <span class="operation-btn" @click="openUpdateFirmwarePop(record.id)"><a-icon type="setting" style="color:rgb(30, 191, 77)" />升级</span>
      </template>
    </a-table>
    <CommonDrawerWrap
      :confirm-text="currentCommandConfirmText"
      :cancel-text="currentCommandCancelText"
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
        <component :is="currentCommandPop" v-bind="slotProps" :file-type="FileType" :project-opt="projectOpt"></component>
      </template>
    </CommonDrawerWrap>
  </div>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import { configSerialize } from '@/utils/common'
import CommonDrawerWrap from '@/views/light-control-center/components/LightControlTab/components/CommonDrawerWrap'
import FirmwareDetailPopContent from '@/views/light-config-center/FirmwareManage/components/FrimwareDetailPopContent'
import LightFirmwareUpdatePopContent from '@/views/light-config-center/FirmwareManage/components/LightFirmwareUpdatePopContent'
import { getDetail, del, getList } from '@/service/firmwareManageService'
import { getListOptProcessed as getProjectOptProcessed } from '@/service/projectManageService'

const PopTitleMap = new Map([
  ['create', '添加控制器固件'],
  ['edit', '编辑控制器固件'],
  ['update', '控制器固件升级']
])
const PopTitleConfirmText = new Map([
  ['update', '升级固件']
])
const FileType = 2
export default {
  name: 'LightFirmwareTab',
  components: { IconEdit, IconDelete, CommonDrawerWrap, FirmwareDetailPopContent },
  filters: {

  },
  props: {},
  data() {
    return {
      filterForm: this.$form.createForm(this), FileType,
      columns: [
        {
          title: '文件名',
          dataIndex: 'versionName'
        },
        {
          title: '版本号',
          dataIndex: 'version'
        },
        {
          title: '上传时间',
          dataIndex: 'uploadTime'
        },
        {
          title: '文件大小',
          dataIndex: 'size'
        },
        {
          title: '备注',
          dataIndex: 'descr'
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
      currentCommandConfirmText: '',
      currentCommandCancelText: '',
      isEdit: false,
      editId: '',
      detailData: null,
      selectedRowKeys: [],
      currentCommandPop: FirmwareDetailPopContent,
      projectOpt: []
    }
  },
  computed: {

  },
  watch: {},

  async created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    search(obj = null) {
      const values = this.filterForm.getFieldsValue()
      const params = {

      }
      params.versionName = values.versionName
      if (obj) {
        Object.assign(params, obj)
      }
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }))
    },
    refresh() {
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    resetFilterForm() {
      this.filterForm.resetFields()
      this.search()
    },
    handleTableChange(pagination, filters, sorter) {
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    async fetch(params = {}) {
      const data = await getList(Object.assign(params, { fileType: FileType }))
      const pagination = { ...this.pagination }
      this.dataSource = data.rows
      pagination.total = data.total
      this.pagination = pagination
      this.selectedRowKeys = []
    },
    // 打开新建弹窗
    openCreate() {
      this.currentCommandPop = FirmwareDetailPopContent
      this.currentCommandTitle = PopTitleMap.get('create')
      this.createEditPopVisible = true
    },
    // 打开编辑弹窗
    async openEditPop(id) {
      this.currentCommandPop = FirmwareDetailPopContent
      this.currentCommandTitle = PopTitleMap.get('edit')
      this.detailData = await getDetail(id)
      this.editId = id
      this.isEdit = true
      this.createEditPopVisible = true
    },
    openUpdatePop() {

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
    // exportExcel() {
    //   const values = this.filterForm.getFieldsValue()
    //   const params = {

    //   }
    //   params.lightTypeName = values.lightTypeName
    //   exportExcel(params)
    // },
    // 打开升级下发弹窗
    async openUpdateFirmwarePop(id) {
      this.currentCommandPop = LightFirmwareUpdatePopContent
      this.currentCommandConfirmText = PopTitleConfirmText.get('update')
      this.currentCommandTitle = PopTitleMap.get('update')
      this.detailData = await getDetail(id)
      this.projectOpt = await getProjectOptProcessed()
      this.editId = id
      this.isEdit = true
      this.createEditPopVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
