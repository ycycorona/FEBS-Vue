<template>
  <div class="electric-fence-list full-width">
    <div class="add-btn-wrap">
      <span class="left-text">电子围栏</span>
      <a-button
        class="right-btn"
        type="primary"
        style="border-radius:45px!important;"
        @click="createElectricFencePop"
      >
        <a-icon type="plus" @click="createElectricFencePopVisiable=true" /><span style="margin-left: 3px;">新建电子围栏</span>
      </a-button>
    </div>
    <!-- 表格区域 -->
    <a-table
      ref="electric-fence-list-table"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="electricFenceType" slot-scope="electricFenceType">
        <span>内</span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <span class="operation-btn" @click="openEditPop"><icon-edit title="修改" />编辑</span>
        <span class="operation-btn" @click="openDelPop"><icon-delete title="删除" />删除</span>
      </template>
    </a-table>
    <create-electric-fence-pop
      :visible.sync="createElectricFencePopVisiable"
      @success="handleCreateElectricFenceSuccess"
    ></create-electric-fence-pop>
  </div>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import CreateElectricFencePop from './components/CreateElectricFencePop'
export default {
  name: 'ElectricFenceList',
  components: { IconEdit, IconDelete, CreateElectricFencePop },
  props: {},
  data() {
    return {
      columns: [
        {
          title: '电子围栏名称',
          dataIndex: 'electricFenceName'
        },
        {
          title: '性质',
          dataIndex: 'electricFenceType',
          scopedSlots: { customRender: 'electricFenceType' }
        },
        {
          title: '中心位置',
          dataIndex: 'center'
        },
        {
          title: '半径',
          dataIndex: 'radius'
        },
        {
          title: '经度',
          dataIndex: 'electricFenceX'
        },
        {
          title: '纬度',
          dataIndex: 'electricFenceY'
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
      loading: false,
      dataSource: null,
      createElectricFencePopVisiable: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    fetch(params = {}) {
      // 显示loading
      this.loading = true
      this.$get('/control-config/electric-fence/list', {
        ...params
      }).then((r) => {
        const data = r.data
        const pagination = { ...this.pagination }
        this.dataSource = data.rows
        pagination.total = data.total
        this.pagination = pagination
        this.loading = false
      })
    },
    // 打开新建控制策略弹窗
    createElectricFencePop() {
      this.createElectricFencePopVisiable = true
    },
    // 新建策略弹窗关闭
    handleCreateElectricFencePopClose() {
      this.createElectricFencePopVisiable = false
    },
    // 新建策略成功
    handleCreateElectricFenceSuccess() {
      this.createElectricFencePopVisiable = false
    },
    // 查看详情弹窗
    detailPop() {

    },
    openEditPop() {

    },
    openDelPop() {

    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/utils/utils.less";
.add-btn-wrap {
  .clearfix();
  .left-text{
    float: left;
    color: #4E4E4E;
    font-size: 18px;
    font-weight: 700
  }
  .right-btn{
    float: right;
  }
  margin-bottom: 5px
}
</style>
