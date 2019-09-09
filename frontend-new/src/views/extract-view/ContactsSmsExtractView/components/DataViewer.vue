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

      <template v-if="selectedTabKeys[0]==='contacts'">
        <a-col :span="4" class="full-height grey-back border-right">
          <a-menu
            class="grey-back-menu"
            @select="onContactSelect"
          >
            <a-menu-item v-for="(item, index) in currentContactsList" :key="`${index}-${item.id}`">{{ item.extractLinkman }}</a-menu-item>
          </a-menu>
          <div v-if="currentContactsList.length===0" class="ant-list-empty-text">暂无数据</div>
        </a-col>
        <a-col :span="16" class="full-height">
          <template v-if="currentDisplayContact">
            <div class="flex-wrap padding-normal">
              <div class="flex-item-no-grow">
                <img src="@/assets/imgs/phone_avatar_l.png" width="80">
              </div>
              <div class="flex-item-no-grow contact-person-wrap">
                <div class="contact-person-name">{{ currentDisplayContact.extractLinkman }}</div>
                <div class="contact-person-tel">
                  <a-icon type="phone" theme="filled" />
                  <span>{{ currentDisplayContact.extractNumber }}</span>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="ant-list-empty-text">暂无数据</div>
        </a-col>
      </template>
      <!-- 短信 -->
      <template v-if="selectedTabKeys[0]==='sms'">
        <a-col :span="4" class="full-height grey-back border-right">
          <a-spin :spinning="smsDetailLoading">
            <a-menu
              class="grey-back-menu"
              @select="onSmsSelect"
            >
              <a-menu-item v-for="(item, index) in currentSmsList" :key="`${item.number}-${item.id}`">
                <span>{{ item.linkman || item.number }}</span>
                <span style="float: right">{{ item.fileTime | callLogDateFil }}</span>
              </a-menu-item>
            </a-menu>
          </a-spin>
          <div class="posi-bottom">
            <a-pagination v-if="currentSmsList.length!==0" v-bind="smsPagination" simple style="text-align: center;" @change="onSmsPageChange" />
          </div>
          <div v-if="currentSmsList.length===0" class="ant-list-empty-text">暂无数据</div>
        </a-col>
        <a-col :span="16" class="full-height padding-normal">

          <template v-if="currentDisplaySms">
            <div v-for="item in currentDisplaySms.messagelist" :key="item.id">
              <div class="sms-text-wrap">
                {{ item.messageContent }}
              </div>
              <div class="sms-date-wrap">
                {{ item.fileTime }}
              </div>
            </div>
          </template>
          <div v-else class="ant-list-empty-text">暂无数据</div>
        </a-col>
      </template>
      <!-- 通话记录 -->
      <template v-if="selectedTabKeys[0]==='callLog'">
        <a-col :span="20" class="full-height padding-normal">
          <a-spin :spinning="callLogDetailLoading">
            <a-list
              item-layout="horizontal"
              :data-source="currentCallLogList"
            >
              <a-list-item slot="renderItem" slot-scope="item, index" class="call-log-item">
                <div class="flex-item third-width flex-wrap">
                  <div class="padding-top-5">
                    <img src="@/assets/imgs/phone_avatar_s.png" alt="">
                  </div>
                  <div class="margin-left-10">
                    <template v-if="item.callWay===1">
                      <div>{{ item.linkman || item.number }}</div>
                      <div class="pale-text">
                        {{ item.linkman ? item.number : '陌生号码' }}
                        <img src="@/assets/imgs/in-call.png" alt="">
                      </div>
                    </template>
                    <template v-else-if="item.callWay===2">
                      <div>{{ item.linkman || item.number }}</div>
                      <div class="pale-text">
                        {{ item.linkman ? item.number : '陌生号码' }}
                        <img src="@/assets/imgs/out-call.png" alt="">
                      </div>
                    </template>
                    <template v-else>
                      <div class="missed-call">{{ item.linkman || item.number }}</div>
                      <div class="pale-text">{{ item.linkman ? item.number : '陌生号码' }}</div>
                    </template>
                  </div>
                </div>
                <div class="flex-item third-width">{{ item.extractTime | callLogDateFil }}</div>
                <div class="flex-item third-width">{{ item.callDuration }} 秒</div>
              </a-list-item>
            </a-list>
          </a-spin>
          <div class="posi-bottom">
            <a-pagination v-if="currentCallLogList.length!==0" v-bind="callLogPagination" simple style="text-align: center;" @change="onCallLogPageChange" />
          </div>
        </a-col>
      </template>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
const PageSize = 1
const TabList = ['contacts', 'sms', 'callLog']
const TabTextList = ['通讯录', '短信', '通话记录']
export default {
  name: 'DataViewer',
  components: { },
  filters: {
    callLogDateFil(val) {
      return moment(val).format('YYYY年MM月DD日 HH:mm')
    }
  },
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
      currentDisplayContact: null,
      currentDisplaySms: null,
      currentDisplayCallLog: null,
      smsPagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: PageSize
      },
      callLogPagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: PageSize
      },
      callLogDetailLoading: false,
      smsDetailLoading: false
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
      this.smsDetailLoading = true
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
        }).finally(() => {
          this.smsDetailLoading = false
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
    getSmsDetail(number) {
      return new Promise((resolve, reject) => {
        this.$get('/business/address-book-content/getShortMessageContentByNumber', {
          number, phoneId: this.currentDevice
        })
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.data)
            } else {
              reject('获取数据失败')
            }
          }).finally(() => {
            this.smsDetailLoading = false
          })
      })
    },
    doExport() {

    },
    onContactSelect({ key }) {
      const arrayIndex = Number(key.split('-')[0])
      this.currentDisplayContact = this.currentContactsList[arrayIndex]
    },
    async onSmsSelect({ key }) {
      console.log(key)
      const number = Number(key.split('-')[0])
      const smsDetail = await this.getSmsDetail(number)
      this.currentDisplaySms = smsDetail
    },
    onCallLogPageChange(page, pageSize) {
      this.getCallLog({ pageSize: pageSize, pageNum: page })
    },
    onSmsPageChange(page, pageSize) {
      this.getSms({ pageSize: pageSize, pageNum: page })
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
.contact-person-wrap  {
  margin-left: 20px;
  & > div {
    height: 40px;
  }
  .contact-person-name {
    font-size: 25px;
  }
  .contact-person-tel {
    font-size: 18px;
  }
}
.padding-normal {
  padding: 10px;
}
.third-width {
  width: 33.33333%;
}
.margin-left-10 {
  margin-left: 10px;
}
.padding-top-5 {
  padding-top: 5px;
}
.call-log-item /deep/ .ant-list-item-content {
  align-items:center;
}
.missed-call {
  color: red
}
.pale-text {
  color: rgba(0, 0, 0, 0.45)
}
.sms-text-wrap {
  background-color: #F7F7F7;
  border-radius: 20px
}
</style>
