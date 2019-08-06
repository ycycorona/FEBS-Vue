<template>
  <a-modal
    :width="1400"
    title="新建电子围栏"
    :body-style="{height: '700px'}"
    style="top: 20px;"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :mask-closable="false"
    :keyboard="false"
    :destroy-on-close="true"
    @cancel="onClose"
    @ok="handSubmit"
  >
    <div class="electric-fence-wrap full-width table-page-search-wrapper">
      <!-- 表单区域 -->
      <a-spin :spinning="isMapLoading">
        <a-form layout="inline" :form="form">
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
                <a-select
                  v-decorator="[
                    'centerAddress'
                  ]"
                  show-search
                  placeholder="请输入关键字进行搜索"
                  style="width: 100%"
                  :filter-option="false"
                  :show-arrow="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="fetchAddressList"
                  @change="handleCenterAddressChange"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in addressOpts" :key="d.value">{{ d.text }}</a-select-option>
                </a-select>
              </a-form-item>

            </a-col>
            <a-col :span="2" :xl="2">
              <a-button type="primary" @click="addFenceFromCenter">添加围栏</a-button>
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
        @fence-change="onFenceChange"
        @map-init-success="isMapLoading=false"
        @add-circle-tool-off="isAddCircleToolOn=false"
        @add-circle-tool-on="isAddCircleToolOn=true"
        @circle-editor-off="isEditCircleToolOn=false"
        @circle-editor-on="isEditCircleToolOn=true"
        @have-current-circle="isHaveCurrentCircle=true"
        @no-current-circle="isHaveCurrentCircle=false"
      ></electric-fence-map>
    </div>
  </a-modal>

</template>
<script>
import ElectricFenceMap from '@/components/utils/ElectricFenceMap'
import _ from 'lodash/core'
export default {
  name: 'CreateElectricFencePop',
  components: { ElectricFenceMap },
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      form: null,
      isMapLoading: true,
      isAddCircleToolOn: false,
      isEditCircleToolOn: false,
      addCircleToolTips: '请在地图中画圈，以新建电子围栏',
      editCircleToolTips: '请在地图中拖拽电子围栏，编辑中心点位置和半径',
      isHaveCurrentCircle: false,
      confirmLoading: false,
      fetching: false,
      addressOpts: []
    }
  },
  computed: { },
  watch: {},
  created() {

  },
  mounted() {
    this.form = this.$form.createForm(this, {
      onValuesChange: this.onValuesChange
    })
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
    },
    onClose() {
      this.$emit('update:visible', false)
      this.$nextTick(() => {
        this.reset()
      })
    },
    handSubmit() {
      this.confirmLoading = true
      setTimeout(() => {
        this.$emit('update:visible', false)
        this.$nextTick(() => {
          this.reset()
        })
      }, 2000)
    },
    reset() {
      this.isMapLoading = true
      this.isAddCircleToolOn = false
      this.isEditCircleToolOn = false
      this.isHaveCurrentCircle = false
      this.confirmLoading = false
    },
    onFenceChange({ formattedAddress, lng, lat, radius }) {
      this.form.setFieldsValue({
        'electricFenceRadius': radius,
        'centerAddress': formattedAddress,
        'electricFenceX': lng,
        'electricFenceY': lat

      })
      console.log(formattedAddress, lng, lat, radius)
    },
    fetchAddressList(val) {
      if (val.match(/^[a-zA-Z]*$/)) { return }
      const opt = []
      this.$refs['electric-fence-map'].autocomplete.search(val, (s, r) => {
        console.log(r)
        if (r === 'NO_PARAMS' || _.isEmpty(r) || r.location) { return }
        r.tips.forEach(item => {
          if (item.location !== '') {
            const resAddress = `${item.name}-${item.district}`
            opt.push({
              value: `${item.location.lng},${item.location.lat},${resAddress}`, text: resAddress
            })
          }
        })
        this.addressOpts = opt
      })
      // data.push({ value: 1, text: val + 'aaa' })
      // this.addressOpts = data
    },
    handleCenterAddressChange(value) {
      console.log(value)
      // this.fetchAddressList(value)
    },
    // 从中心点 添加围栏
    addFenceFromCenter() {
      const arr = this.form.getFieldValue('centerAddress').split(',')
      if (!this.form.getFieldValue('electricFenceRadius')) {
        this.form.setFieldsValue({
          electricFenceRadius: 10,
          electricFenceX: arr[0],
          electricFenceY: arr[1]
        })
      } else {
        this.form.setFieldsValue({
          electricFenceX: arr[0],
          electricFenceY: arr[1]
        })
      }
      const values = this.form.getFieldsValue(['electricFenceX', 'electricFenceY', 'electricFenceRadius'])
      this.$refs['electric-fence-map'].addFenceFromParams(
        values.electricFenceX,
        values.electricFenceY,
        values.electricFenceRadius,
      )
    },
    onValuesChange(props, values) {
      console.log(values)
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
.float-add-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
