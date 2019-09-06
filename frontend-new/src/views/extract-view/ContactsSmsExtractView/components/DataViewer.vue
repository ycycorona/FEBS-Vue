<template>
  <div class="table-page-search-wrapper full-width full-height flex-wrap flex-colomn data-viewer">
    <!-- {{ userId }} {{ defaultTab }} -->
    <div class="flex-item" style="flex-grow: 0">
      <a-form layout="inline" :form="filterForm">
        <a-row :gutter="24">
          <a-col :span="4" :xl="3">
            <a-form-item label="设备型号">
              <a-select
                v-decorator="['device',{
                  initialValue: deviceListOpt[0] ? deviceListOpt[0].value : ''
                }]"
                :options="deviceListOpt"
                @change="deviceChange"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="20" :xl="21" style="text-align:right">
            <span>
              <a-button style="margin-left: 15px" type="primary" @click="doExport">导出</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-row :gutter="0" style="height: 100%" class="flex-item out-border">
      <a-col :span="4" class="full-height grey-back border-right">
        <a-menu
          v-model="selectedTabKeys"
          class="grey-back-menu"
        >
          <a-menu-item v-for="(item, index) in TabList" :key="item">{{ TabTextList[index] }}</a-menu-item>
        </a-menu>
      </a-col>
      <template v-if="selectedTabKeys[0]!=='callLog'">
        <a-col :span="4" class="full-height grey-back border-right">
          <a-menu
            v-model="selectedItemKeys"
            class="grey-back-menu"
          >
            <template v-if="selectedTabKeys[0]==='contacts'">
              <a-menu-item v-for="(item, index) in currentContactsList" :key="item.id">{{ item.extractLinkman }}</a-menu-item>
            </template>
            <template v-if="selectedTabKeys[0]==='sms'">
              <a-menu-item v-for="(item, index) in currentSmsList" :key="item.id">{{ item.number }}{{ item.fileTime }}</a-menu-item>
            </template>
          </a-menu>
          <div class="posi-bottom">
            <a-pagination v-bind="smsPagination" simple style="text-align: center;" />
          </div>
        </a-col>
        <a-col :span="16" class="full-height">
          <div>手机 15689951093</div>
          <div class="posi-bottom">
            <a-pagination v-bind="callLogPagination" simple style="text-align: center;" />
          </div>
        </a-col>
      </template>
      <template v-else>
        <a-col :span="20" class="full-height">
          <template v-if="selectedTabKeys[0]==='callLog'">
            <a-menu-item v-for="(item, index) in currentCallLogList" :key="item.id">{{ item.callDuration }}</a-menu-item>
          </template>
        </a-col>
      </template>
    </a-row>
  </div>
</template>

<script>
const PageSize = 10
const TabList = ['contacts', 'sms', 'callLog']
const TabTextList = ['通讯录', '短信', '通话记录']
export default {
  name: 'DataViewer',
  components: { },
  props: {
    userId: {
      default: '',
      type: [String, Number]
    },
    defaultTab: {
      default: TabList[0],
      type: String
    }
  },
  data() {
    return {
      TabList, TabTextList,
      filterForm: this.$form.createForm(this),
      deviceListOpt: [],
      currentDevice: '',
      currentTab: '',
      selectedTabKeys: [this.defaultTab], // 当前选中的显示项目
      selectedItemKeys: [],
      currentContactsList: [],
      currentSmsList: [],
      currentCallLogList: [],
      smsPagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: 10
      },
      callLogPagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: 10
      }

    }
  },
  computed: {

  },
  watch: {

  },
  async created() {
    this.currentTab = this.defaultTab
    this.deviceListOpt = await this.getDeviceListOpt()
    this.currentDevice = this.deviceListOpt[0].value
    this.getMultiDataList(PageSize, 1)
  },
  methods: {
    // 切换手机
    async deviceChange(val) {
      this.currentDevice = val
      this.getMultiDataList(PageSize, 1)
    },
    // 同时获取通讯录、短信、通话记录列表的第一页
    async getMultiDataList(pageSize, pageNum) {
      this.currentContactsList = await this.getContacts()
      this.getSms({ pageSize, pageNum })
      this.getCallLog({ pageSize, pageNum })
    },
    // 获取设备列表
    getDeviceListOpt() {
      return new Promise((resolve, reject) => {
        this.$get('/business/address-book-content/getPhoneListForSelectBoxByUserId', {
          userId: this.userId
        })
          .then(res => {
            if (res.data.state === 1) {
              const list = res.data.data
              const deviceListOpt = list.map(item => {
                return {
                  value: item.id,
                  label: item.phoneModel
                }
              })
              resolve(deviceListOpt)
            } else {
              reject('获取数据失败')
            }
          })
      })
    },
    // 获取通讯录
    getContacts() {
      return new Promise((resolve, reject) => {
        this.$get('/business/address-book-content/getAddressBookByPhoneId', {
          phoneId: this.currentDevice
        })
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.data)
            } else {
              reject('获取数据失败')
            }
          })
      })
    },
    // 获取短信
    getSms(params) {
      return new Promise((resolve, reject) => {
        this.$get('/business/address-book-content/getShortMessageListByQuery', {
          ...params, phoneId: this.currentDevice
        }).then((r) => {
          const data = r.data
          const pagination = { ...this.smsPagination }
          this.currentSmsList = data.rows
          pagination.total = data.total
          this.smsPagination = pagination
          resolve()
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 获取通话记录
    getCallLog(params) {
      return new Promise((resolve, reject) => {
        this.$get('/business/address-book-content/getCallLogListByQuery', {
          ...params, phoneId: this.currentDevice
        }).then((r) => {
          const data = r.data
          const pagination = { ...this.callLogPagination }
          this.currentCallLogList = data.rows
          pagination.total = data.total
          this.callLogPagination = pagination
          resolve()
        }).catch((err) => {
          reject(err)
        })
      })
    },
    doExport() {

    }
  }
}
</script>

<style lang="less" scoped>
@greyBackColor: #F9F9F9;
@greyBorderColor: #EEEEEE;
/deep/ .data-viewer-list-item {
  &.selected {
    background-color: #DBEBFF
  }
}
.grey-back {
  background-color: @greyBackColor
}
.grey-back-menu.ant-menu {
  background-color: @greyBackColor
}
.border-right {
  border-right: 2px solid @greyBorderColor
}
.out-border {
  border: 2px solid @greyBorderColor
}
.posi-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 5px 0;
  background: white;
}
</style>
