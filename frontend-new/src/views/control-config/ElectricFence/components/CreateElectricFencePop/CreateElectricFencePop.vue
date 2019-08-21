<template>
  <a-modal
    :width="1400"
    :title="isEdit ? '编辑电子围栏' : '新建电子围栏'"
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
                    'electricFenceName', {
                      rules: [
                        { required: true, message: '电子围栏名称不能为空'}
                      ],
                      initialValue: formValues.electricFenceName
                    }
                  ]"
                  placeholder="请输入电子围栏名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8" :xl="6">
              <a-form-item
                label="性质"
              >
                <a-select
                  v-decorator="[
                    'electricFenceType', {
                      initialValue: formValues.electricFenceType
                    }
                  ]"
                  placeholder="请选择电子围栏性质"
                >
                  <a-select-option :value="0">内</a-select-option>
                  <a-select-option :value="1">外</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="10" :xl="8">
              <a-form-item
                class="padding-left"
                label="中心位置"
              >
                <a-input
                  v-decorator="[
                    'centerAddress', {
                      initialValue: formValues.centerAddress
                    }
                  ]"
                  read-only
                ></a-input>
              </a-form-item>

            </a-col>
            <a-col :span="4" :xl="3">
              <a-form-item
                label="半径"
              >
                <a-input
                  v-decorator="[
                    'electricFenceRadius', {
                      rules: [
                        { required: true, message: '半径不能为空'}
                      ],
                      initialValue: formValues.electricFenceRadius
                    }
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
                    'electricFenceX', {
                      rules: [
                        { required: true, message: '经度不能为空'}
                      ],
                      initialValue: formValues.electricFenceX
                    }
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
                    'electricFenceY', {
                      rules: [
                        { required: true, message: '纬度不能为空'}
                      ],
                      initialValue: formValues.electricFenceY
                    }
                  ]"
                  placeholder="请输入纬度"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4" :xl="3">
              <a-button type="primary" @click="updateToMap">更新围栏到地图</a-button>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8" :xl="6">
              <a-button v-if="!isHaveCurrentCircle" type="primary" class="margin-right" @click="activeAddCircleTool">地图添加围栏</a-button>
              <template v-else>
                <a-button :disabled="isEditCircleToolOn" type="danger" class="margin-right" @click="delCurrentCircle">删除已有围栏</a-button>
                <a-button v-if="!isEditCircleToolOn" type="primary" @click="activeEditCircleTool">地图编辑围栏</a-button>
                <a-button v-else type="danger" @click="deActiveEditCircleTool">停止地图编辑围栏</a-button>
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
        @map-init-success="mapInit"
        @fence-change="onFenceChange"
        @center-address="onCenterAddressChange"
        @add-circle-tool-off="isAddCircleToolOn=false"
        @add-circle-tool-on="isAddCircleToolOn=true"
        @circle-editor-off="isEditCircleToolOn=false"
        @circle-editor-on="isEditCircleToolOn=true"
        @have-current-circle="isHaveCurrentCircle=true"
        @no-current-circle="onCircleDelete"
      ></electric-fence-map>
    </div>
  </a-modal>

