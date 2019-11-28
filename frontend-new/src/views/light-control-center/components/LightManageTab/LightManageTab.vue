<template>
  <div class="light-manage-list-tab">
    <!-- 表单区域 -->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="8" :xl="6">
          <a-form-item label="项目名称">
            <a-select
              v-decorator="['projectId', {
                rules:[],
                initialValue: formValues.projectId,
              }]"
              allow-clear
              :options="projectOpt"
              @change="projectChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" :xl="6">
          <a-form-item label="编组名称">
            <a-input
              v-decorator="['groupName', {
                rules:[],
                initialValue: formValues.groupName,
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" :xl="6">
          <span>
            <a-button style="margin-left: 15px" type="primary" @click="search()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetFilterForm">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>

    <div style="margin-bottom:10px;position:relative" class="">
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
        <span class="operation-btn" @click="openReadonlyPop(record.id)"><a-icon type="eye" class="eye-icon" />查看</span>
        <span class="operation-btn" @click="openEditPop(record.id)"><icon-edit title="编辑" />编辑</span>
      </template>
    </a-table>
    <CommonDrawerWrap
      :detail-data.sync="detailData"
      :is-edit.sync="isEdit"
      :edit-id.sync="editId"
      :readonly.sync="popReadonly"
      :draw-width="1000"
      :visible.sync="commandPopVisible"
      :draw-title="currentCommandTitle"
      @close="handleCommandPopClose"
      @success="handleCommandPopSuccess"
    >
      <template v-slot:default="slotProps">
        <component
          :is="currentCommandPop"
          v-bind="slotProps"
          :project-opt="projectOptPopUse"
          :pop-window-data="popWindowData"
        ></component>
      </template>
    </CommonDrawerWrap>
  </div>
</template>

<script>
import CommonDrawerWrap from '@/views/light-control-center/components/LightControlTab/components/CommonDrawerWrap'

import { configSerialize } from '@/utils/common'
import IconEdit from '@/components/icons/IconEdit'
import LightManageDetailPop from './components/LightManageDetailPop'
import { getDetail, del, getList, exportExcel, getPopWindowData } from '@/service/unapproveLightManageService'
import { LightName } from '@/config/LightConstant'
import { getListOptProcessed as getReadProjectOptProcessed,
  getWriteListOptProcessed as getWriteProjectOptProcessed } from '@/service/projectManageService'
import { getListOptByProjectId as getGroupListOptByProjectId } from '@/service/groupManageService'
const commandPopMap = {
  'AddPop': LightManageDetailPop
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'LightManageTab',
  components: { IconEdit, LightManageDetailPop, CommonDrawerWrap },
  props: {},
  data() {
    this.formValues = {
      projectId: '',
      groupName: ''
    }
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
          dataIndex: 'lightNumber'
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
      dataSource: null,
      isEdit: false,
      popReadonly: false,
      editId: '',
      selectedRowKeys: [],
      formItemLayout,
      commandPopVisible: false,
      currentCommandPop: null,
      currentCommandTitle: '',
      projectOpt: [],
      projectOptPopUse: [],
      popWindowData: null,
      detailData: null
    }
  },
  computed: {},
  watch: {},
  async created() {
    this.projectOpt = await getReadProjectOptProcessed()
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    search(inputParams = {}) {
      const values = this.filterForm.getFieldsValue()
      const params = {
        projectId: values.projectId,
        gatewayName: values.gatewayName
      }
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }, inputParams))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
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
    async openCreate() {
      this.projectOptPopUse = await getWriteProjectOptProcessed()
      this.popWindowData = await getPopWindowData()
      this.currentCommandPop = commandPopMap['AddPop']
      this.currentCommandTitle = '添加路灯'
      this.commandPopVisible = true
    },
    // 打开编辑弹窗
    async openEditPop(id) {
      this.projectOptPopUse = await getWriteProjectOptProcessed()
      this.detailData = await getDetail(id)
      this.detailData.groupOpt =
        (await getGroupListOptByProjectId(this.detailData.projectId)).map(item => {
          return {
            value: item.id,
            label: item.groupName
          }
        })
      this.editId = id
      this.isEdit = true
      this.currentCommandPop = commandPopMap['AddPop']
      this.currentCommandTitle = '编辑路灯'
      this.commandPopVisible = true
    },
    // 打开只读弹窗
    async openReadonlyPop(id) {
      this.projectOptPopUse = await getReadProjectOptProcessed()
      this.detailData = await getDetail(id)
      this.editId = id
      this.isEdit = true
      this.popReadonly = true
      this.currentCommandPop = commandPopMap['AddPop']
      this.currentCommandTitle = '查看路灯'
      this.commandPopVisible = true
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
        .finally(() => {
          this.deleteModalVisible = false
        })
      this.$message.info('删除成功')
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    doApprove() {

    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    projectChange(projectId) {
      this.filterForm.setFieldsValue({
        'groupName': ''
      })
      this.search({
        projectId: projectId
      })
    },
    // 生成excel报表
    exportExcel() {
      const values = this.filterForm.getFieldsValue()
      const params = {

      }
      params.gatewayName = values.gatewayName
      exportExcel(params)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
