<template>
  <a-spin :spinning="loading">
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
          <a-form-item label="通讯地址(唯一)" v-bind="formItemLayout">
            <a-input
              v-decorator="['address',
                            {rules: [
                               { required: true, message: '通讯地址不能为空'}
                             ],
                             initialValue: formValues.address}]"
              palceholder=""
              :read-only="readonly"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :span="12">
          <a-form-item label="网关版本" v-bind="formItemLayout">
            <a-select
              v-decorator="['gatewayVersion',
                            {rules: [
                               { required: true, message: '不能为空'}
                             ],
                             initialValue: formValues.gatewayVersion}]"
              :disabled="readonly"
            >
              <a-select-option :value="0">1</a-select-option>
              <a-select-option :value="1">2</a-select-option>
            </a-select>

          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所属项目" v-bind="formItemLayout">
            <a-select
              v-decorator="['project',
                            {rules: [
                               { required: true, message: '不能为空'}
                             ],
                             initialValue: formValues.project}]"
              :disabled="readonly"
            >
              <a-select-option :value="0">1</a-select-option>
              <a-select-option :value="1">2</a-select-option>
            </a-select>

          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :span="12">
          <a-form-item label="电表变比" v-bind="formItemLayout">
            <a-switch
              v-decorator="['meterRatio',
                            {rules: [
                               { required: true, message: '不能为空'}
                             ],
                             valuePropName: 'checked',
                             initialValue: formValues.meterRatio}]"
              :disabled="readonly"
              checked-children="使用"
              un-checked-children="不使用"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备注" v-bind="formItemLayout">
            <a-input
              v-decorator="['remarks',
                            {rules: [

                             ],
                             initialValue: formValues.remarks}]"
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
  </a-spin>
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
const number = 16
const TimepickerFormat = 'HH:mm:ss'
function momentObjFactory(str = '00:00:00') {
  return moment(str, 'HH:mm:ss')
}
function formValueFormater() {
  return {
    gatewayName: '',
    address: '',
    gatewayVersion: 0,
    project: 0,
    meterRatio: true,
    gatewayPosition: BasePosition,
    remarks: ''
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
    readonly: {
      type: Boolean,
      default: false
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
    const formValues = formValueFormater()
    const gatewayConfigFormValues = gatewayConfigFormValuesFormater()
    return {
      form: this.$form.createForm(this),
      gatewayConfigForm: this.$form.createForm(this),
      formValues,
      gatewayConfigFormValues,
      loading: false,
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
    if (this.isEdit) {
      // const rawDetail = this.rawDetail = await this.getDetail()
      // this.$set(this.formValues, 'address', 'test')
    }
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
    getDetail() {
      this.loading = true
      // return new Promise((resolve, reject) => {
      //   this.$get('/business/black-white-app/getBlackWhiteAppById', {
      //     appId: this.editId
      //   })
      //     .then(r => {
      //       if (r.data.state === 1) {
      //         resolve(r.data.data)
      //       } else {
      //         reject()
      //       }
      //     })
      //     .finally(() => {
      //       this.loading = false
      //     })
      // })
    },
    async handleSubmit() {
      if (!this.validateFields()) {
        return false
      }
      const formValues = this.collectData()
      console.log(formValues)
      await this.save(formValues)
      return true
    },
    save(formValues) {
      // const params = []
      // this.loading = true
      // return new Promise((resolve, reject) => {
      //   this.$post('/business/black-white-app/addBlackWhiteAppByBatch', {
      //     jsonString: JSON.stringify(params)
      //   }).then(r => {
      //     this.$message.info('新增应用黑名单成功')
      //     resolve(r.data.data)
      //   })
      //     .finally(() => {
      //       this.loading = false
      //     })
      // })
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
