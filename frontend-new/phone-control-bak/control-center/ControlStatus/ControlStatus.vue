<template>
  <div class="full-width control-status-wrap table-page-search-wrapper">
    <!-- 表单区域 -->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="8" :xl="6">
          <a-form-item
            label="用户名"
          >
            <a-input
              v-decorator="[
                'username'
              ]"
              placeholder="请输入用户名"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" :xl="6">
          <a-form-item
            label="组织架构"
            :label-col="{span: 8}"
            :wrapper-col="{span: 16}"
          >
            <DeptInputTree
              v-decorator="[
                'dept'
              ]"
            ></DeptInputTree>
          </a-form-item>
        </a-col>
        <a-col :span="8" :xl="6">
          <a-form-item
            label="策略名称"
            :label-col="{span: 8}"
            :wrapper-col="{span: 16}"
          >
            <a-select
              v-decorator="[
                'strategyName'
              ]"
              allow-clear
              :options="strategyOpt"
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
    <!-- 表格区域 -->
    <a-table
      ref="control-status-list-table"
      :row-key="record => record.userId"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="longStrategyName" slot-scope="longStrategyName, record">
        <a-popover
          placement="bottom"
          title="策略详情"
          arrow-point-at-center
          trigger="click"
          class="strategy-blue-title-popover-content"
          overlay-class-name="strategy-blue-title-popover"
          @visibleChange="longStrategyPopoverVisibleChange(record.longStrategyId, arguments[0])"
        >
          <a-spin slot="content" :spinning="popoverLoading" class="pop-center-spin">
            <template v-if="longStrategyDetail">
              <simple-li title="策略名称:">{{ longStrategyDetail.strategyName }}</simple-li>
              <tab-title title="策略生效条件"></tab-title>
              <template>
                <simple-li title="策略类型:">{{ longStrategyDetail.strategyTypeName }}</simple-li>
                <simple-li title="日期:">{{ longStrategyDetail.startDate }} ~ {{ longStrategyDetail.endDate }}</simple-li>
                <simple-li title="时间:">{{ longStrategyDetail.startEndTime }}</simple-li>
                <simple-li title="管控区域:">{{ longStrategyDetail.controlZoneFence ?
                  longStrategyDetail.controlZoneFence.fenceName : '' }}</simple-li>
              </template>
              <tab-title title="指令"></tab-title>
              <template v-for="(directive, index) in longStrategyDetail.cmdTypeAndConfig">
                <simple-li :key="index" :title="`指令${index+1}:`">{{ directive.typeName }}</simple-li>
              </template>
            </template>
          </a-spin>
          <span slot="default" class="popover-trigger">
            <template v-if="longStrategyName">
              {{ longStrategyName }}
              <a-tag v-if="record.activeStrategy===0" color="green">
                已激活
              </a-tag>
              <a-tag v-else color="orange">
                未激活
              </a-tag>
            </template>
            <span v-else>-</span>
          </span>
        </a-popover>
      </template>
      <!-- 临时策略 -->
      <template slot="temporaryStrategyName" slot-scope="temporaryStrategyName, record">
        <a-popover
          placement="bottom"
          title="策略详情"
          arrow-point-at-center
          trigger="click"
          class="strategy-blue-title-popover-content"
          overlay-class-name="strategy-blue-title-popover"
          @visibleChange="temporaryStrategyPopoverVisibleChange(record.temporaryStrategyId, arguments[0])"
        >
          <a-spin slot="content" :spinning="popoverLoading" class="pop-center-spin">
            <template v-if="temporaryStrategyDetail">
              <simple-li title="策略名称:">{{ temporaryStrategyDetail.strategyName }}</simple-li>
              <tab-title title="策略生效条件"></tab-title>
              <template>
                <simple-li title="策略类型:">{{ temporaryStrategyDetail.strategyTypeName }}</simple-li>
                <simple-li title="日期:">{{ temporaryStrategyDetail.startDate }} ~ {{ temporaryStrategyDetail.endDate }}</simple-li>
                <simple-li title="时间:">{{ temporaryStrategyDetail.startEndTime }}</simple-li>
                <simple-li title="管控区域:">{{ temporaryStrategyDetail.controlZoneFence ?
                  temporaryStrategyDetail.controlZoneFence.fenceName : '' }}</simple-li>
              </template>
              <tab-title title="指令"></tab-title>
              <template v-for="(directive, index) in temporaryStrategyDetail.cmdTypeAndConfig">
                <simple-li :key="index" :title="`指令${index+1}:`">{{ directive.typeName }}</simple-li>
              </template>
            </template>
          </a-spin>
          <span slot="default" class="popover-trigger">
            <template v-if="temporaryStrategyName">
              {{ temporaryStrategyName }}
              <a-tag v-if="record.activeStrategy===1" color="green">
                已激活
              </a-tag>
              <a-tag v-else color="orange">
                未激活
              </a-tag>
              <a-tag v-if="record.isExpire===1">
                已过期
              </a-tag>
            </template>
            <span v-else>-</span>
          </span>
        </a-popover>
      </template>
      <!-- 受控设备 -->
      <template slot="phoneCount" slot-scope="phoneCount, record">
        <a-popover
          placement="bottom"
          title="受控设备"
          arrow-point-at-center
          trigger="click"
          class="blue-title-popover-content"
          overlay-class-name="blue-title-popover"
          @visibleChange="onControlDevicesPopoverVisibleChange(record.userId, arguments[0])"
        >
          <template slot="content">
            <a-table
              :loading="popoverLoading"
              size="small"
              :row-key="record => record.id"
              :columns="controlDevicesColumns"
              :scroll="{x: 550}"
              :data-source="controlDevicesDetail"
              :pagination="false"
            >
              <template slot="linestate" slot-scope="linestate">
                <a-tag :color="linestate | deviceStatusColorFil">{{ linestate | deviceStatusFil }}</a-tag>
              </template>
            </a-table>
          </template>
          <span slot="default" class="popover-trigger">{{ phoneCount }}</span>
        </a-popover>
      </template>
      <!-- 设备状态 -->
      <template slot="offLineCount" slot-scope="offLineCount">
        <a-tag :color="offLineCount>0 ? 'red' : 'blue'">
          {{ offLineCount>0 ?'离线' : '在线' }}
        </a-tag>
        <template v-if="offLineCount>0">
          {{ offLineCount }}
        </template>
      </template>
      <!-- 报警记录 -->
      <template slot="alarmCount" slot-scope="alarmCount, record">
        <a-popover
          placement="left"
          title="报警记录"
          arrow-point-at-center
          trigger="click"
          class="red-title-popover-content"
          overlay-class-name="red-title-popover alarm-pop-wrap"
          @visibleChange="onAlarmRecordsPopoverVisibleChange(record.userId, arguments[0])"
        >
          <a-spin slot="content" :spinning="popoverLoading" class="pop-center-spin">
            <div
              v-for="(item,index) in alarmRecordsDetail"
              :key="index"
              class="violation-record-li-wrap"
            >
              <div class="flex-wrap">
                <div class="flex-item">
                  <div class="time">{{ item.createTime }}</div>
                  <div class="msg">
                    <span class="user-name">{{ record.userName }}</span> <span>{{ item.alarmContent }}</span>
                  </div>
                </div>
                <div class="flex-item" style="text-align: right">
                  <a-button v-if="item.dealStatus===0" type="primary" size="small" ghost style="vertical-align: -6px;" @click="openDealAlarmPop(item.id)">处理</a-button>
                  <a-button v-else type="default" size="small" disabled style="vertical-align: -6px;">已处理</a-button>
                </div>
              </div>
              <a-divider class="inline-divider" />
            </div>
          </a-spin>

          <span slot="default" style="color:red;cursor: pointer">{{ alarmCount }}</span>
        </a-popover>
      </template>
      <template slot="operation" slot-scope="record">
        <span class="operation-btn" @click="openDevicesManageModal(record.userId)"><IconDeviceManage></IconDeviceManage>设备管理</span>
      </template>
    </a-table>
    <a-modal
      v-model="deviceManageVisible"
      :width="1200"
      title="设备管理"
      :body-style="{height: '600px'}"
      destroy-on-close
      v-bind="{footer: null}"
      :mask-closable="false"
    >
      <a-row :gutter="16" style="height:100%">
        <a-col :span="24">
          <DevicesManage
            :user-id="deviceManageUserId"
          ></DevicesManage>
        </a-col>
      </a-row>
    </a-modal>
    <DealAlarmModal
      :visible.sync="dealAlarmModalVisible"
      :alarm-id.sync="currentDealAlarmId"
      :opt="{zIndex: 1040}"
    ></DealAlarmModal>
  </div>
