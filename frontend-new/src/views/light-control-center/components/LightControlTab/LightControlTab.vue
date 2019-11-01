<template>
  <a-spin :spinning="loading">
    <div class="light-control-list-tab">
      <!-- 操作按钮 -->
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
        <a-dropdown>
          <a-menu slot="overlay" @click="handleCommandClick">
            <a-menu-item key="LightControlType">开关灯模式</a-menu-item>
            <a-menu-item key="LightControlManualPower">手动模式开关灯功率</a-menu-item>
            <a-menu-item key="LightControlStrategy">调光策略</a-menu-item>
            <a-menu-item key="LightTimeSync">时间校准</a-menu-item>
            <a-menu-item key="singleLightJiaoBiao">单灯校表</a-menu-item>
            <a-menu-item key="6">经纬度修改</a-menu-item>
            <a-menu-item key="7">PANID修改</a-menu-item>
            <a-menu-item key="8">频道修改</a-menu-item>
            <a-menu-item key="9">报警阈修改</a-menu-item>
            <a-menu-item key="10">红外触发参数设置</a-menu-item>
            <a-menu-item key="11">强制删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px" type="primary" :disabled="selectedRowKeys.length===0"> 操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
        <a v-if="!showSearchForm" style="margin-left: 8px" @click="toggleSearchForm">
          {{ showSearchForm ? '隐藏搜索框' : '搜索框' }}
          <a-icon :type="showSearchForm ? 'up' : 'down'" />
        </a>
      </div>
      <!-- 搜索框 -->
      <a-form v-if="showSearchForm" layout="inline" :form="filterForm">
        <a-row :gutter="24">
          <a-col :span="8" :xl="6">
            <a-form-item label="智能灯编号">
              <a-input
                v-decorator="[
                  'lightId'
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
      <LightControlDetailPop
        :visible.sync="lightControlDetailPopVisible"
        :is-edit.sync="isEdit"
        :edit-id.sync="editId"
        :pop-readonly.sync="popReadonly"
        @close="handleEditPopClose"
        @success="handleEditPopSuccess"
      ></LightControlDetailPop>
      <CommonDrawerWrap
        :draw-width="800"
        :visible.sync="lightCommandPopVisible"
        :draw-title="currentCommandTitle"
        @close="handleCommandPopClose"
        @success="handleCommandPopSuccess"
      >
        <template v-slot:default>
          <component :is="currentCommandPop"></component>
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
    </div>
  </a-spin>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import LightControlDetailPop from './components/LightControlDetailPop'
import CommonDrawerWrap from './components/CommonDrawerWrap'
import LightControlType from './components/commandPopContent/LightControlType'
import LightControlManualPower from './components/commandPopContent/LightControlManualPower'
import LightControlStrategy from './components/commandPopContent/LightControlStrategy'
import LightTimeSync from './components/commandPopContent/LightTimeSync'

const commandPopMap = {
  'LightControlType': LightControlType,
  'LightControlManualPower': LightControlManualPower,
  'LightControlStrategy': LightControlStrategy,
  'LightTimeSync': LightTimeSync
}
const commandPopTitleMap = {
  'LightControlType': '开关灯模式',
  'LightControlManualPower': '手动开关灯功率',
  'LightControlStrategy': '调光策略设置',
  'LightTimeSync': '时间校准'
}

// import { configSerialize } from '@/utils/common'
import { LightName } from '@/config/LightConstant'
export default {
  name: 'LightControlTab',
  components: { IconEdit, LightControlDetailPop, CommonDrawerWrap },
  props: {},
  data() {
    return {
      filterForm: this.$form.createForm(this),
      showSearchForm: false,
      lightJiaoBiaoModalVisible: false,
      Cons: {
        LightName
      },
      columns: [
        {
          title: '智能灯编号',
          dataIndex: 'lightId'
        },
        {
          title: 'I路状态',
          dataIndex: 'statusI'
        },
        {
          title: 'II路状态',
          dataIndex: 'statusII'
        },
        {
          title: '网关状态',
          dataIndex: 'gatewayStatus'
        },
        {
          title: 'I路调光',
          dataIndex: 'brightnessI'
        },
        {
          title: 'II路调光',
          dataIndex: 'brightnessII'
        },
        {
          title: '电压/V',
          dataIndex: 'voltage'
        },
        {
          title: '电流/A',
          dataIndex: 'eCurrent'
        },
        {
          title: '频率',
          dataIndex: 'frequency'
        },
        {
          title: '功率因数',
          dataIndex: 'powerFactor'
        },
        {
          title: '日能耗/kWh',
          dataIndex: 'dailyConsumption'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
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
      lightControlDetailPopVisible: false,
      lightCommandPopVisible: false,
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
      this.lightControlDetailPopVisible = true
    },
    // 打开编辑弹窗
    openEditPop(id) {
      this.editId = id
      this.isEdit = true
      this.lightControlDetailPopVisible = true
    },
    // 打开只读弹窗
    openReadonlyPop(id) {
      this.editId = id
      this.isEdit = true
      this.popReadonly = true
      this.lightControlDetailPopVisible = true
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
    // 通过审核
    doApprove() {

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
      // 单灯校表
      if (key === 'singleLightJiaoBiao') {
        this.lightJiaoBiaoModalVisible = true
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
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    commitLightJiaoBiao() {
      // todo 提交jiaobiao
      this.lightJiaoBiaoModalVisible = false
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
