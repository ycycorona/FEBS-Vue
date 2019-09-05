<template>
  <div class="table-page-search-wrapper full-width">
    <!-- {{ userId }} {{ defaultTab }} -->
    <a-form layout="inline" :form="filterForm">
      <a-row :gutter="24">
        <a-col :span="4" :xl="3">
          <a-form-item label="设备型号">
            <a-select
              v-decorator="['device',{
                initialValue: deviceListOpt[0].value
              }]"
              :options="deviceListOpt"
              @onChange="deviceChange"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="20" :xl="21" style="text-align:right">
          <span>
            <a-button style="margin-left: 15px" type="primary" @click="search">导出</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <div>
      <a-row :gutter="24">
        <a-col :span="4">
          <div>
            <div>联系人</div>
            <div>短信</div>
            <div>通话记录</div>
          </div>
        </a-col>
        <a-col :span="4"></a-col>
        <a-col :span="16">
          <div>手机 15689951093</div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
const TabList = ['contacts', 'sms', 'callLog']
export default {
  name: 'DataViewer',
  components: { },
  props: {
    userId: {
      default: '',
      type: [String, Number]
    },
    defaultTab: {
      default: 'contacts',
      type: String
    }
  },
  data() {
    return {
      filterForm: this.$form.createForm(this),
      deviceListOpt: [],
      currentDevice: '',
      currentTab: ''
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
  },
  methods: {
    deviceChange() {

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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
