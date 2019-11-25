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
                @change="datePickerChange"
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
        <a-col :span="20" class="full-height padding-normal">
          <div class="detail-content-wrap">
            <a-spin :spinning="listLoading">
              <template v-for="item in imageListByDay">
                <div :key="item.day + new Date().valueOf() + 'day'" style="margin:10px auto">{{ item.day }}</div>
                <div :key="item.day + new Date().valueOf() + 'list'" v-viewer="vViewerOpt" class="flex-wrap flex-auto-line">
                  <div
                    v-for="(subItem,index) in item.imageList"
                    :key="subItem.id"
                    class="flex-item-no-grow img-list-item normal-click"
                  >
                    <img :src="subItem.thumbPath" :data-src="subItem.filePath" alt="" class="img-list-img thumb-img">
                    <div>{{ subItem.fileName }}</div>
                  </div>
                </div>
              </template>
              <div style="height:40px">bottom</div>
            </a-spin>
          </div>
          <div class="posi-bottom">
            <a-pagination v-if="imageListByDay.length!==0" v-bind="imagePagination" simple style="text-align: center;" @change="onImagePaginationChange" />
          </div>
        </a-col>
      </template>
      <!-- 视频 -->
      <template v-if="selectedTabKeys[0]==='video'">
        <a-col :span="20" class="full-height padding-normal">
          <div class="detail-content-wrap">
            <a-spin :spinning="listLoading">
              <template v-for="item in videoList">
                <div :key="item.day + new Date().valueOf() + 'day'" style="margin:10px auto">{{ item.day }}</div>
                <div :key="item.day + new Date().valueOf() + 'list'" class="flex-wrap flex-auto-line">
                  <div
                    v-for="(subItem, index) in item.videoList"
                    :key="subItem.id"
                    class="flex-item-no-grow img-list-item normal-click"
                    @click="viewDetailVideo(subItem.filePath)"
                  >
                    <img :src="subItem.filePicPath" alt="" class="img-list-img thumb-img">
                    <div>{{ subItem.fileName }}</div>
                    <div>{{ subItem.fileSize }}<a-icon class="blue-normal-click normal-click" type="download" @click.stop="downloadVideo(subItem.filePath)" /></div>
                  </div>
                </div>
              </template>
            </a-spin>
          </div>
          <div class="posi-bottom">
            <a-pagination v-if="videoList.length!==0" v-bind="videoPagination" simple style="text-align: center;" @change="onVideoPaginationChange" />
          </div>
        </a-col>
      </template>
      <!-- 音频 -->
      <template v-if="selectedTabKeys[0]==='audio'">
        <a-col :span="20" class="full-height padding-normal">
          <div class="detail-content-wrap">
            <a-spin :spinning="listLoading">
              <a-list
                item-layout="horizontal"
                :data-source="audioList"
              >
                <a-list-item slot="renderItem" slot-scope="item, index" class="call-log-item">
                  <div class="flex-item  flex-wrap">
                    <span class="down-link" @click="downloadDocument(item.filePath)">
                      <a-icon type="play-circle" style="margin-right:5px" />
                      <span>{{ item.fileName + '.' + item.fileSuffix }}</span>
                    </span>
                  </div>
                  <div class="flex-item third-width" style="width: 50%">
                    {{ item.fileTime | callLogDateFil }}
                  </div>
                </a-list-item>
              </a-list>
            </a-spin>
          </div>
          <div class="posi-bottom">
            <a-pagination v-if="audioList.length!==0" v-bind="audioPagination" simple style="text-align: center;" @change="onAudioPaginationChange" />
          </div>
        </a-col>
      </template>
      <!-- 文档 -->
      <template v-if="selectedTabKeys[0]==='document'">
        <a-col :span="20" class="full-height padding-normal">
          <div class="detail-content-wrap">
            <a-spin :spinning="listLoading">
              <a-list
                item-layout="horizontal"
                :data-source="documentList"
              >
                <a-list-item slot="renderItem" slot-scope="item, index" class="call-log-item">
                  <div class="flex-item third-width flex-wrap">
                    <span class="down-link" @click="downloadDocument(item.filePath)">{{ item.fileName + '.' + item.fileSuffix }}</span>
                  </div>
                  <div class="flex-item third-width">
                    {{ item.fileSize }}KB
                  </div>
                  <div class="flex-item third-width">
                    {{ item.fileTime | callLogDateFil }}
                  </div>
                </a-list-item>
              </a-list>
            </a-spin>
          </div>
          <div class="posi-bottom">
            <a-pagination v-if="documentList.length!==0" v-bind="documentPagination" simple style="text-align: center;" @change="onDocumentPaginationChange" />
          </div>
        </a-col>
      </template>
    </a-row>
    <a-modal
      v-model="videoModalVisibile"
      :width="windowInnerWidth*0.8"
      :style="{}"
      centered
      title="播放视频"
      :body-style="{height: `${windowInnerHeight*0.8}px`,minHeight:'700px'}"
      destroy-on-close
      v-bind="{footer: null}"
      :mask-closable="false"
    >
      <a-row :gutter="16" class="full-height">
        <a-col :span="24" class="full-height">
          <video-player :options="playerOptions"></video-player>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import Vue from 'vue'
