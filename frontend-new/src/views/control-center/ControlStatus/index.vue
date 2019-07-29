<template>
  <div class="full-width control-status-wrap table-page-search-wrapper">
    <!-- 表单区域 -->
    <a-form layout="inline">
      <div>
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
              <a-input
                v-decorator="[
                  'dept'
                ]"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" :xl="6">
            <a-form-item
              label="策略名称"
              :label-col="{span: 8}"
              :wrapper-col="{span: 16}"
            >
              <a-input
                v-decorator="[
                  'strategyName'
                ]"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" :xl="6">
            <span>
              <a-button style="margin-left: 15px" type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </div>

    </a-form>
    <!-- 表格区域 -->
    <a-table
      ref="control-status-list-table"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="longTermStrategy" slot-scope="longTermStrategy, record">
        <a-popover
          placement="bottom"
          title="策略详情"
          arrow-point-at-center
          trigger="click"
          class="strategy-blue-title-popover-content"
          overlay-class-name="strategy-blue-title-popover"
        >
          <template slot="content">
            <tab-title title="条件"></tab-title>
            <template>
              <simple-li title="策略名称:">会议室开会</simple-li>
              <simple-li title="策略类型:">临时</simple-li>
              <simple-li title="日期:">2019-07-16 ~ 2019-07-17</simple-li>
              <simple-li title="时间:">8:00 ~ 12:00</simple-li>
              <simple-li title="管控区域:">电子围栏一</simple-li>
            </template>
            <tab-title title="指令"></tab-title>
            <template>
              <simple-li title="指令1:">应用黑名单</simple-li>
              <simple-li title="指令2:">电子围栏三</simple-li>
            </template>
          </template>
          <span slot="default" class="popover-trigger">
            {{ longTermStrategy }}
            <a-tag color="green">
              已激活
            </a-tag>
          </span>
        </a-popover>
      </template>
      <!-- 临时策略 -->
      <template slot="temporaryStrategy" slot-scope="temporaryStrategy, record">
        {{ temporaryStrategy }}
        <a-tag color="orange">
          未激活
        </a-tag>
        <a-tag>
          已失效
        </a-tag>
      </template>
      <template slot="controledDeviceNum" slot-scope="controledDeviceNum, record">
        <a-popover
          placement="bottom"
          title="受控设备"
          arrow-point-at-center
          trigger="click"
          class="blue-title-popover-content"
          overlay-class-name="blue-title-popover"
        >
          <template slot="content">
            <a-table
              size="small"
              :row-key="record => record.id"
              :columns="columns_1"
              :scroll="{x: 550}"
              :data-source="dataSource_1"
              :pagination="false"
              @change="handleTableChange"
            >
              <template slot="status" slot-scope="status">
                <a-tag color="blue">{{ status }}</a-tag>
              </template>
            </a-table>
          </template>
          <span slot="default" class="popover-trigger">{{ controledDeviceNum }}</span>
        </a-popover>
      </template>
      <template slot="deviceStatus" slot-scope="deviceStatus">
        <a-tag :color="deviceStatus | deviceStatusColorFil">
          {{ deviceStatus | deviceStatusFil }}
        </a-tag>
      </template>
      <template slot="violationRecord" slot-scope="violationRecord">
        <a-popover
          placement="left"
          title="违规记录"
          arrow-point-at-center
          trigger="click"
          class="red-title-popover-content"
          overlay-class-name="red-title-popover"
        >
          <template slot="content">
            <div
              v-for="(item,index) in violationRecordList"
              :key="index"
              class="violation-record-li-wrap"
            >
              <div class="time">2019-06-23 10:10</div>
              <div class="msg">
                <span class="user-name">战士002</span> <span>离开电子围栏</span>
              </div>
              <a-divider class="inline-divider" />
            </div>
          </template>
          <span slot="default" style="color:red;cursor: pointer">{{ violationRecord }}</span>
        </a-popover>
      </template>
    </a-table>
  </div>
</template>

<script>
import TabTitle from '@/components/fragment/TabTitle'
import SimpleLi from '@/components/fragment/SimpleLi'

export default {
  name: 'ControlStatus',
  components: { TabTitle, SimpleLi },
  props: {

  },
  data() {
    return {
      filterForm: this.$form.createForm(this),
      advanced: false,
      dataSource: [
        {
          id: 0,
          userName: '战士001',
          longTermStrategy: '一团日常管控策略',
          temporaryStrategy: '外出训练策略',
          currentActiveStra: 'longTermStrategy',
          controledDeviceNum: 2,
          deviceStatus: '1',
          violationRecord: '4'
        },
        {
          id: 1,
          userName: '战士002',
          longTermStrategy: '一团日常管控策略',
          temporaryStrategy: '外出训练策略',
          currentActiveStra: 'temporaryStrategy',
          controledDeviceNum: 2,
          deviceStatus: '0',
          violationRecord: '4'
        }
      ],
      dataSource_1: [
        {
          id: 0,
          name: 'HUAWEIP20',
          type: 'EML-AL00',
          version: '1.0.0',
          status: '在线'
        }
      ],
      violationRecordList: [
        {
          name: '战士1',
          time: '2019-05-01 13:11',
          msg: '离开电子围栏'
        },
        {
          name: '战士2',
          time: '2019-05-01 14:11',
          msg: '离开电子围栏'
        },
        {
          name: '战士2',
          time: '2019-05-01 14:11',
          msg: '离开电子围栏'
        },
        {
          name: '战士2',
          time: '2019-05-01 14:11',
          msg: '离开电子围栏'
        },
        {
          name: '战士2',
          time: '2019-05-01 14:11',
          msg: '离开电子围栏'
        },
        {
          name: '战士2',
          time: '2019-05-01 14:11',
          msg: '离开电子围栏'
        },
        {
          name: '战士2',
          time: '2019-05-01 14:11',
          msg: '离开电子围栏'
        },
        {
          name: '战士2',
          time: '2019-05-01 14:11',
          msg: '离开电子围栏'
        }
      ],
      columns_1: [
        {
          title: '设备名称',
          dataIndex: 'name'
        },
        {
          title: '型号',
          dataIndex: 'type'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      columns: [
        {
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: '长期策略',
          dataIndex: 'longTermStrategy',
          scopedSlots: { customRender: 'longTermStrategy' }
        },
        {
          title: '临时策略',
          dataIndex: 'temporaryStrategy',
          scopedSlots: { customRender: 'temporaryStrategy' }
        },
        {
          title: '受控设备',
          dataIndex: 'controledDeviceNum',
          scopedSlots: { customRender: 'controledDeviceNum' }
        },
        {
          title: '设备状态',
          dataIndex: 'deviceStatus',
          scopedSlots: { customRender: 'deviceStatus' }
        },
        {
          title: '违规记录(次)',
          dataIndex: 'violationRecord',
          scopedSlots: { customRender: 'violationRecord' }
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
      loading: false
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    handleTableChange() {

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
</style>
