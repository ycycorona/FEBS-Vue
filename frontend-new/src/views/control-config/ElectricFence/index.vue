<template>
  <div class="electric-fence-wrap full-width table-page-search-wrapper">
    <!-- 表单区域 -->
    <a-spin :spinning="isMapLoading">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :span="10" :xl="8">
            <a-form-item
              label="电子围栏名称"
            >
              <a-input
                v-decorator="[
                  'electricFenceName'
                ]"
                placeholder="请输入电子围栏名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" :xl="6">
            <a-form-item
              label="性质"
            >
              <a-input
                v-decorator="[
                  'electricFenceType'
                ]"
                placeholder="请选择电子围栏性质"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8" :xl="6">
            <a-form-item
              class="padding-left"
              label="中心位置"
            >
              <a-input
                v-decorator="[
                  'electricFenceName'
                ]"
                placeholder="请输入关键字进行搜索"
              />
            </a-form-item>

          </a-col>
          <a-col :span="2" :xl="2">
            <a-button type="primary">搜索</a-button>
          </a-col>
          <a-col :span="4" :xl="3">
            <a-form-item
              label="半径"
            >
              <a-input
                v-decorator="[
                  'electricFenceRadius'
                ]"
                placeholder="请输入半径"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" :xl="3">
            <a-form-item
              label="经度"
            >
              <a-input
                v-decorator="[
                  'electricFenceX'
                ]"
                placeholder="请输入经度"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" :xl="3">
            <a-form-item
              label="纬度"
            >
              <a-input
                v-decorator="[
                  'electricFenceY'
                ]"
                placeholder="请输入纬度"
              />
            </a-form-item>
          </a-col>

        </a-row>
        <a-row :gutter="24">
          <a-col :span="8" :xl="6">
            <a-button v-if="!isHaveCurrentCircle" type="primary" class="margin-right" @click="activeAddCircleTool">围栏添加</a-button>
            <template v-else>
              <a-button :disabled="isEditCircleToolOn" type="danger" class="margin-right" @click="delCurrentCircle">删除已有围栏</a-button>
              <a-button v-if="!isEditCircleToolOn" type="primary" @click="activeEditCircleTool">围栏编辑</a-button>
              <a-button v-else type="danger" @click="deActiveEditCircleTool">停止 围栏编辑</a-button>
            </template>
          <!-- <a-button type="primary">搜索</a-button> -->
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <a-alert
      v-if="isAddCircleToolOn"
      style="margin-top:8px"
      :message="addCircleToolTips"
      type="info"
      show-icon
    />
    <a-alert
      v-if="isEditCircleToolOn"
      style="margin-top:8px"
      :message="editCircleToolTips"
      type="info"
      show-icon
    />
    <electric-fence-map
      ref="electric-fence-map"
      style="margin-top:8px"
      @map-init-success="isMapLoading=false"
      @add-circle-tool-off="isAddCircleToolOn=false"
      @add-circle-tool-on="isAddCircleToolOn=true"
      @circle-editor-off="isEditCircleToolOn=false"
      @circle-editor-on="isEditCircleToolOn=true"
      @have-current-circle="isHaveCurrentCircle=true"
      @no-current-circle="isHaveCurrentCircle=false"
    ></electric-fence-map>
  </div>
</template>
<script>
import ElectricFenceMap from '@/components/utils/ElectricFenceMap'
export default {
  name: 'ElectricFence',
  components: { ElectricFenceMap },
  data() {
    return {
      isMapLoading: true,
      isAddCircleToolOn: false,
      isEditCircleToolOn: false,
      addCircleToolTips: '请在地图中画圈，以新建电子围栏',
      editCircleToolTips: '请在地图中拖拽电子围栏，编辑中心点位置和半径',
      isHaveCurrentCircle: false
    }
  },
  computed: { },
  watch: {},
  created() {

  },
  methods: {
    activeAddCircleTool() {
      this.$refs['electric-fence-map'].activeAddCircleTool()
    },
    activeEditCircleTool() {
      this.$refs['electric-fence-map'].activeEditCircleTool()
    },
    deActiveEditCircleTool() {
      this.$refs['electric-fence-map'].deActiveEditCircleTool()
    },
    // 删除已有围栏
    delCurrentCircle() {
      this.$refs['electric-fence-map'].delCurrentCircle()
    }
  }
}
</script>

<style lang="less" scoped>
.padding-left  /deep/ .ant-form-item-label {
    padding-left: 27px;
}
.margin-right {
  margin-right: 10px
}
</style>