Vue.use(Viewer)
Vue.use(VueVideoPlayer, /* {
  options: global default options,
  events: global videojs events
} */)
// build items array
const items = [
  {
    src: 'https://placekitten.com/600/400',
    w: 600,
    h: 400
  },
  {
    src: 'https://placekitten.com/1200/900',
    w: 1200,
    h: 900
  }
]
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
  'image': 'imageListByDay',
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
      playerOptions: {
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          // type: 'video/mp4',
          src: ''
        }],
        poster: '/static/images/author.jpg'
      },
      TabList, TabTextList, items,
      vViewerOpt: {
        // 获取原图
        url(image) {
          return image.dataset.src
        }
      },
      filterForm: this.$form.createForm(this),
      deviceListOpt: [],
      currentDevice: '',
      selectedTabKeys: [this.defaultTab], // 当前选中的显示项目
      imageListByDay: [],
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
      listLoading: false,
      showImgsViewer: false,
      videoModalVisibile: false
    }
  },
  computed: {
    ...mapState({
      windowInnerHeight: state => state.globalState.windowInnerHeight,
      windowInnerWidth: state => state.globalState.windowInnerWidth
    })
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
    async datePickerChange(val) {
      if (val.length === 0) {
        this.startDate = null
        this.endDate = null
      } else {
        this.startDate = val[0].format('YYYY-MM-DD')
        this.endDate = val[1].format('YYYY-MM-DD')
      }
      this.getDataList(this.selectedTabKeys[0], 1)
      console.log(this.startDate, this.endDate)
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
    // 下载文件
    downloadDocument(path) {
      this.$download(path)
    },
    downloadVideo(path) {
      this.$download(path)
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
    },
    viewDetailVideo(filePath) {
      console.log(filePath)
      this.playerOptions.sources[0].src = filePath
      this.videoModalVisibile = true
      // window.open(filePath, '_blank')
    },
    onThumbnailClick(index, imageList) {
      this.viewDetailImg(index, imageList)
    },
    viewDetailImg(index, imageList) {
      this.showImgsViewer = true
      this.$refs['imgsViewer'].open(imageList, index)
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
.detail-content-wrap {
  padding-bottom: 35px;
  overflow: auto;
  height: 100%;
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
.down-link {
  cursor: pointer;
}
.down-link:hover {
  color: blue
}
.img-list-img {

}
.img-list-item{
  margin-right: 10px
}
.img-list-item:last-of-type {
  margin-right: 0
}
.thumb-img {
  width: 110px;
  height: 150px
}
.video-player {
  height: 100%;
}
.video-player /deep/  div.video-js {
  margin: auto
}
</style>
