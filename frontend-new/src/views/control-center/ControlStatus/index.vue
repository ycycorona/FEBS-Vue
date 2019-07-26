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
        {{ longTermStrategy }} {{ record.id }}
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
    </a-table>
  </div>
</template>

<script>

export default {
  name: 'ControlStatus',
  components: { },
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
          deviceStatus: '1',
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
          dataIndex: 'temporaryStrategy'
        },
        {
          title: '受控设备',
          dataIndex: 'controledDeviceNum',
          scopedSlots: { customRender: 'controledDeviceNum' }
        },
        {
          title: '设备状态',
          dataIndex: 'deviceStatus'
        },
        {
          title: '违规记录',
          dataIndex: 'violationRecord'
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
</style>
