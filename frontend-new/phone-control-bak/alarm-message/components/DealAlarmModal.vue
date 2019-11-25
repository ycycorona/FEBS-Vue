<template>
  <div class="deal-alarm-pop">
    <a-modal
      :width="600"
      title="处理结果"
      :body-style="{height: 'auto'}"
      :visible="visible"
      destroy-on-close
      v-bind="opt"
      @cancel="dealPopCancel"
      @ok="dealPopOk"
    >
      <a-spin :spinning="loading">
        <a-row :gutter="16" style="height:100%">
          <a-col :span="24">
            <a-textarea v-model="dealContent" placeholder="请输入处理结果" :rows="8" />
          </a-col>
        </a-row>
      </a-spin>

    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'DealAlarmModal',
  components: { },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    alarmId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    opt: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      dealContent: '',
      loading: false
    }
  },
  computed: {

  },
  watch: {
    visible: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
        // 显示
          if (this.isEdit) {
            await this.getAlarmDetail()
          }
        } else {
        // 销毁
          this.dealContent = ''
        }
      }
    }
  },
  created() {

  },
  methods: {
    dealPopCancel() {
      this.resetParams()
    },
    async dealPopOk() {
      if (this.isEdit) {
        await this.doUpdateDealAlarm()
        this.$message.info('更新处理结果成功')
      } else {
        await this.doDealAlarm()
        this.$message.info('处理成功')
      }
      this.resetParams()
    },
    resetParams() {
      this.$emit('update:visible', false)
      this.$emit('update:alarmId', '')
      this.$emit('update:isEdit', false)
      this.dealContent = ''
    },
    getAlarmDetail() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/alarm/getAlarmDealContent', {
          alarmId: this.alarmId
        })
          .then(r => {
            if (r.data.state === 1) {
              this.dealContent = r.data.data.dealContent
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
    doDealAlarm() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$post('/business/alarm/dealAlarm', {
          dealContent: this.dealContent,
          alarmId: this.alarmId
        })
          .then(r => {
            if (r.data.state === 1) {
              resolve()
            } else {
              reject()
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    doUpdateDealAlarm() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$post('/business/alarm/updateAlarmDealContent', {
          dealContent: this.dealContent,
          alarmId: this.alarmId
        })
          .then(r => {
            if (r.data.state === 1) {
              resolve()
            } else {
              reject()
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
