<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="项目名称" v-bind="formItemLayout">
          <a-select
            v-decorator="['project',
                          {rules: [
                             { required: true, message: '应用名称不能为空'}
                           ],
                           initialValue: formValues.project}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
          >
            <a-select-option :value="0">项目1</a-select-option>
            <a-select-option :value="1">项目2</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="编组名称" v-bind="formItemLayout">
          <a-select
            v-decorator="['group',
                          {rules: [
                             { required: true, message: '编组名称不能为空'}
                           ],
                           initialValue: formValues.group}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
            palceholder="请选择编组"
          >
            <a-select-option :value="0">编组1</a-select-option>
            <a-select-option :value="1">编组2</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="智能灯编号" v-bind="formItemLayout">
          <a-input
            v-decorator="['lightId',
                          {rules: [
                             { required: true, message: '智能灯编号不能为空'}
                           ],
                           initialValue: formValues.lightId}]"
            :read-only="readonly"
          />

        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="外壳编号" v-bind="formItemLayout">
          <a-input
            v-decorator="['lightShellId',
                          {rules: [
                             { required: true, message: '外壳编号不能为空'}
                           ],
                           initialValue: formValues.lightShellId}]"
            :read-only="readonly"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="智能灯类型" v-bind="formItemLayout">
          <a-select
            v-decorator="['lightType',
                          {rules: [
                             { required: true, message: '智能灯类型不能为空'}
                           ],
                           initialValue: formValues.lightType}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
          >
            <a-select-option :value="0">1</a-select-option>
            <a-select-option :value="1">2</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="安装状态" v-bind="formItemLayout">
          <a-select
            v-decorator="['installType',
                          {rules: [
                             { required: true, message: '安装状态不能为空'}
                           ],
                           initialValue: formValues.installType}]"
            :class="{'readonly': readonly}"
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
        <a-form-item label="I额定功率" v-bind="formItemLayout">
          <a-input
            v-decorator="['powerI',
                          {rules: [
                             { required: true, message: 'I额定功率不能为空'}
                           ],
                           initialValue: formValues.powerI}]"
            :read-only="readonly"
          />

        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II额定功率" v-bind="formItemLayout">
          <a-input
            v-decorator="['powerII',
                          {rules: [
                             { required: true, message: 'II额定功率不能为空'}
                           ],
                           initialValue: formValues.powerI}]"
            :read-only="readonly"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="MAC地址" v-bind="formItemLayout_1">
          <multi-input
            v-decorator="['macAddress',
                          {rules: [
                             { required: true, message: 'MAC地址不能为空'}
                           ],
                           initialValue: formValues.macAddress}]"
            :input-num="8"
            :readonly="readonly"
          ></multi-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="校表码" v-bind="formItemLayout_1">
          <multi-input
            v-decorator="['jiaobiaoCode',
                          {rules: [
                             { required: true, message: '校表码不能为空'}
                           ],
                           initialValue: formValues.jioabiaoCode}]"
            :input-num="8"
            :readonly="readonly"
          ></multi-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="扩展PANID" v-bind="formItemLayout_1">
          <multi-input
            v-decorator="['panId',
                          {rules: [
                             { required: true, message: 'panId不能为空'}
                           ],
                           initialValue: formValues.panId}]"
            :input-num="8"
            :readonly="readonly"
          ></multi-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="频道(11-26)" v-bind="formItemLayout">
          <a-input
            v-decorator="['channel',
                          {rules: [
                             { required: true, message: '频道不能为空'}
                           ],
                           initialValue: formValues.channel}]"
            :read-only="readonly"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="安装方向" v-bind="formItemLayout">
          <a-select
            v-decorator="['installDirection',
                          {rules: [
                             { required: true, message: '安装方向不能为空'}
                           ],
                           initialValue: formValues.installType}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
          >
            <a-select-option :value="0">左侧主路</a-select-option>
            <a-select-option :value="1">右侧主路</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="智能灯位置" v-bind="formItemLayout_1">
          <position-input
            v-decorator="['lightPosition',
                          {rules: [
                             { required: true, message: '智能灯位置不能为空'}
                           ],
                           initialValue: formValues.lightPosition}]"
            palceholder="请选择智能灯位置"
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
  </a-form>
</template>

<script>
import { BasePosition } from '@/config/LightConstant'
import MultiInput from '@/components/input/MultiInput/MultiInput'
import { createArrayFromNum } from '@/utils/common'
import PointerSelect from '@/components/diyMap/PointerSelect'
import PositionInput from '@/components/diyMap/PositionInput'
import { save, add } from '@/service/unapproveLightManageService'
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      project: 0,
      group: '',
      lightId: '',
      lightShellId: '',
      lightType: '',
      installType: '',
      macAddress: createArrayFromNum(8, 0),
      jioabiaoCode: createArrayFromNum(12, 0),
      panId: createArrayFromNum(8, 0),
      channel: '',
      powerI: '',
      powerII: '',
      installDirection: '',
      lightPosition: BasePosition
    }
  } else {
    return {
      project: 0,
      group: '',
      lightId: '',
      lightShellId: '',
      lightType: '',
      installType: '',
      macAddress: createArrayFromNum(8, 0),
      jioabiaoCode: createArrayFromNum(12, 0),
      panId: createArrayFromNum(8, 0),
      channel: '',
      powerI: '',
      powerII: '',
      installDirection: '',
      lightPosition: BasePosition
    }
  }
}
const counter = 0
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'LightManageDetailPop',
  components: { MultiInput, PointerSelect, PositionInput },
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
    const formValues = formValueFormater()
    return {
      form: this.$form.createForm(this),
      formValues,
      loading: false,
      formItemLayout, formItemLayout_1,
      rawDetail: null,
      pointerSelectValue: formValues.lightPosition
    }
  },
  computed: {

  },
  created() {
    this.$store.commit('contact/setCurrentPopContent', this)
  },
  methods: {
    // 智能灯经纬度改变 从地图
    positionChangeFromMap([lng, lat]) {
      this.form.setFieldsValue({ lightPosition: [lng, lat] })
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
    }
  }
}
</script>

<style lang="less" scoped>
#dateRange {
  width: 100%
}
.for-item {
  position: relative;
}
.del-for-item {
  position: absolute;
  bottom: 0;
  right: 103px;
  transform: translateY(-33px);
}
.ant-divider-horizontal {
  margin: 12px 0;
}
.drawer-bootom-button {
  z-index: 10;
}
</style>
