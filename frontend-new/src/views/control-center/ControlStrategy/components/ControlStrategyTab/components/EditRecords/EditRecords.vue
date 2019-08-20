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
      <simple-li>
        <div>
          <span>2019.8.9 14:59</span>
          <span style="float:right">
            <a-button type="default" size="small" @click="openControlStrategyPop">详情</a-button>
          </span>
        </div>
      </simple-li>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button style="margin-right: .8rem" @click="onClose">取消</a-button>
    </div>
    <CreateControlStrategyPop
      :read-only="true"
      :is-edit-page="true"
      :visible.sync="controlStrategyPopVisiable"
      :edit-id="recordId"
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
      recordId: '',
      recordList: []
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
          this.editRecordsList = this.getModfyRecordListById() || []
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
    openControlStrategyPop() {
      this.recordId = 2
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
