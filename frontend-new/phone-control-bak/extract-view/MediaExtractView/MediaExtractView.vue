<template>
  <div class="standard-search-table-wrap table-page-search-wrapper full-width">
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
          <span>
            <a-button style="margin-left: 15px" type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetFilterForm">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <!-- 表格区域 -->
    <div style="margin-bottom:10px">
    </div>
    <a-table
      ref="filter-table"
      :row-selection="null"
      :row-key="record => record.userId"
      :columns="columns"
      :scroll="{x: 1200}"
      :data-source="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="imageCount" slot-scope="imageCount, record">
        <span class="blue-click" @click="showDetailView(record.userId, 'image')">{{ imageCount }}</span>
      </template>
      <template slot="videoCount" slot-scope="videoCount, record">
        <span class="blue-click" @click="showDetailView(record.userId, 'video')">{{ videoCount }}</span>
      </template>
      <template slot="audioCount" slot-scope="audioCount, record">
        <span class="blue-click" @click="showDetailView(record.userId, 'audio')">{{ audioCount }}</span>
      </template>
      <template slot="documentCount" slot-scope="documentCount, record">
        <span class="blue-click" @click="showDetailView(record.userId, 'document')">{{ documentCount }}</span>
      </template>
      <template slot="operation" slot-scope="record">
        <span class="operation-btn" @click="doExport(record.userId)"><icon-export title="导出" />导出</span>
        <!-- <a-popconfirm
          title="确认删除吗?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="dodelItem(record.userId)"
        >
          <span class="operation-btn"><icon-delete title="删除" />删除</span>
        </a-popconfirm> -->
      </template>
    </a-table>
    <a-modal
      v-model="detailViewPopVisible"
      :width="windowInnerWidth*0.95"
      :style="{}"
      centered
      title="资料查看"
      :body-style="{height: `${windowInnerHeight*0.9}px`,minHeight:'700px'}"
      destroy-on-close
      v-bind="{footer: null}"
      :mask-closable="false"
    >
      <a-row :gutter="16" class="full-height">
        <a-col :span="24" class="full-height">
          <data-viewer
            :user-id="currentUserId"
            :default-tab="defaultTab"
          ></data-viewer>
        </a-col>
      </a-row>
    </a-modal>

  </div>
</template>

<script>
import IconExport from '@/components/icons/IconExport'
// import IconDelete from '@/components/icons/IconDelete'
import DeptInputTree from '@/views/system/dept/DeptInputTree'
import { configDeserialize } from '@/utils/common'
import { } from '@/utils/params'
import DataViewer from './components/DataViewer'
import { mapState } from 'vuex'

export default {
  name: 'MediaExtractView',
  components: { IconExport, /* IconDelete, */ DeptInputTree, DataViewer },
  filters: {

  },
  props: {},
  data() {
    return {
      filterForm: this.$form.createForm(this),
      configDeserialize,
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
          title: '图片',
          dataIndex: 'imageCount',
          scopedSlots: { customRender: 'imageCount' }

        },
        {
          title: '视频',
          dataIndex: 'videoCount',
          scopedSlots: { customRender: 'videoCount' }
        },
        {
          title: '音频',
          dataIndex: 'audioCount',
          scopedSlots: { customRender: 'audioCount' }
        },
        {
          title: '文档',
          dataIndex: 'documentCount',
          scopedSlots: { customRender: 'documentCount' }
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
      detailViewPopVisible: false,
      currentUserId: '',
      defaultTab: ''
    }
  },
  computed: {
    ...mapState({
      windowInnerHeight: state => state.globalState.windowInnerHeight,
      windowInnerWidth: state => state.globalState.windowInnerWidth
    })
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
      if (values.dateRange) {
        params.startDate = values.dateRange[0].format('YYYY-MM-DD')
        params.endDate = values.dateRange[1].format('YYYY-MM-DD')
      }
      params.userName = values.username
      params.deptId = values.dept
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
      this.$get('/business/media-file-content/getMediaFileIndexByPage', {
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

    // 打开弹窗
    openPop(id) {
      this.editId = id
      this.isEdit = true
      this.createEditPopVisible = true
    },
    // 编辑弹窗关闭
    handlePopClose() {

    },
    // 删除
    dodelItem(id) {
      // this.loading = true
      // return new Promise((resolve, reject) => {
      //   this.$delete('/business/address-book-config/deleteById', {
      //     addressBookConfigId: id
      //   })
      //     .then(r => {
      //       const data = r.data
      //       if (data.state === 1) {
      //         this.$message.info('删除成功')
      //         this.fetch({ pageSize: 10, pageNum: 1 })
      //         resolve(data.data)
      //       } else {
      //         this.$message.error('删除失败' + data.message)
      //         reject(data.message)
      //       }
      //     })
      //     .finally(() => {
      //       this.loading = false
      //     })
      // })
    },
    doExport(id) {
      console.log(id)
      return new Promise((resolve, reject) => {
        this.$export(`/business/address-book-content/export_AllDataByUserId`, {
          userId: id
        })
      })
    },
    showDetailView(userId, flag) {
      this.currentUserId = userId
      this.defaultTab = flag
      this.detailViewPopVisible = true
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style lang="less" scoped>

</style>
