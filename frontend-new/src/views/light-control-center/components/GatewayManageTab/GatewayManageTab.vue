<template>
  <div class="gateway-list-tab">
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
          <a-form-item label="网关名称">
            <a-input
              v-decorator="['gatewayName', {
                rules:[],
                initialValue: formValues.gatewayName,
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
    <!-- 添加按钮 -->
    <div class="float-add-btn">
      <a-button
        type="primary"
        style="border-radius:45px!important;"
        @click="openCreate"
      >
        <a-icon type="plus" /><span style="margin-left: 3px;">添加网关</span>
      </a-button>
    </div>
    <!-- 操作按钮 -->
    <div style="margin-bottom:10px" class="">
      <a-dropdown>
        <a-menu slot="overlay" @click="handleCommandClick">
          <a-menu-item key="GatewayChannel">频道修改</a-menu-item>
          <a-menu-item key="GatewayPanId">PANID修改</a-menu-item>
          <a-menu-item key="GatewayElectricRelayConfig">网关继电器配置</a-menu-item>
          <a-menu-item key="GatewayElectricAddress">电表地址修改</a-menu-item>
          <a-menu-item key="doDelItems">删除网关</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 10px;margin-right: 10px" type="primary" :disabled="selectedRowKeys.length===0"> 操作 <a-icon type="down" /> </a-button>
      </a-dropdown>
      <a-button type="primary" @click="refresh">刷新</a-button>
    </div>
    <!-- 表格 -->
    <a-table
      ref="light-control-list-tab-table"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="operation" slot-scope="record">
        <span class="operation-btn" @click="openReadonlyPop(record.id)"><a-icon type="eye" class="eye-icon" />查看</span>
        <span class="operation-btn" @click="openEditPop(record.id)"><icon-edit title="编辑" />编辑基础信息</span>
        <a-popconfirm
          title="确认删除吗?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="doDelItems"
        >
          <span class="operation-btn" @click="doDelItems(record.id)"><icon-delete title="删除" />删除</span>
        </a-popconfirm>
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
        <component :is="currentCommandPop" v-bind="slotProps" :project-opt="projectOptPopUse"></component>
      </template>
    </CommonDrawerWrap>
    <a-modal
      title="删除"
      :visible="deleteModalVisible"
      @ok="doDelItems"
      @cancel="deleteModalVisible=false"
    >
      <p>确定要删除所选网关</p>
    </a-modal>
  </div>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'

import GatewayDetailPop from '@/views/light-control-center/components/GatewayManageTab/components/GatewayDetailPop'
import CommonDrawerWrap from '@/views/light-control-center/components/LightControlTab/components/CommonDrawerWrap'
import GatewayElectricRelayConfig from '@/views/light-control-center/components/GatewayManageTab/components/commandPopContent/GatewayElectricRelayConfig'
import GatewayChannel from '@/views/light-control-center/components/GatewayManageTab/components/commandPopContent/GatewayChannel'
import GatewayPanId from '@/views/light-control-center/components/GatewayManageTab/components/commandPopContent/GatewayPanId'
import GatewayElectricAddress from '@/views/light-control-center/components/GatewayManageTab/components/commandPopContent/GatewayElectricAddress'
import { getDetail, del, getList, exportExcel,
  getRelayByGatewayId, getGatewayConfig, getMeterAddressById } from '@/service/gatewayManageService'
import { getListOptProcessed as getReadProjectOptProcessed,
  getWriteListOptProcessed as getWriteProjectOptProcessed } from '@/service/projectManageService'

import { configSerialize } from '@/utils/common'

const commandPopMap = {
  'GatewayElectricRelayConfig': GatewayElectricRelayConfig,
  'AddPop': GatewayDetailPop,
  'GatewayChannel': GatewayChannel,
  'GatewayPanId': GatewayPanId,
  'GatewayElectricAddress': GatewayElectricAddress
}
const commandPopTitleMap = {
  'GatewayElectricRelayConfig': '网关继电器配置',
  'GatewayChannel': '频道修改',
  'GatewayPanId': 'PANID修改',
  'GatewayElectricAddress': '电表地址修改'
}