</template>
<script>
function formValueFormater() {
  return {
    electricFenceName: '',
    electricFenceType: 0,
    centerAddress: '',
    electricFenceRadius: '',
    electricFenceX: '',
    electricFenceY: ''
  }
}
import ElectricFenceMap from '@/components/utils/ElectricFenceMap'
export default {
  name: 'CreateElectricFencePop',
  components: { ElectricFenceMap },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    editId: {
      default: '',
      type: [String, Number]
    }
  },
  data() {
    return {
      formValues: formValueFormater(),
      form: null,
      isMapLoading: true,
      isAddCircleToolOn: false,
      isEditCircleToolOn: false,
      addCircleToolTips: '请在地图中画圈，以新建电子围栏',
      editCircleToolTips: '请在地图中拖拽电子围栏，编辑中心点位置和半径',
      isHaveCurrentCircle: false,
      confirmLoading: false,
      fetching: false,
      addressOpts: [],
      fenceDetail: null
    }
  },
  computed: { },
  watch: {
    visible: {
      immediate: false,
      async handler(newVal) {
        if (newVal) {
        // 显示

        } else {
        // 销毁

        }
      }
    }
  },
  created() {

  },
  mounted() {
    this.form = this.$form.createForm(this, {
      onValuesChange: this.onValuesChange
    })
  },
  methods: {
    async mapInit() {
      this.isMapLoading = false
      if (this.isEdit) {
        const fenceDetail = this.fenceDetail = await this.getFenceDetail()
        this.formValues = {
          electricFenceName: fenceDetail.fenceName,
          electricFenceType: fenceDetail.rule,
          centerAddress: fenceDetail.centerName,
          electricFenceRadius: fenceDetail.radius,
          electricFenceX: fenceDetail.centerLng,
          electricFenceY: fenceDetail.centerLat
        }
        this.$refs['electric-fence-map'].addFenceFromParams(
          fenceDetail.centerLng,
          fenceDetail.centerLat,
          fenceDetail.radius)
      }
    },
    reset() {
      this.form.resetFields()
      this.isMapLoading = true
      this.isAddCircleToolOn = false
      this.isEditCircleToolOn = false
      this.isHaveCurrentCircle = false
      this.confirmLoading = false
      this.addressOpts = []
      this.$emit('update:visible', false)
      this.$emit('update:isEdit', false)
      this.$emit('update:editId', '')
      this.$refs['electric-fence-map'].delCurrentCircle()
    },
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
      this.reset()
    },
    validateFields(arr = []) {
      let fieldnames
      if (arr.length !== 0) {
        fieldnames = arr
      }
      let validateFlag = true
      this.form.validateFields(fieldnames, (err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
      })
      return validateFlag
    },
    async handSubmit() {
      if (!this.validateFields()) {
        return
      }
      const formValues = this.form.getFieldsValue()
      console.log(formValues)
      const params = {
        centerLat: formValues.electricFenceY,
        centerLng: formValues.electricFenceX,
        centerName: formValues.centerAddress,
        fenceName: formValues.electricFenceName,
        radius: formValues.electricFenceRadius,
        rule: formValues.electricFenceType
      }
      if (this.isEdit) {
        params.id = this.editId
        await this.updateFence(params)
      } else {
        await this.createFence(params)
      }
      this.reset()
      this.$emit('success')
    },
    // 新增电子围栏
    createFence(params) {
      return new Promise((resolve, reject) => {
        this.$post('/business/electronic-fence/addElectronicFence', params).then(r => {
          this.$message.info('新增电子围栏成功')
          resolve(r.data.data)
        })
      })
    },
    // 编辑电子围栏
    updateFence(params) {
      return new Promise((resolve, reject) => {
        this.$post('/business/electronic-fence/updateElectronicFence', params).then(r => {
          this.$message.info('编辑电子围栏成功')
          resolve(r.data.data)
        })
      })
    },
    // 获取围栏
    getFenceDetail() {
      return new Promise((resolve, reject) => {
        this.$get('/business/electronic-fence/getElectronicFenceById', {
          fenceId: this.editId
        }).then(r => {
          if (r.data.state === 1) {
            resolve(r.data.data)
          } else {
            reject()
          }
        })
      })
    },
    // 电子围栏改变
    onFenceChange({ formattedAddress, lng, lat, radius }) {
      this.form.setFieldsValue({
        'electricFenceRadius': radius,
        'centerAddress': formattedAddress,
        'electricFenceX': lng,
        'electricFenceY': lat
      })
    },
    // 中心地址改变
    onCenterAddressChange(address) {
      this.form.setFieldsValue({
        'centerAddress': address
      })
    },
    // 更新圆圈参数
    updateCircleOptions(values) {
      if (!this.validateFields(['electricFenceX', 'electricFenceY', 'electricFenceRadius'])) {
        return
      }
      const obj_1 = Object.assign({}, {
        electricFenceX: this.form.getFieldValue('electricFenceX'),
        electricFenceY: this.form.getFieldValue('electricFenceY'),
        electricFenceRadius: this.form.getFieldValue('electricFenceRadius')
      }, values)
      // 是否参数不全
      const flag = Object.keys(obj_1).findIndex((key) => {
        return !obj_1[key]
      })

      if (flag > -1 || flag === undefined) { return }
      const obj_2 = {
        lng: obj_1.electricFenceX,
        lat: obj_1.electricFenceY,
        radius: obj_1.electricFenceRadius
      }
      // 是否是从地图触发变化
      this.$refs['electric-fence-map'].manualChangeCircle(obj_2)
    },
    // 删除围栏
    onCircleDelete() {
      this.onFenceChange({ formattedAddress: '', lng: '', lat: '', radius: '' })
      this.isHaveCurrentCircle = false
    },
    // 更新围栏到地图
    updateToMap() {
      this.updateCircleOptions()
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
