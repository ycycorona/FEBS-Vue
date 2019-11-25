<template>
  <a-form :form="form">
    <tab-title v-if="readonly" title="网关参数" />
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="网关名称" v-bind="formItemLayout">
          <a-input
            v-decorator="['gatewayName',
                          {rules: [
                             { required: true, message: '网关名称不能为空'}
                           ],
                           initialValue: formValues.gatewayName}]"
            palceholder=""
            :read-only="readonly"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="项目" v-bind="formItemLayout">
          <a-select
            v-decorator="['projectId', {
              rules:[{ required: true, message: '项目不能为空'}],
              initialValue: formValues.projectId,
            }]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
            :options="projectOpt"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="通讯地址(唯一)" v-bind="formItemLayout">
          <a-input
            v-decorator="['gatewayGprs',
                          {rules: [
                             { required: true, message: '通讯地址不能为空'}
                           ],
                           initialValue: formValues.gatewayGprs}]"
            palceholder=""
            :read-only="readonly"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="网关类型" v-bind="formItemLayout">
          <a-select
            v-decorator="['gatewayGeneration',
                          {rules: [
                             { required: true, message: '不能为空'}
                           ],
                           initialValue: formValues.gatewayGeneration}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
          >
            <a-select-option :value="1">TI网关</a-select-option>
            <a-select-option :value="2">NXP网关</a-select-option>
          </a-select>

        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="无线组网模式" v-bind="formItemLayout">
          <a-select
            v-decorator="['type',
                          {rules: [
                             { required: true, message: '不能为空'}
                           ],
                           initialValue: formValues.type}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
          >
            <a-select-option :value="1">网关模块</a-select-option>
            <a-select-option :value="2">NB</a-select-option>
            <a-select-option :value="3">其他</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="继电器通电模式" v-bind="formItemLayout">
          <a-select
            v-decorator="['mode',
                          {rules: [
                             { required: true, message: '不能为空'}
                           ],
                           initialValue: formValues.mode}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
          >
            <a-select-option :value="1">定时开关模式</a-select-option>
            <a-select-option :value="2">经纬度开关模式</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="电表变比" v-bind="formItemLayout">
          <a-switch
            v-decorator="['ratioOfElectricMeter',
                          {rules: [
                             { required: true, message: '不能为空'}
                           ],
                           valuePropName: 'checked',
                           initialValue: formValues.ratioOfElectricMeter}]"
            :disabled="readonly"
            checked-children="使用"
            un-checked-children="不使用"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="备注" v-bind="formItemLayout">
          <a-input
            v-decorator="['description',
                          {rules: [

                           ],
                           initialValue: formValues.description}]"
            palceholder=""
            :read-only="readonly"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="网关位置" v-bind="formItemLayout_1">
          <position-input
            v-decorator="['gatewayPosition',
                          {rules: [
                             { required: true, message: '网关位置不能为空'}
                           ],
                           initialValue: formValues.gatewayPosition}]"
            palceholder="请选择网关位置"
            :readonly="readonly"
            @change="positionChangeFromText"
          ></position-input>
        </a-form-item>
      </a-col>
    </a-row>
    <PointerSelect
      ref="positonSelect"
      style="z-index:1"
      :current-pointer="pointerSelectValue"
      @change="positionChangeFromMap"
    ></PointerSelect>
    <!-- 只读模式显示更多 -->
    <template v-if="readonly">
      <tab-title title="网关配置" style="margin-top:20px" />
      <a-form :form="gatewayConfigForm">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="频道" v-bind="formItemLayout">
              <a-input
                v-decorator="['channel',
                              {rules: [
                                 { required: true, message: '频道不能为空'}
                               ],
                               initialValue: gatewayConfigFormValues.channel}]"
                :read-only="readonly"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="电表地址" v-bind="formItemLayout">
              <a-input
                v-decorator="['electricAddress',
                              {rules: [
                                 { required: true, message: '电表地址不能为空'}
                               ],
                               initialValue: gatewayConfigFormValues.electricAddress}]"
                :read-only="readonly"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="PANID" v-bind="formItemLayout_1">
              <multi-input
                v-decorator="['panId',
                              {rules: [
                                 { required: true, message: 'panId不能为空'}
                               ],
                               initialValue: gatewayConfigFormValues.panId}]"
                :input-num="8"
                :readonly="readonly"
              ></multi-input>
            </a-form-item>
          </a-col>
        </a-row>
        <div style="margin-bottom: 20px;">网关继电器配置：</div>
        <a-row :gutter="12">
          <a-col :span="2" class="text-center">
            <span class="all-switch-text">启用/禁用</span>
            <a-switch v-model="gatewayConfigFormValues.switchAll" :disabled="readonly"></a-switch>
          </a-col>
          <a-col :span="2" class="text-center">路编号</a-col>
          <a-col :span="4" class="text-center">路名称</a-col>
          <a-col :span="4" class="text-center">回路模式</a-col>
          <a-col :span="6" class="text-center">开时间</a-col>
          <a-col :span="6" class="text-center">关时间</a-col>
        </a-row>
        <div class="no-margin-divide">
          <a-divider />
        </div>
        <a-row v-for="(n, index) in number" :key="n" :gutter="12">
          <a-col :span="2" class="text-center">
            <a-form-item label="开关" v-bind="formItemLayout_noLabel">
              <a-switch
                v-model="gatewayConfigFormValues.switch[index]"
                :disabled="readonly"
              />
            </a-form-item>
          </a-col>
          <a-col :span="2" class="text-center">
            <a-form-item label="编号" v-bind="formItemLayout_noLabel">
              {{ n }}
            </a-form-item> </a-col>
          <a-col :span="4" class="text-center">
            <a-form-item label="名称" v-bind="formItemLayout_noLabel">
              <debounced-input
                v-decorator="[`name[${index}]`,
                              {rules: [

                               ],
                               initialValue: gatewayConfigFormValues.name[index]}]"
                :disabled="!gatewayConfigFormValues.switch[index]"
                :readonly="readonly"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" class="text-center">
            <a-form-item label="回路模式" v-bind="formItemLayout_noLabel">
              <a-select
                v-decorator="[
                  `type[${index}]`, {
                    initialValue: gatewayConfigFormValues.type[index]
                  }
                ]"
                :class="{'readonly': readonly}"
                :disabled="!gatewayConfigFormValues.switch[index] || readonly"
              >
                <a-select-option :value="0">定时</a-select-option>
                <a-select-option :value="1">经纬度</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="定时开时间" v-bind="formItemLayout_noLabel">
              <a-time-picker
                v-decorator="[`openTime[${index}]`,
                              {rules: [
                                 { required: true, message: '开灯时间不能为空'}
                               ],
                               initialValue: gatewayConfigFormValues.openTime[index]}]"
                :class="{'readonly': readonly}"
                :disabled="!gatewayConfigFormValues.switch[index]"
                :allow-clear="false"
                class="full-width"
                :format="TimepickerFormat"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="定时关时间" v-bind="formItemLayout_noLabel">
              <a-time-picker
                v-decorator="[`closeTime[${index}]`,
                              {rules: [
                                 { required: true, message: '熄灯时间不能为空'}
                               ],
                               initialValue: gatewayConfigFormValues.closeTime[index]}]"
                :class="{'readonly': readonly}"
                :disabled="!gatewayConfigFormValues.switch[index]"
                :allow-clear="false"
                class="full-width"
                :format="TimepickerFormat"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
  </a-form>
