<template>
  <a-spin :spinning="loading">
    <div class="gateway-list-tab">
      <!-- 添加按钮 -->
      <div class="float-add-btn">
        <a-button
          type="primary"
          style="border-radius:45px!important;"
          @click="openCreate"
        >
          <a-icon type="plus" /><span style="margin-left: 3px;">添加{{ Cons.GatewayName }}</span>
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
            <a-menu-item key="delete">删除网关</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 10px;margin-right: 10px" type="primary" :disabled="selectedRowKeys.length===0"> 操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-button type="primary" @click="refresh">刷新</a-button>
        <a v-if="!showSearchForm" style="margin-left: 8px" @click="toggleSearchForm">
          {{ showSearchForm ? '隐藏搜索框' : '搜索框' }}
          <a-icon :type="showSearchForm ? 'up' : 'down'" />
        </a>
      </div>
      <!-- 搜索框 -->
      <a-form v-if="showSearchForm" layout="inline" :form="filterForm">
        <a-row :gutter="24">
          <a-col :span="8" :xl="6">
            <a-form-item label="网关名称">
              <a-input
                v-decorator="[
                  'gatewayName'
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
          <span class="operation-btn" @click="openEditPop(record.id)"><icon-edit title="编辑" />编辑</span>
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
        :is-edit.sync="isEdit"
        :edit-id.sync="editId"
        :readonly.sync="popReadonly"
        :draw-width="1000"
        :visible.sync="gatewayCommandPopVisible"
        :draw-title="currentCommandTitle"
        @close="handleCommandPopClose"
        @success="handleCommandPopSuccess"
      >
        <template v-slot:default="slotProps">
          <component :is="currentCommandPop" v-bind="slotProps"></component>
        </template>
      </CommonDrawerWrap>
      <a-modal
        title="删除"
        :visible="deleteModalVisible"
        @ok="doDelItems"
        @cancel="deleteModalVisible=false"
      >
        <p>确定要删除所选智能灯?</p>
      </a-modal>
    </div>
  </a-spin>
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
          dataIndex: 'address'
        },
        {
          title: '所属项目',
          dataIndex: 'project'
        },
        {
          title: '当前版本号',
          dataIndex: 'version'
        },
        {
          title: '备注',
          dataIndex: 'remarks'
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
      createPopVisible: false,
      gatewayCommandPopVisible: false,
      isEdit: false,
      popReadonly: false,
      editId: '',
      selectedRowKeys: [],
      currentCommandPop: null,
      currentCommandTitle: ''
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
      this.$get('/light-control-center/light-control/list', {
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
      this.currentCommandPop = commandPopMap['AddPop']
      this.currentCommandTitle = '添加网关'
      this.gatewayCommandPopVisible = true
    },
    // 打开编辑弹窗
    openEditPop(id) {
      this.editId = id
      this.isEdit = true
      this.currentCommandPop = commandPopMap['AddPop']
      this.currentCommandTitle = '编辑网关'
      this.gatewayCommandPopVisible = true
    },
    // 打开只读弹窗
    openReadonlyPop(id) {
      this.editId = id
      this.isEdit = true
      this.popReadonly = true
      this.currentCommandPop = commandPopMap['AddPop']
      this.currentCommandTitle = '查看网关'
      this.gatewayCommandPopVisible = true
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
    },
    search() {

    },
    resetFilterForm() {

    },
    // 选择命令 打开弹窗
    handleCommandClick({ key }) {
      if (key === 'doDelItems') {
        this.deleteModalVisible = true
        return
      }
      this.currentCommandPop = commandPopMap[key]
      this.currentCommandTitle = commandPopTitleMap[key]
      this.gatewayCommandPopVisible = true
    },
    // 命令弹窗关闭
    handleCommandPopClose() {

    },
    // 命令执行成功
    handleCommandPopSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
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
