<template>
  <a-spin :spinning="loading" class="pop-center-spin">
    <div :class="[multipage === true ? 'multi-page':'single-page', 'not-menu-page', 'home-page']">
      <a-row :gutter="24">
        <a-col :span="19">
          <div class="head-status-wrap home-card-wrap">
            <div v-for="(item, index) in headInfo" :key="index">
              <div>
                <img :src="item.img" alt="" class="head-info-img">
                <span class="head-info-num">{{ item.count }}</span>
              </div>
              <div class="head-info-sub">{{ item.title }}</div>
            </div>
          </div>
          <div class="home-card-wrap home-map-wrap">
            <div class="map-render-area">
              <HomeMap
                v-if="showMap"
                style="z-index:1"
                :fence-list="fenceList"
                :phone-list="phoneList"
              ></HomeMap>
            </div>
          </div>
        </a-col>
        <a-col :span="5">
          <a-card title="报警消息" :bordered="false" style="width: 100%;height: 534px;">
            <a slot="extra" href="#">更多>></a>
            <div class="alarm-list-wrap">
              <a-spin :spinning="popoverLoading" class="pop-center-spin">
                <div
                  v-for="(item,index) in alarmRecordsDetail"
                  :key="index"
                  class="violation-record-li-wrap"
                >
                  <div class="flex-wrap">
                    <div class="flex-item">
                      <div class="time">{{ item.createTime }}</div>
                      <div class="msg">
                        <span class="user-name">{{ item.userName }}</span> <span>{{ item.alarmContent }}</span>
                      </div>
                    </div>
                    <div class="flex-item" style="text-align: right">
                      <a-button v-if="item.dealStatus===0" type="primary" size="small" ghost style="vertical-align: -6px;" @click="openDealAlarmPop(item.id)">处理</a-button>
                      <a-button v-else type="default" size="small" disabled style="vertical-align: -6px;">已处理</a-button>
                    </div>
                  </div>
                  <a-divider class="inline-divider" />
                </div>
              </a-spin>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="24" style="margin-top: 24px">
        <a-col :span="24">
          <a-card title="审计分析" :bordered="false" style="width: 100%">
            <a slot="extra" href="#">更多>></a>
            <AnalysisGraphArea></AnalysisGraphArea>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <DealAlarmModal
      :visible.sync="dealAlarmModalVisible"
      :alarm-id.sync="currentDealAlarmId"
      :opt="{zIndex: 1040}"
    ></DealAlarmModal>
  </a-spin>
</template>
<script>
import ImgControlNumber from '@/assets/imgs/control-number.png'
import ImgDeviceNum from '@/assets/imgs/device-num.png'
import ImgOfflineDevice from '@/assets/imgs/offline-device.png'
import ImgOnlineDevice from '@/assets/imgs/online-device.png'
import ImgUnhandledAlarm from '@/assets/imgs/unhandled-alarm.png'
import AnalysisGraphArea from '@/views/analysis/AnalysisGraphArea.vue'

const headInfo = [
  {
    title: '管控人数',
    img: ImgControlNumber,
    count: null
  },
  {
    title: '设备总数',
    img: ImgDeviceNum,
    count: null
  },
  {
    title: '在线设备',
    img: ImgOnlineDevice,
    count: null
  },
  {
    title: '离线设备',
    img: ImgOfflineDevice,
    count: null
  },
  {
    title: '未处理报警',
    img: ImgUnhandledAlarm,
    count: null
  }
]
const headInfoNameList = ['userCount', 'allPhoneCount', 'onlinePhoneCount', 'offlinePhoneCount', 'undealAlarmCount']
import { mapState } from 'vuex'
import DealAlarmModal from '@/views/alarm-message/components/DealAlarmModal'
import HomeMap from '@/views/home-components/HomeMap'

export default {
  name: 'HomePage',
  components: {
    DealAlarmModal,
    HomeMap, AnalysisGraphArea
  },
  data() {
    return {
      headInfo,
      loading: false,
      popoverLoading: false,
      alarmRecordsDetail: [],
      dealAlarmModalVisible: false,
      currentDealAlarmId: '',
      showMap: false,
      fenceList: [],
      phoneList: []
    }
  },
  computed: {
    ...mapState({
      multipage: state => state.setting.multipage,
      user: state => state.account.user
    }),
    avatar() {
      return `/static/avatar/${this.user.avatar}`
    }
  },
  created() {
    this.handleInfo_1()
    this.handleInfo_2()
  },
  mounted() {

  },
  methods: {
    async handleInfo_1() {
      const info = await this.getInfo_1()
      headInfo.forEach((item, index) => {
        item.count = info[headInfoNameList[index]]
      })
      this.alarmRecordsDetail = info.alarmList.slice(0, 6) // 显示前6个
    },
    async handleInfo_2() {
      const info_2 = await this.getInfo_2()
      this.fenceList = info_2.fenceList
      this.phoneList = info_2.phoneListForMap
      this.showMap = true
    },
    getInfo_1() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/index/getIndexData1')
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.data)
            } else {
              reject(res.data.message)
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    getInfo_2() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/index/getIndexData2')
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.data)
            } else {
              reject(res.data.message)
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    // 处理报警
    openDealAlarmPop(alarmId) {
      this.currentDealAlarmId = alarmId
      this.dealAlarmModalVisible = true
    }
  }
}
</script>
<style lang="less">
  .home-page {
    background: transparent;
    padding: 0;
    border: none;
    .home-card-wrap {
      background: #fff;
      padding: 16px 32px;
      height: 100px;
    }
    .head-status-wrap {

      display: flex;
      &>div{
        flex: 1 0 auto;
        cursor: pointer;
      }
    }
    .home-map-wrap {
      box-sizing: content-box;
      height: 400px;
      margin-top: 24px;
      padding: 5px;
    }
    .alarm-list-wrap {

    }
  }
  .head-info-img {
    width: 30px;
    vertical-align: sub;
  }
  .head-info-num {
    font-size: 25px;
    padding-left: 12px;
    // font-weight: 700
  }
  .head-info-sub {
    margin-left: 40px
  }

  .violation-record-li-wrap {
    .time, .msg {
      font-size: 12px;
      .user-name {
        padding-right: 0.5rem
      }
    }
    .time {
      color: #A9A9A9;
    }
  }

</style>