</template>

<script>
import TabTitle from '@/components/fragment/TabTitle'
import { BasePosition } from '@/config/LightConstant'
import PointerSelect from '@/components/diyMap/PointerSelect'
import PositionInput from '@/components/diyMap/PositionInput'
import { createArrayFromNum } from '@/utils/common'
import MultiInput from '@/components/input/MultiInput/MultiInput'
import moment from 'moment'
import DebouncedInput from '@/components/input/DebouncedInput/DebouncedInput'
import { save, add } from '@/service/gatewayManageService'

const number = 16
const TimepickerFormat = 'HH:mm:ss'
function momentObjFactory(str = '00:00:00') {
  return moment(str, 'HH:mm:ss')
}
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      gatewayName: detailData.gatewayName,
      gatewayGprs: detailData.gatewayGprs,
      gatewayGeneration: detailData.gatewayGeneration,
      projectId: detailData.projectId,
      ratioOfElectricMeter: Boolean(detailData.ratioOfElectricMeter),
      gatewayPosition: [detailData.lng, detailData.lat],
      description: detailData.description,
      type: detailData.type,
      mode: detailData.mode
    }
  } else {
    return {
      gatewayName: '',
      gatewayGprs: '',
      gatewayGeneration: 1,
      projectId: '',
      ratioOfElectricMeter: Boolean(0),
      gatewayPosition: BasePosition,
      description: '',
      type: 1,
      mode: 1
    }
  }
}
function gatewayConfigFormValuesFormater() {
  return {
    channel: '',
    electricAddress: '',
    panId: createArrayFromNum(8, 0),
    name: createArrayFromNum(number, ''),
    switch: createArrayFromNum(number, true),
    openTime: createArrayFromNum(number, momentObjFactory),
    closeTime: createArrayFromNum(number, momentObjFactory),
    type: createArrayFromNum(number, 0),
    switchAll: false
  }
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
const formItemLayout_noLabel = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
}
export default {
  name: 'GatewayDetailPop',
  components: { DebouncedInput, PointerSelect, PositionInput, TabTitle, MultiInput },
  props: {
    detailData: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    projectOpt: {
      type: Array
    },
    editId: {
      default: '',
      type: [String, Number]
    }
  },
  data() {
    const formValues = this.$props.isEdit
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
    const gatewayConfigFormValues = gatewayConfigFormValuesFormater()
    this.formValues = formValues
    return {
      form: this.$form.createForm(this),
      gatewayConfigForm: this.$form.createForm(this),
      gatewayConfigFormValues,
      formItemLayout, formItemLayout_1, formItemLayout_noLabel, number, TimepickerFormat,
      rawDetail: null,
      pointerSelectValue: formValues.gatewayPosition
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    // if (this.isEdit) {

    // }
    this.$store.commit('contact/setCurrentPopContent', this)
  },
  mounted() {

  },
  methods: {
    // 智能灯经纬度改变 从地图
    positionChangeFromMap([lng, lat]) {
      this.form.setFieldsValue({ gatewayPosition: [lng, lat] })
    },
    // 智能灯经纬度改变 从input
    positionChangeFromText([lng, lat]) {
      console.log(lng, lat)
      if (!this.validateX(lng)) { return }
      if (!this.validateY(lat)) { return }

      this.pointerSelectValue = [lng, lat]
    },
    validateX(x) {
      if (isNaN(x) || x === '') { return false }
      // if (Math.abs(Number(x)) === 0) { return false }
      if (Math.abs(Number(x)) >= 180) { return false }
      return true
    },
    validateY(y) {
      if (isNaN(y) || y === '') { return false }
      // if (Math.abs(Number(y)) === 0) { return false }
      if (Math.abs(Number(y)) >= 90) { return false }
      return true
    },
    async handleSubmit() {
      if (!this.validateFields()) {
        return false
      }
      const formValues = this.collectData()
      if (this.isEdit) {
        await this.save(formValues)
      } else {
        await this.add(formValues)
      }
      return true
    },
    async add(formValues) {
      const params = {
        gatewayName: formValues.gatewayName,
        gatewayGprs: formValues.gatewayGprs,
        gatewayGeneration: formValues.gatewayGeneration,
        projectId: formValues.projectId,
        ratioOfElectricMeter: formValues.ratioOfElectricMeter ? 1 : 0,
        lng: formValues.gatewayPosition[0],
        lat: formValues.gatewayPosition[1],
        description: formValues.description,
        type: formValues.type,
        mode: formValues.mode
      }
      // console.log(params)
      // return
      await add(params)
      this.$message.info('新增网关成功')
    },
    async save(formValues) {
      const params = {
        id: this.detailData.id,
        gatewayName: formValues.gatewayName,
        gatewayGprs: formValues.gatewayGprs,
        gatewayGeneration: formValues.gatewayGeneration,
        projectId: formValues.projectId,
        ratioOfElectricMeter: formValues.ratioOfElectricMeter ? 1 : 0,
        lng: formValues.gatewayPosition[0],
        lat: formValues.gatewayPosition[1],
        description: formValues.description,
        type: formValues.type,
        mode: formValues.mode
      }
      await save(params)
      this.$message.info('修改网关成功')
    },
    collectData() {
      return this.form.getFieldsValue()
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
    // 获取网关全部详情
    async getConfig() {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
