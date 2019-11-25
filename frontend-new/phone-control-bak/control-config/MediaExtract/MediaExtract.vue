<template>
  <a-spin :spinning="loading" class="full-width">
    <div class="standard-search-table-wrap table-page-search-wrapper">
      <div class="float-add-btn-wrap">
        <div class="left-text">
          媒体文件提取配置
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
        :row-selection="null"
        :row-key="record => record.id"
        :columns="columns"
        :scroll="{x: 1200}"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
      >
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
        <template slot="fileExtractScope" slot-scope="fileExtractScope">
          {{ FileExtractScopeMap.get(Number(fileExtractScope)) || Number(fileExtractScope) }}
        </template>
        <template slot="unitedDisplay" slot-scope="record">
          {{ record | unitedDisplayFil }}
        </template>
        contentValue
        <template slot="contentValue" slot-scope="contentValue">
          {{ contentValue | contentValueFil(contentValueMap) }}
        </template>
      </a-table>
      <CreateEditPop
        :content-value-opt="contentValueOpt"
        :visible.sync="createEditPopVisible"
        :is-edit.sync="isEdit"
        :edit-id.sync="editId"
        @close="handleCreateEditPopClose"
        @success="handleCreateEditPopSuccess"
      ></CreateEditPop>
    </div>

  </a-spin>
</template>

<script>
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import CreateEditPop from './components/MediaExtractCreateEditPop'
import { configDeserialize, optToArrayMap } from '@/utils/common'
import { FileExtractScopeMap, WeekOpt, MonthOpt } from '@/utils/params'

// 周月value to text
const WeekArrayMap = optToArrayMap(WeekOpt)
const MonthArrayMap = optToArrayMap(MonthOpt)

export default {
  name: 'MediaExtract',
  components: { IconEdit, IconDelete, CreateEditPop },
  filters: {
    unitedDisplayFil(record) {
      const executeTimeTypeText = record.executeTimeType === 1 ? '周' : '月'
      const dayText = record.executeTimeType === 1 ? WeekArrayMap[record.executeDaytime]
        : MonthArrayMap[record.executeDaytime]
      return `${executeTimeTypeText}/${record.intervalPeriod + 1}${executeTimeTypeText}/${dayText}`
    },
    contentValueFil(contentValue, contentValueMap) {
      return configDeserialize(contentValue).map(item => contentValueMap[Number(item)]).join(',')
    }
  },
  props: {},
  data() {
    return {
      FileExtractScopeMap, WeekArrayMap, MonthArrayMap,
      // filterForm: this.$form.createForm(this),
      configDeserialize,
      columns: [
        {
          title: '名称',
          dataIndex: 'configName'
        },
        {
          title: '提取周期',
          scopedSlots: { customRender: 'unitedDisplay' }
        },
        {
          title: '文件日期范围',
          dataIndex: 'fileExtractScope',
          scopedSlots: { customRender: 'fileExtractScope' }
        },
        {
          title: '提取内容',
          dataIndex: 'contentValue',
          scopedSlots: { customRender: 'contentValue' }
        },
        {
          title: '创建人',
          dataIndex: 'createUserName'
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
      createEditPopVisible: false,
      isEdit: false,
      editId: '',
      selectedRowKeys: [],
      contentValueOpt: []
    }
  },
  computed: {
    contentValueMap() {
      return optToArrayMap(this.contentValueOpt)
    }
  },
  watch: {},
  async created() {
    this.contentValueOpt = (await this.getContentValueOpt()).map(item => ({
      value: item.id,
      label: item.contentName
    }))
    this.fetch({ pageSize: 10, pageNum: 1 })
  },
  methods: {
    search() {
      const values = this.filterForm.getFieldsValue()
      const params = {

      }
      if (values.dateRange) {
        params.startDate = values.dateRange[0].format('YYYY-MM-DD')
        params.endDate = values.dateRange[1].format('YYYY-MM-DD')
      }
      params.strategyType = values.strategyType
      params.strategyName = values.strategyName
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
      this.fetch({ pageSize: pagination.pageSize, pageNum: pagination.current })
    },
    fetch(params = {}) {
      // 显示loading
      this.loading = true
      this.$get('/business/media-file-config/getListByPage', {
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
    getContentValueOpt() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/media-file-config/getContentceList', {
          appId: this.editId
        })
          .then(r => {
            if (r.data.state === 1) {
              resolve(r.data.data)
            } else {
              reject()
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    // 打开新建弹窗
    openCreate() {
      this.createEditPopVisible = true
    },
    // 打开编辑弹窗
    openEditPop(id) {
      this.editId = id
      this.isEdit = true
      this.createEditPopVisible = true
    },
    // 编辑弹窗关闭
    handleCreateEditPopClose() {

    },
    // 保存成功
    handleCreateEditPopSuccess() {
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
      // this.loading = true
      // return new Promise((resolve, reject) => {
      //   this.$delete('/business/black-white-app/deleteBlackWhiteAppByBatch', {
      //     appIds: configSerialize(this.selectedRowKeys)
      //   })
      //     .then(r => {
      //       resolve(r.data.data)
      //       this.$message.info('删除成功')
      //       this.fetch({ pageSize: 10, pageNum: 1 })
      //     })
      //     .finally(() => {
      //       this.loading = false
      //     })
      // })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style lang="less" scoped>

</style>
