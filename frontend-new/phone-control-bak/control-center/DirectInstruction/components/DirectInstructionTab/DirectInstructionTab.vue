<template>
  <div>
    <div>
      <a-button
        :disabled="selectedRowKeys.length===0"
        type="primary"
        style="border-radius:45px!important;"
        @click="openSendPop"
      >
        <icon-send-white title="下发" /><span style="margin-left: 3px;">选人并下发</span>
      </a-button>
    </div>
    <!-- 表格区域 -->
    <a-table
      ref="direct-instruction-tab-table"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      style="width:50%;margin-top:10px"
      :row-key="record => record.id"
      :columns="columns"
      :scroll="{x: 600}"
      :data-source="dirsList"
      :pagination="false"
      :loading="false"
      @change="handleTableChange"
    >
      <template v-slot:params="record">
        <!-- :default-value="directiveConfigList[record.id].opts[0].value" -->
        <a-select
          v-if="selectedRowKeys.findIndex(key => key===record.id)!==-1"
          v-model="dirParams[record.id]"
          style="width: 80%"
          :disabled="directiveConfigList[record.id].configIsFixed===1"
          :mode=" directiveConfigList[record.id].isMulti ? 'multiple' : 'default'"
          :options="directiveConfigList[record.id].opts"
        >
        </a-select>
      </template>
    </a-table>
    <user-picker-pop
      :visible.sync="userPickerPopVisible"
      @success="doSubmit"
    ></user-picker-pop>
  </div>
</template>

<script>
import IconSendWhite from '@/components/icons/IconSendWhite'
import UserPickerPop from '@/components/UserPickerPop'
export default {
  name: 'DirectInstructionTab',
  components: { IconSendWhite, UserPickerPop },
  props: {},
  data() {
    return {
      loading: false,
      selectedRowKeys: [],
      dataSource: [

      ],
      dirParams: [],
      dirsList: [],
      directiveConfigList: [],
      columns: [
        {
          title: '指令名称',
          dataIndex: 'typeName',
          width: 200
        },
        {
          title: '指令参数',
          scopedSlots: { customRender: 'params' }
        }
      ],
      userPickerPopVisible: false
    }
  },
  computed: {},
  watch: {},
  async created() {
    this.dirsList = await this.getDirsList()
    // console.log(this.dirsList)

    const directiveConfigList = []
    const directiveConfigRaw = await this.getDirectiveConfig(this.dirsList.map(item => item.id).join(','))
    directiveConfigRaw.forEach(item => {
      directiveConfigList[item.id] = {
        opts: item.configList.map(item => {
          return { value: item.id, label: item.configName }
        }),
        configIsFixed: item.configIsFixed,
        isMulti: false,
        title: item.typeName }
    })
    this.directiveConfigList = directiveConfigList
    this.dirsList.forEach(item => {
      this.dirParams[item.id] = directiveConfigList[item.id].opts[0].value
    })
  },

  methods: {
    handleTableChange() {

    },
    onSelectChange(selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 打开下发弹窗
    openSendPop() {
      this.userPickerPopVisible = true
    },
    getDirsList() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/instant-send-record/getInstantTypeList')
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
    // 获取各指令配置项
    getDirectiveConfig(typeIds) {
      return new Promise((resolve, reject) => {
        this.$get('/business/command-config/getConfigListByTypeId', {
          typeIds
        })
          .then(res => {
            if (res.data.state === 1) {
              // 提出固定配置的指令配置选项
              resolve(res.data.rows/* .filter(item => item.configIsFixed === 0) */)
            } else {
              reject('获取数据失败')
            }
          })
      })
    },
    async doSubmit(selectUser) {
      // console.log(selectUser.map(item => item.id))
      // console.log(this.dirParams.filter(item => true).join(','))
      await this.pushDirs(this.dirParams.filter(item => true).join(','),
        selectUser.map(item => item.db_id).join(','))
    },
    pushDirs(configIds, pickUids) {
      return new Promise((resolve, reject) => {
        this.$post('/business/instant-send-record/pushInstant', {
          configIds, pickUids
        })
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.data)
              this.$message.info('指令下发成功')
            } else {
              reject('失败')
            }
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
