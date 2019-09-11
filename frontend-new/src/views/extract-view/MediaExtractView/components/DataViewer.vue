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
          <a-col :span="8" :xl="6">
            <a-form-item label="日期">
              <a-range-picker
                v-decorator="['dateRange']"
              >
              </a-range-picker>
            </a-form-item>
          </a-col>
          <a-col :span="12" :xl="15" style="text-align:right">
            <span>
              <!-- <a-button style="margin-left: 15px" type="primary" @click="doExport(selectedTabKeys[0])">导出当前 {{ TabTextList[TabList.indexOf(selectedTabKeys[0])] }}</a-button> -->
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
          @select="onTabSelect"
        >
          <a-menu-item v-for="(item, index) in TabList" :key="item">{{ TabTextList[index] }}</a-menu-item>
        </a-menu>
      </a-col>
      <!-- 图片 -->
      <template v-if="selectedTabKeys[0]==='image'">
        <a-col :span="20" class="full-height padding-normal" style="overflow: auto">
          <a-spin :spinning="listLoading">
            <div>123</div>
          </a-spin>
          <div class="posi-bottom">
            <a-pagination v-if="imageList.length!==0" v-bind="imagePagination" simple style="text-align: center;" @change="onImagePaginationChange" />
          </div>
        </a-col>
      </template>
      <!-- 文档 -->
      <template v-if="selectedTabKeys[0]==='document'">
        <a-col :span="20" class="full-height padding-normal" style="overflow: auto">
          <a-spin :spinning="listLoading">
            <a-list
              item-layout="horizontal"
              :data-source="documentList"
            >
              <a-list-item slot="renderItem" slot-scope="item, index" class="call-log-item">
                <div class="flex-item third-width flex-wrap">
                  {{ item.fileName + item.fileSuffix }}
                </div>
                <div class="flex-item third-width">
                  {{ item.fileSize }}KB
                </div>
                <div class="flex-item third-width">
                  {{ fileTime | callLogDateFil }}
                </div>
              </a-list-item>
            </a-list>
          </a-spin>
          <div class="posi-bottom">
            <a-pagination v-if="documentList.length!==0" v-bind="documentPagination" simple style="text-align: center;" @change="onDocumentPaginationChange" />
          </div>
        </a-col>
      </template>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
const PageSize = 10
const TabList = ['image', 'video', 'audio', 'document']
const TabTextList = ['图片', '视频', '音频', '文件']
const urlMap = {
  'image': '/business/media-file-content/getMediaImageByQuery',
  'video': '/business/media-file-content/getMediaVideoByQuery',
  'audio': '/business/media-file-content/getMediaAudioByQuery',
  'document': '/business/media-file-content/getMediaDocumentByQuery'
}
const paginationMap = {
  'image': 'imagePagination',
  'video': 'videoPagination',
  'audio': 'audioPagination',
  'document': 'documentPagination'
}
const currentListMap = {
  'image': 'imageList',
  'video': 'videoList',
  'audio': 'audioList',
  'document': 'documentList'
}

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
      selectedTabKeys: [this.defaultTab], // 当前选中的显示项目
      imageList: [],
      videoList: [],
      audioList: [],
      documentList: [],
      imagePagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: PageSize
      },
      videoPagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: PageSize
      },
      audioPagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: PageSize
      },
      documentPagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: PageSize
      },
      listLoading: false
    }
  },
  computed: {

  },
  watch: {

  },
  async created() {
    this.deviceListOpt = await this.getDeviceListOpt()
    this.currentDevice = this.deviceListOpt[0].value
    this.getDataList(this.selectedTabKeys[0], 1)
  },
  methods: {
    // 切换手机
    async deviceChange(val) {
      this.currentDevice = val
      this.resetList()
      this.getDataList(this.selectedTabKeys[0], 1)
    },
    // 获取列表
    async getDataList(tabKeys, pageNum) {
      this.listLoading = true
      const params = {
        phoneId: this.currentDevice,
        PageSize, pageNum
      }
      if (this.startDate && this.endDate) {
        params.startDate = this.this.startDate
        params.endDate = this.this.endDate
      }
      return new Promise((resolve, reject) => {
        this.$get(urlMap[tabKeys], params)
          .then((r) => {
            const data = r.data
            const pagination = { ...this[paginationMap[tabKeys]] }
            this[currentListMap[tabKeys]] = data.rows
            pagination.total = data.total
            this[paginationMap[tabKeys]] = pagination
            resolve()
          }).catch((err) => {
            reject(err)
          }).finally(() => {
            this.listLoading = false
          })
      })
    },

    // 获取设备列表
    getDeviceListOpt() {
      return new Promise((resolve, reject) => {
        this.$get('/business/media-file-content/getPhoneListForSelectBoxByUserId', {
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

    getDetail(number) {
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

          })
      })
    },
    onImagePaginationChange(page, pageSize) {
      this.getDataList(this.selectedTabKeys[0], page)
      this.resetDetailDisplay()
    },
    onVideoPaginationChange(page, pageSize) {
      this.getDataList(this.selectedTabKeys[0], page)
      this.resetDetailDisplay()
    },
    onAudioPaginationChange(page, pageSize) {
      this.getDataList(this.selectedTabKeys[0], page)
      this.resetDetailDisplay()
    },
    onDocumentPaginationChange(page, pageSize) {
      this.getDataList(this.selectedTabKeys[0], page)
      this.resetDetailDisplay()
    },
    resetList() {
      this.imageList = []
      this.videoList = []
      this.audioList = []
      this.documentList = []
    },
    onTabSelect({ key }) {
      this.getDataList(key, 1)
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
  margin-left: -10px
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
  border-radius: 20px;
  margin: 20px 40px 0;
  padding: 10px 20px
}
.sms-date-wrap {
  text-align: right;
  padding-right: 50px;
  margin-bottom: 20px
}
</style>
