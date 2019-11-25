<template>
  <SingleMenuWrap>
    <div class="full-width alarm-message-wrap table-page-search-wrapper">
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
        ref="alarm-message-list-table"
        :row-key="record => record.id"
        :columns="columns"
        :scroll="{x: 1200}"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="dealStatus" slot-scope="dealStatus">
          {{ dealStatus | alarmDealStatusFil }}
        </template>
        <template slot="operation" slot-scope="record">
          <a-button v-if="record.dealStatus===0" size="small" type="primary" ghost @click="openDealAlarmPop(record.id)">处理</a-button>
          <template v-else> <span class="normal-click padding-right" @click="openReEditDealContentPop(record.id)">编辑</span>
            <a-popover
              placement="bottom"
              title="处理结果"
              arrow-point-at-center
              trigger="click"
              class="blue-title-popover-content"
              overlay-class-name="blue-title-popover"
            >
              <template slot="content">
                <div>{{ record.dealContent }}</div>
                <div class="time-format">[{{ record.dealTime }}]</div>
              </template>
              <span slot="default" class="normal-click">查看</span>
            </a-popover></template>

        </template>
      </a-table>
      <DealAlarmModal
        :is-edit.sync="isDealAlarmEditMod"
        :visible.sync="dealAlarmModalVisible"
        :alarm-id.sync="currentDealAlarmId"
      ></DealAlarmModal>
    </div>
  </SingleMenuWrap>
</template>

<script>

import DeptInputTree from '@/views/system/dept/DeptInputTree'
import SingleMenuWrap from '@/views/common/SingleMenuWrap'
import DealAlarmModal from './components/DealAlarmModal'
export default {
  name: 'AlarmMessageList',
  components: { DeptInputTree, SingleMenuWrap, DealAlarmModal },
  props: {

  },
  data() {
    return {
      filterForm: this.$form.createForm(this),
      dataSource: null,
      columns: [
        {
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: '违规设备',
          dataIndex: 'phoneModel'
        },
        {
          title: '违规时间',
          dataIndex: 'createTime'
        },
        {
          title: '违规内容',
          dataIndex: 'alarmContent'
        },
        {
          title: '状态',
          dataIndex: 'dealStatus',
          scopedSlots: { customRender: 'dealStatus' }
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
      strategyOpt: [],
      dealAlarmModalVisible: false,
      isDealAlarmEditMod: false,
      currentDealAlarmId: ''
    }
  },
  computed: {

  },
  watch: {

  },
  async created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
    this.strategyOpt = await this.getStrategyOpt() || []
  },
  methods: {
    search() {
      const values = this.filterForm.getFieldsValue()
      const params = {
        deptId: values.dept,
        strategyId: values.values,
        userName: values.username
      }
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
      this.$get('/business/alarm/getAlarmListByPage', {
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
    openDealAlarmPop(alarmId) {
      this.currentDealAlarmId = alarmId
      this.dealAlarmModalVisible = true
    },
    openReEditDealContentPop(alarmId) {
      this.currentDealAlarmId = alarmId
      this.isDealAlarmEditMod = true
      this.dealAlarmModalVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.left-align {
  text-align: left
}

.flex-wrap {
  display: flex
}
.flex-item {
  flex: 1 1 auto
}
.time-format {
  color: #919191;
  font-size: 12px
}
</style>
