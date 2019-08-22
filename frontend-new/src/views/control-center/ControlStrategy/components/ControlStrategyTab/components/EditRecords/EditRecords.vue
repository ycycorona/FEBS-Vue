<template>
  <a-drawer
    destroy-on-close
    class="edit-records"
    title="修改记录"
    :mask-closable="true"
    width="650"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-spin size="small" :spinning="isLoading">
      <simple-li v-for="(record, index) in recordList" :key="index">
        <span>{{ record.updateTime }}</span>
        <span style="float:right">
          <a-button type="default" size="small" @click="openControlStrategyPop(record.id)">详情</a-button>
        </span>
      </simple-li>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button style="margin-right: .8rem" @click="onClose">取消</a-button>
    </div>
    <CreateControlStrategyPop
      :read-only="true"
      :is-edit-page="true"
      :visible.sync="controlStrategyPopVisiable"
      :edit-id.sync="currentRecordId"
      @close="handleControlStrategyClose"
    ></CreateControlStrategyPop>
  </a-drawer>

</template>

<script>
import CreateControlStrategyPop from '../../CreateControlStrategyPop'
import SimpleLi from '@/components/fragment/SimpleLi'
export default {
  name: 'EditReocrds',
  components: { SimpleLi, CreateControlStrategyPop },
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    strategyId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      controlStrategyPopVisiable: false,
      currentRecordId: '',
      recordList: []
    }
  },
  computed: {

  },
  watch: {
    visible: {
      immediate: false,
      async handler(newVal) {
        if (newVal) {
        // 显示
          this.recordList = await this.getModfyRecordListById() || []
        } else {
        // 销毁

        }
      }
    }
  },
  created() {

  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    getModfyRecordListById() {
      return new Promise((resolve, reject) => {
        this.$get('/business/cmd-strategy-record/getModfyRecordListById', {
          strategyId: this.strategyId
        })
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.rows)
            } else {
              reject('获取数据失败')
            }
          })
      })
    },
    handleControlStrategyClose() {

    },
    openControlStrategyPop(id) {
      this.currentRecordId = id
      this.controlStrategyPopVisiable = true
    }
  }
}
</script>

<style lang="less" scoped>
#dateRange {
  width: 100%
}
</style>