// import { configSerialize } from '@/utils/common'
import { LightName, GatewayName } from '@/config/LightConstant'
export default {
  name: 'GatewayManageTab',
  components: { IconEdit, IconDelete, CommonDrawerWrap },
  props: {},
  data() {
    this.formValues = {
      projectId: '',
      gatewayName: ''
    }
    return {
      filterForm: this.$form.createForm(this),
      showSearchForm: false,
      deleteModalVisible: false,
      Cons: {
        LightName, GatewayName
      },
      columns: [
        {
          title: '网关名称',
          dataIndex: 'gatewayName'
        },
        {
          title: '通讯地址',
          dataIndex: 'gatewayGprs'
        },
        {
          title: '所属项目',
          dataIndex: 'projectName'
        },
        {
          title: '当前版本号',
          dataIndex: 'version'
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
      dataSource: null,
      commandPopVisible: false,
      isEdit: false,
      popReadonly: false,
      editId: '',
      selectedRowKeys: [],
      currentCommandPop: null,
      currentCommandTitle: '',
      projectOpt: [],
      projectOptPopUse: [],
      detailData: null
    }
  },
  computed: {},
  watch: {},
  async created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
    this.projectOpt = await getReadProjectOptProcessed()
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
      this.currentCommandPop = commandPopMap['AddPop']
      this.currentCommandTitle = '添加网关'
      this.commandPopVisible = true
    },
    // 打开编辑弹窗
    async openEditPop(id) {
      this.projectOptPopUse = await getWriteProjectOptProcessed()
      this.detailData = await getDetail(id)
      this.editId = id
      this.isEdit = true
      this.currentCommandPop = commandPopMap['AddPop']
      this.currentCommandTitle = '编辑网关'
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
      this.currentCommandTitle = '查看网关'
      this.commandPopVisible = true
    },
    // 编辑弹窗关闭
    handleEditPopClose() {

    },
    // 保存成功
    handleEditPopSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    refresh() {
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 选择命令 打开弹窗
    async handleCommandClick({ key }) {
      if (key === 'doDelItems') {
        this.deleteModalVisible = true
        return
      }
      this.editId = this.selectedRowKeys[0]
      this.detailData = {}
      if (key === 'GatewayElectricRelayConfig') {
        // 继电器配置
        const data = await this.promiseAllDo(getDetail(this.editId), getRelayByGatewayId(this.editId))
        this.detailData = {
          gatewayParamsDetail: data[0].value,
          relay: data[1].value
        }
      } else if (key === 'GatewayElectricAddress') {
        // 电表地址
        const data = await this.promiseAllDo(getDetail(this.editId), getMeterAddressById(this.editId))
        this.detailData = {
          gatewayParamsDetail: data[0].value,
          gatewayObj: data[1].value
        }
      } else if (key === 'GatewayPanId' || key === 'GatewayChannel') {
        // PANID
        const data = await this.promiseAllDo(getDetail(this.editId), getGatewayConfig(this.editId))
        this.detailData = {
          gatewayParamsDetail: data[0].value,
          gatewayConfig: data[1].value
        }
      } else {
        const data = await this.promiseAllDo(getDetail(this.editId))
        this.detailData = {
          gatewayParamsDetail: data[0].value
        }
      }
      this.currentCommandPop = commandPopMap[key]
      this.currentCommandTitle = commandPopTitleMap[key]
      this.commandPopVisible = true
    },
    promiseAllDo(...pList) {
      // console.log(pList)
      return Promise.allSettled(pList)
    },
    // 命令弹窗关闭
    handleCommandPopClose() {

    },
    // 命令执行成功
    handleCommandPopSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
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

// .float-add-btn {
//   position: absolute;
//   top: 0;
//   right: 0;
// }
</style>
