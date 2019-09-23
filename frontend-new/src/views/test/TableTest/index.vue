<template>
  <!-- :title="() => 'testTableTitle'" -->
  <div>
    <form-test />
    <a-table
      class="test-table"
      :columns="columns"
      :row-selection="rowSelection"
      :scroll="{ x: 900 }"
      :bordered="true"
      :row-key="record => record.login.uuid"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="name" slot-scope="text">
        {{ text.first }} {{ text.last }}
      </template>
      <template slot="gender" slot-scope="gender">
        {{ gender }}
      </template>
      <template slot="action" slot-scope="record">
        {{ record.login.uuid }}
      </template>
    </a-table>
    <LeafFletTest></LeafFletTest>
  </div>
</template>

<script>
import FormTest from './FormTest'
import LeafFletTest from '@/components/Leaflet'
const columns = [{
  title: 'Name',
  dataIndex: 'name',
  sorter: true,
  width: '20%',
  scopedSlots: { customRender: 'name' }
}, {
  title: 'Gender',
  dataIndex: 'gender',
  scopedSlots: { customRender: 'gender' },
  // filters: [
  //   {text: 'Male', value: 'male'},
  //   {text: 'Female', value: 'female'}
  // ],
  width: '20%'
}, {
  title: 'Email',
  dataIndex: 'email'
}, {
  title: '操作',
  // key: 'action',
  scopedSlots: { customRender: 'action' }
}]

export default {
  name: 'TableTest',
  components: { FormTest, LeafFletTest },
  props: {},
  data() {
    const selectedRowKeys = []
    return {
      rowSelection: {
        onChange(selectedRowKeys, selectedRows) {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.selectedRowKeys = selectedRowKeys
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows)
        },
        selectedRowKeys: selectedRowKeys
      },
      selectedRowKeys: selectedRowKeys,
      columns,
      data: [],
      pagination: {
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
  computed: {},
  watch: {},
  created() {
    this.fetch()
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    fetch(params = {}) {
      console.log('params:', params)
      this.loading = true
      this.$get('https://randomuser.me/api', {
        results: 10,
        ...params
      }).then(({ data }) => {
        const pagination = { ...this.pagination }
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = 200
        this.loading = false
        this.data = data.results
        this.pagination = pagination
      })
    }
  }
}
</script>

<style lang="less" scoped>
.test-table {
  width: 100%
}
</style>