</template>

<script>
import TabTitle from '@/components/fragment/TabTitle'
import SimpleLi from '@/components/fragment/SimpleLi'
import IconDeviceManage from '@/components/icons/IconDeviceManage'
import DeptInputTree from '@/views/system/dept/DeptInputTree'
import DevicesManage from './components/DevicesManage'
import DealAlarmModal from '../../alarm-message/components/DealAlarmModal'
export default {
  name: 'ControlStatus',
  components: { TabTitle, SimpleLi, IconDeviceManage, DeptInputTree,
    DevicesManage, DealAlarmModal },
  props: {

  },
  data() {
    return {
      filterForm: this.$form.createForm(this),
      dataSource: null,
      deviceManageVisible: false,
      deviceManageUserId: '',
      // longStrategyDetailPopLoading: false,
      // temporaryStrategyDetailPopLoading: false,
      controlDevicesDetail: [],
      alarmRecordsDetail: [],
      longStrategyDetail: null,
      temporaryStrategyDetail: null,
      controlDevicesColumns: [
        {
          title: '型号',
          dataIndex: 'phoneModel'
        },
        {
          title: 'IMEI',
          dataIndex: 'phoneImei'
        },
        {
          title: '状态',
          dataIndex: 'linestate',
          scopedSlots: { customRender: 'linestate' }
        }
      ],
      columns: [
        {
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: '部门',
          dataIndex: 'deptName'
        },
        {
          title: '长期策略',
          dataIndex: 'longStrategyName',
          scopedSlots: { customRender: 'longStrategyName' }
        },
        {
          title: '临时策略',
          dataIndex: 'temporaryStrategyName',
          scopedSlots: { customRender: 'temporaryStrategyName' }
        },
        {
          title: '受控设备',
          dataIndex: 'phoneCount',
          scopedSlots: { customRender: 'phoneCount' }
        },
        {
          title: '设备状态',
          dataIndex: 'offLineCount',
          scopedSlots: { customRender: 'offLineCount' }
        },
        {
          title: '报警记录(次)',
          dataIndex: 'alarmCount',
          scopedSlots: { customRender: 'alarmCount' }
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
      strategyOpt: [],
      loading: false,
      popoverLoading: false,
      dealPopVisible: false,
      currentDealAlarmId: '',
      dealAlarmModalVisible: false
    }
  },
  computed: {

  },
  watch: {

  },
  async created() {
    this.strategyOpt = await this.getStrategyOpt() || []
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    search() {
      const values = this.filterForm.getFieldsValue()
      const params = {
        deptId: values.dept,
        strategyId: values.strategyName,
        userName: values.username
      }
      console.log(params)
      // params.strategyType = values.strategyType
      // params.strategyName = values.strategyName
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
    },
    handleTableChange(pagination, filters, sorter) {
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    fetch(params = {}) {
      // 显示loading
      this.loading = true
      this.$get('/business/controlUserStatus/getControlStatusByPage', {
        ...params
      }).then((r) => {
        const data = r.data
        const pagination = { ...this.pagination }
        this.dataSource = data.rows
        pagination.total = data.total
        this.pagination = pagination
      }).catch()
        .finally(() => {
          this.loading = false
        })
    },
    getStrategyOpt() {
      return new Promise((resolve, reject) => {
        this.$get('/business/cmd-strategy/getStrategyList')
          .then(r => {
            if (r.data.state === 1) {
              resolve(this.strategyOptTransform(r.data.data))
            } else {
              reject()
            }
          })
      })
    },
    strategyOptTransform(raw) {
      return raw.map(item => {
        return {
          value: item.id,
          label: item.strategyName
        }
      })
    },
    // 点击长期策略悬窗
    async longStrategyPopoverVisibleChange(id, flag) {
      if (!flag) {
        this.longStrategyDetail = null
        return
      }
      this.popoverLoading = true
      this.longStrategyDetail = await this.getStrategyDetail(id)
        .finally(() => {
          this.popoverLoading = false
        })
      // console.log(this.longStrategyDetail)
    },
    // 点击短期策略悬窗
    async temporaryStrategyPopoverVisibleChange(id, flag) {
      if (!flag) {
        this.temporaryStrategyDetail = null
        return
      }
      this.popoverLoading = true
      this.temporaryStrategyDetail = await this.getStrategyDetail(id)
        .finally(() => {
          this.popoverLoading = false
        })
      // console.log(this.temporaryStrategyDetail)
    },
    async onControlDevicesPopoverVisibleChange(id, flag) {
      if (!flag) {
        this.controlDevicesDetail = []
        return
      }
      this.controlDevicesDetail = await this.getcontrolDevicesDetail(id)
      // console.log(this.controlDevicesDetail)
    },
    async onAlarmRecordsPopoverVisibleChange(id, flag) {
      if (!flag) {
        this.alarmRecordsDetail = []
        return
      }
      this.alarmRecordsDetail = await this.getAlarmRecordsDetail(id)
      // console.log(this.alarmRecordsDetail)
    },
    getStrategyDetail(id) {
      return new Promise((resolve, reject) => {
        this.$get('/business/cmd-strategy/getStrategyDetailAndUsers',
          {
            strategyId: id
          })
          .then(r => {
            if (r.data.state === 1) {
              resolve(r.data.data)
            } else {
              reject()
            }
          })
          .finally(() => {
            reject()
          })
      })
    },
    getcontrolDevicesDetail(id) {
      this.popoverLoading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/controlUserStatus/getPhoneListByUserid',
          {
            userId: id
          })
          .then(r => {
            if (r.data.state === 1) {
              resolve(r.data.rows)
            } else {
              reject()
            }
          })
          .finally(() => {
            reject()
            this.popoverLoading = false
          })
      })
    },
    getAlarmRecordsDetail(id) {
      this.popoverLoading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/controlUserStatus/getAlarmListByUserid',
          {
            userId: id
          })
          .then(r => {
            if (r.data.state === 1) {
              resolve(r.data.rows)
            } else {
              reject()
            }
          })
          .finally(() => {
            reject()
            this.popoverLoading = false
          })
      })
    },
    // 处理报警
    openDealAlarmPop(alarmId) {
      this.currentDealAlarmId = alarmId
      this.dealAlarmModalVisible = true
    },
    openDevicesManageModal(userId) {
      this.deviceManageVisible = true
      this.deviceManageUserId = userId
    }
  }
}
</script>

<style lang="less" scoped>
.left-align {
  text-align: left
}
.violation-record-li-wrap {
  .time, .msg {
    font-size: 12px;

    .user-name {
      padding-right: 0.5rem
    }
  }
  .time {
    color: #A9A9A9;
  }
}
.flex-wrap {
  display: flex
}
.flex-item {
  flex: 1 1 auto
}
</style>
