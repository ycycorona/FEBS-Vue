<template>
  <div class="full-width  table-page-search-wrapper light-control-list-tab">
    <!-- 搜索区域-->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="8" :xl="6">
          <a-form-item label="项目名称">
            <a-select
              v-decorator="['projectId', {
                rules:[],
                initialValue: formValues.projectId,
              }]"
              :options="projectOpt"
              @change="projectChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4" :xl="3">
          <a-form-item label="编组名称">
            <a-input
              v-decorator="[
                'groupName', {
                  rules:[],
                  initialValue: formValues.groupName,
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4" :xl="3">
          <span>
            <a-button style="margin-left: 15px" type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetFilterForm">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <!-- 操作按钮 -->
    <div style="margin-bottom:10px" class="">
      <a-dropdown :disabled="selectedRowKeys.length===0">
        <a-menu slot="overlay" @click="handleCommandClick">
          <a-menu-item key="LightControlType">开关灯模式</a-menu-item>
          <a-menu-item key="LightControlManualPower">手动模式开关灯功率</a-menu-item>
          <a-menu-item key="LightControlStrategy">调光策略</a-menu-item>
          <a-menu-item key="LightTimeSync">时间校准</a-menu-item>
          <a-menu-item key="SingleLightJiaoBiao">单灯校表</a-menu-item>
          <a-menu-item key="LightPosition">经纬度修改</a-menu-item>
          <a-menu-item key="LightPanId">PANID修改</a-menu-item>
          <a-menu-item key="LightChannel">频道修改</a-menu-item>
          <a-menu-item key="AlarmThreshold">报警阈修改</a-menu-item>
          <a-menu-item key="InfraredParams">红外触发参数设置</a-menu-item>
          <!-- <a-menu-item key="delete">删除{{ Cons.LightName }}</a-menu-item>
          <a-menu-item key="ForceDelete">强制删除(控制器无反馈时使用)</a-menu-item> -->
        </a-menu>
        <a-button style="margin-left: 8px" type="primary" :disabled="selectedRowKeys.length===0"> 操作 <a-icon type="down" /> </a-button>
      </a-dropdown>
      <a-button style="margin-left: 8px" type="primary" @click="refresh">刷新</a-button>
    </div>
    <!-- 表格 -->
    <a-table
      ref="light-control-list-tab-table"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="operation" slot-scope="record">

      </template>
    </a-table>
    <CommonDrawerWrap
      :readonly="popReadonly"
      :draw-width="1000"
      :visible.sync="lightCommandPopVisible"
      :draw-title="currentCommandTitle"
      @close="handleCommandPopClose"
      @success="handleCommandPopSuccess"
    >
      <template v-slot:default="slotProps">
        <component :is="currentCommandPop" v-bind="slotProps" :selected-row-keys="selectedRowKeys"></component>
      </template>
    </CommonDrawerWrap>
    <a-modal
      title="单灯校表"
      :visible="lightJiaoBiaoModalVisible"
      @ok="commitLightJiaoBiao"
      @cancel="lightJiaoBiaoModalVisible=false"
    >
      <p>确定要执行校表功能(将每一个智能灯的校表码写入对应的控制器)?</p>
    </a-modal>
    <a-modal
      title="强制删除"
      :visible="forceDeleteModalVisible"
      @ok="commitForceDelete"
      @cancel="forceDeleteModalVisible=false"
    >
      <p>确定要删除所选智能灯?</p>
    </a-modal>
  </div>
</template>

<script>
import { configSerialize, isEmptyObject, configDeserialize } from '@/utils/common'
import IconEdit from '@/components/icons/IconEdit'
import LightControlReadPop from '../LightControlTab/components/LightControlReadPop'
import CommonDrawerWrap from '../LightControlTab/components/CommonDrawerWrap'
import LightControlType from '../LightControlTab/components/commandPopContent/LightControlType'
import LightControlManualPower from '../LightControlTab/components/commandPopContent/LightControlManualPower'
import LightControlStrategy from '../LightControlTab/components/commandPopContent/LightControlStrategy'
import LightTimeSync from '../LightControlTab/components/commandPopContent/LightTimeSync'
import LightPosition from '../LightControlTab/components/commandPopContent/LightPosition'
import LightPanId from '../LightControlTab/components/commandPopContent/LightPanId'
import LightChannel from '../LightControlTab/components/commandPopContent/LightChannel'
import AlarmThreshold from '../LightControlTab/components/commandPopContent/AlarmThreshold'
import InfraredParams from '../LightControlTab/components/commandPopContent/InfraredParams'
import { getListOptProcessed as getReadProjectOptProcessed,
  getWriteListOptProcessed as getWriteProjectOptProcessed } from '@/service/projectManageService'

import { pushSetJiaobiaoByBatch } from '@/service/approvedLightManageService'
import { getListOptByProjectId_1 as getGroupListOptByProjectId, getList } from '@/service/groupManageService'
const commandPopMap = {
  'ReadPop': LightControlReadPop,
  'LightControlType': LightControlType,
  'LightControlManualPower': LightControlManualPower,
  'LightControlStrategy': LightControlStrategy,
  'LightTimeSync': LightTimeSync,
  'LightPosition': LightPosition,
  'LightPanId': LightPanId,
  'LightChannel': LightChannel,
  'AlarmThreshold': AlarmThreshold,
  'InfraredParams': InfraredParams
}
const commandPopTitleMap = {
  'LightControlType': '开关灯模式',
  'LightControlManualPower': '手动开关灯功率',
  'LightControlStrategy': '调光策略设置',
  'LightTimeSync': '时间校准',
  'LightPosition': '经纬度修改',
  'LightPanId': 'PANID修改',
  'LightChannel': '频道修改',
  'AlarmThreshold': '报警阈修改',
  'InfraredParams': '红外触发参数设置'
}

// import { configSerialize } from '@/utils/common'
import { LightName } from '@/config/LightConstant'
export default {
  name: 'LightControlByGroupTab',
  components: { IconEdit, CommonDrawerWrap },
  props: {},
  data() {
    this.formValues = {
      projectId: '',
      groupId: '',
      lightId: '',
      sortType: 1
    }
    return {
      filterForm: this.$form.createForm(this),
      showSearchForm: false,
      lightJiaoBiaoModalVisible: false,
      forceDeleteModalVisible: false,
      deleteModalVisible: false,
      Cons: {
        LightName
      },
      columns: [
        {
          title: '编组名称',
          dataIndex: 'groupName'
        },
        {
          title: '编组地址',
          dataIndex: 'address'
        },
        {
          title: '所属网关',
          dataIndex: 'gatewayName'
        },
        {
          title: '备注',
          dataIndex: 'descr'
        }
        // {
        //   title: '操作',
        //   scopedSlots: { customRender: 'operation' }
        // }
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
      lightCommandPopVisible: false,
      isEdit: false,
      popReadonly: false,
      editId: '',
      selectedRowKeys: [],
      currentCommandPop: null,
      currentCommandTitle: '',
      projectOpt: [],
      projectOptPopUse: [],
      detailData: null,
      groupOpt: [],
      testList: [{
        id: 1
      }]
    }
  },
  computed: {

  },
  watch: {},
  created() {
    this.getFirstData()
    // this.search()
  },
  methods: {
    async getFirstData() {
      this.projectOpt = await getReadProjectOptProcessed()
      this.filterForm.setFieldsValue({
        projectId: this.projectOpt[0].value
      })
      await this.projectChange(this.projectOpt[0].value)
    },
    getCurrentSearchParams() {
      const o = this.filterForm.getFieldsValue()
      return isEmptyObject(o) ? this.formValues : o
    },
    search(inputParams = {}) {
      this.fetch(Object.assign(this.getCurrentSearchParams(), { pageSize: 10, pageNum: 1 }, inputParams))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
      this.getFirstData()
    },
    handleTableChange(pagination, filters, sorter) {
      this.search({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    async fetch(params = {}) {
      const data = await getList(params)
      const pagination = { ...this.pagination }
      this.dataSource = data.rows
      pagination.total = data.total
      this.pagination = pagination
      this.selectedRowKeys = []
    },
    // 编辑弹窗关闭
    handleEditPopClose() {

    },
    // 保存成功
    handleEditPopSuccess() {
      this.search()
    },
    // 删除
    // async doDelItems() {
    //   await del(configSerialize(this.selectedRowKeys))
    //     .finally(() => {
    //       this.deleteModalVisible = false
    //     })
    //   this.$message.info('删除成功')
    //   this.search()
    // },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 选择命令 打开弹窗
    handleCommandClick({ key }) {
      // 单灯校表
      if (key === 'SingleLightJiaoBiao') {
        this.lightJiaoBiaoModalVisible = true
        return
      }
      if (key === 'ForceDelete') {
        this.forceDeleteModalVisible = true
        return
      }
      if (key === 'delete') {
        this.deleteModalVisible = true
        return
      }
      this.currentCommandPop = commandPopMap[key]
      this.currentCommandTitle = commandPopTitleMap[key]
      this.lightCommandPopVisible = true
    },
    // 命令弹窗关闭
    handleCommandPopClose() {

    },
    // 命令执行成功
    handleCommandPopSuccess() {
      this.resetSelectedRowKeys()
      this.search()
    },
    commitLightJiaoBiao() {
      // todo 提交jiaobiao
      this.lightJiaoBiaoModalVisible = false
    },
    // 强制删除智能灯
    commitForceDelete() {
      this.forceDeleteModalViIsible = false
    },
    async projectChange(projectId) {
      this.filterForm.setFieldsValue({
        'groupName': ''
      })
      this.search()
    },
    async groupChange() {
      this.search()
    },
    resetSelectedRowKeys() {
      this.selectedRowKeys = []
    },
    async doJiaoBiao() {
      await pushSetJiaobiaoByBatch(configDeserialize(this.selectedRowKeys))
    },
    refresh() {
      this.resetSelectedRowKeys()
      this.search()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
