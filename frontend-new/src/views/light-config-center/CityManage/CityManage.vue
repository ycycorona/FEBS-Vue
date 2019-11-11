<template>
  <a-spin :spinning="loading" class="full-width">
    <div class="standard-search-table-wrap table-page-search-wrapper">
      <div class="float-add-btn-wrap">
        <div class="left-text">
          城市管理
        </div>
        <div class="float-add-btn">
          <a-button
            type="primary"
            style="border-radius:45px!important;"
            @click="openCreate"
          >
            <a-icon type="plus" /><span style="margin-left: 3px;">添加</span>
          </a-button>
        </div>
      </div>
      <!-- 表单区域 -->
      <!-- 表格区域 -->
      <div style="margin-bottom:10px">
      </div>
      <a-table
        ref="filter-table"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :row-key="record => record.id"
        :columns="columns"
        :scroll="{x: 1200}"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="position" slot-scope="record">
          <span class="bold">经度:</span>{{ record.lng }}<span class="padding-left bold">纬度:</span>{{ record.lat }}
        </template>
        <template slot="operation" slot-scope="record">
          <span class="operation-btn" @click="openEditPop(record.id)"><icon-edit title="修改" />编辑</span>
          <a-popconfirm
            title="确认删除吗?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="dodelItem(record.id)"
          >
            <span class="operation-btn"><icon-delete title="删除" />删除</span>
          </a-popconfirm>
        </template>
      </a-table>
      <CommonDrawerWrap
        :is-edit.sync="isEdit"
        :edit-id.sync="editId"
        :draw-width="800"
        :visible.sync="createEditPopVisible"
        :draw-title="currentCommandTitle"
        @close="handleCommandPopClose"
        @success="handleCommandPopSuccess"
      >
        <template v-slot:default="slotProps">
          <component :is="currentCommandPop" v-bind="slotProps"></component>
        </template>
      </CommonDrawerWrap>
    </div>

  </a-spin>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import { configSerialize } from '@/utils/common'
import CommonDrawerWrap from '@/views/light-control-center/components/LightControlTab/components/CommonDrawerWrap'
import CityDetailPopContent from '@/views/light-config-center/CityManage/components/CityDetailPopContent'
const PopTitleMap = new Map([
  ['create', '添加城市'],
  ['edit', '编辑城市']
])
export default {
  name: 'CityManage',
  components: { IconEdit, IconDelete, CommonDrawerWrap, CityDetailPopContent },
  filters: {

  },
  props: {},
  data() {
    return {
      columns: [
        {
          title: '省份',
          dataIndex: 'province'
        },
        {
          title: '城市',
          dataIndex: 'name'
        },
        {
          title: '城市定位',
          scopedSlots: { customRender: 'position' }
        },
        {
          title: '项目数',
          dataIndex: 'projectNum'
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
      createEditPopVisible: false,
      currentCommandTitle: '',
      isEdit: false,
      editId: '',
      selectedRowKeys: [],
      currentCommandPop: CityDetailPopContent
    }
  },
  computed: {

  },
  watch: {},
  async created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    search() {
      const values = this.filterForm.getFieldsValue()
      const params = {

      }
      params.city = values.city
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
      this.$get('/business/city/getCityListByPage', {
        ...params
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
      this.currentCommandTitle = PopTitleMap.get('create')
      this.createEditPopVisible = true
    },
    // 打开编辑弹窗
    openEditPop(id) {
      this.currentCommandTitle = PopTitleMap.get('edit')
      this.editId = id
      this.isEdit = true
      this.createEditPopVisible = true
    },
    // 编辑弹窗关闭
    handleCommandPopClose() {

    },
    // 保存成功
    handleCommandPopSuccess() {
      this.fetch({ pageSize: 10, pageNum: 1 })
    },
    // 删除
    dodelItem(id) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$delete('/business/media-file-config/deleteById', {
          mediaConfigId: id
        })
          .then(r => {
            const data = r.data
            if (data.state === 1) {
              this.$message.info('删除成功')
              this.fetch({ pageSize: 10, pageNum: 1 })
              resolve(data.data)
            } else {
              this.$message.error('删除失败' + data.message)
              reject(data.message)
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    doDelItems() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$delete('/business/city/deleteCityByBatch', {
          cityIds: configSerialize(this.selectedRowKeys)
        })
          .then(r => {
            resolve(r.data.data)
            this.$message.info('删除成功')
            this.fetch({ pageSize: 10, pageNum: 1 })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style lang="less" scoped>

</style>
