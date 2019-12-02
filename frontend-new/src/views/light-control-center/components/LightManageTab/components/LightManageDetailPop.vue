<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="项目名称" v-bind="formItemLayout">
          <a-select
            v-decorator="['projectId',
                          {rules: [
                             { required: true, message: '应用名称不能为空'}
                           ],
                           initialValue: formValues.projectId}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
            :options="projectOpt"
            @change="projectChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="编组名称" v-bind="formItemLayout">
          <a-select
            v-decorator="['groupId',
                          {rules: [
                             { required: true, message: '编组名称不能为空'}
                           ],
                           initialValue: formValues.groupId}]"
            :class="{'readonly': readonly}"
            :disabled="readonly"
            :options="groupOpt"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="智能灯编号" v-bind="formItemLayout">
          <a-input
            v-decorator="['lightNumber',
                          {rules: [
                             { required: true, message: '智能灯编号不能为空'}
                           ],
                           initialValue: formValues.lightNumber}]"
            :read-only="readonly"
          />

        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="外壳编号" v-bind="formItemLayout">
          <a-input
            v-decorator="['shellNumber',
                          {rules: [
                             { required: true, message: '外壳编号不能为空'}
                           ],
                           initialValue: formValues.shellNumber}]"
            :read-only="readonly"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="智能灯类型" v-bind="formItemLayout">
          <a-select
            v-decorator="['typeId',
                          {rules: [
                             { required: true, message: '智能灯类型不能为空'}
                           ],
                           initialValue: formValues.typeId}]"
            :options="lightTypeOpt"
            :class="{'readonly': readonly}"
            :disabled="readonly"
          />
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
            <a-select-option :value="1">安装两路</a-select-option>
            <a-select-option :value="2">只安装主路</a-select-option>
            <a-select-option :value="3">只安装辅路</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I额定功率/W" v-bind="formItemLayout">
          <a-input
            v-decorator="['nowGonglv1',
                          {rules: [
                             { required: true, message: 'I额定功率不能为空'}
                           ],
                           initialValue: formValues.nowGonglv1}]"
            :read-only="readonly"
          />

        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II额定功率/W" v-bind="formItemLayout">
          <a-input
            v-decorator="['nowGonglv2',
                          {rules: [
                             { required: true, message: 'II额定功率不能为空'}
                           ],
                           initialValue: formValues.nowGonglv2}]"
            :read-only="readonly"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="12">
        <a-form-item label="I旧灯功率/W" v-bind="formItemLayout">
          <a-input
            v-decorator="['oldkw',
                          {rules: [
                             { required: true, message: 'I额定功率不能为空'}
                           ],
                           initialValue: formValues.oldkw}]"
            :read-only="readonly"
          />

        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="II旧灯功率/W" v-bind="formItemLayout">
          <a-input
            v-decorator="['oldkw2',
                          {rules: [
                             { required: true, message: 'II额定功率不能为空'}
                           ],
                           initialValue: formValues.oldkw2}]"
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
                           initialValue: formValues.jiaobiaoCode}]"
            :input-num="12"
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
      :readonly="readonly"
      style="z-index:1"
      :current-pointer="pointerSelectValue"
      @change="positionChangeFromMap"
    ></PointerSelect>
  </a-form>
</template>

<script>
import { BasePosition } from '@/config/LightConstant'
import { configSerialize, configDeserialize } from '@/utils/common'
import MultiInput from '@/components/input/MultiInput/MultiInput'
import { createArrayFromNum } from '@/utils/common'
import PointerSelect from '@/components/diyMap/PointerSelect'
import PositionInput from '@/components/diyMap/PositionInput'
import { save, add } from '@/service/unapproveLightManageService'
import { getListOptByProjectId as getGroupListOptByProjectId } from '@/service/groupManageService'
import { getListOpt as getLightTypeListOpt } from '@/service/lightTypeManageService'
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      projectId: detailData.projectId,
      groupId: detailData.groupId,
      lightNumber: detailData.lightNumber,
      shellNumber: detailData.shellNumber,
      typeId: detailData.typeId,
      installType: 1,
      macAddress: configDeserialize(detailData.mac),
      jiaobiaoCode: configDeserialize(detailData.jiaobiaoma),
      panId: configDeserialize(detailData.panid),
      channel: detailData.pindao,
      nowGonglv1: detailData.nowGonglv1,
      nowGonglv2: detailData.nowGonglv2,
      oldkw: detailData.oldkw,
      oldkw2: detailData.oldkw2,
      installDirection: detailData.anzhuang,
      lightPosition: [detailData.lng, detailData.lat]
    }
  } else {
    return {
      project: '',
      group: '',
      lightNumber: '',
      shellNumber: '',
      typeId: '',
      installType: 1,
      macAddress: createArrayFromNum(8, 0),
      jiaobiaoCode: createArrayFromNum(12, 0),
      panId: createArrayFromNum(8, 0),
      channel: '',
      powerI: '',
      powerII: '',
      installDirection: 0,
      lightPosition: BasePosition
    }
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
    },
    popWindowData: {
      type: Object
    }
  },
  data() {
    const formValues = this.$props.isEdit
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
    this.formValues = formValues
    return {
      form: this.$form.createForm(this),
      loading: false,
      formItemLayout, formItemLayout_1,
      rawDetail: null,
      pointerSelectValue: formValues.lightPosition,
      currentGroupOptListRaw: [],
      groupOpt: [],
      currentlightTypeOptRaw: [],
      lightTypeOpt: []
    }
  },
  computed: {

  },
  async created() {
    this.$store.commit('contact/setCurrentPopContent', this)
    if (this.isEdit) {
      this.gatewayOpt = this.detailData.gatewayOpt
    }
    getLightTypeListOpt()
      .then((data) => {
        this.currentlightTypeOptRaw = data
        this.lightTypeOpt = this.currentlightTypeOptRaw.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      })
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
        anzhuang: formValues.installType,
        fangxiang: formValues.installDirection,
        groupId: formValues.groupId,
        jiaobiaoma: configSerialize(formValues.jiaobiaoCode),
        lng: formValues.lightPosition[0],
        lat: formValues.lightPosition[1],
        lightNumber: formValues.lightNumber,
        mac: configSerialize(formValues.macAddress),
        nowGonglv1: formValues.nowGonglv1,
        nowGonglv2: formValues.nowGonglv2,
        oldkw: formValues.oldkw,
        oldkw2: formValues.oldkw2,
        panid: configSerialize(formValues.panId),
        pindao: formValues.channel,
        projectId: formValues.projectId,
        shellNumber: formValues.shellNumber,
        typeId: formValues.typeId
      }
      await add(params)
      this.$message.info('新增智能灯成功')
    },
    async save(formValues) {
      const params = {
        id: this.detailData.id,
        anzhuang: formValues.installType,
        fangxiang: formValues.installDirection,
        groupId: formValues.groupId,
        jiaobiaoma: configSerialize(formValues.jiaobiaoCode),
        lng: formValues.lightPosition[0],
        lat: formValues.lightPosition[1],
        lightNumber: formValues.lightNumber,
        mac: configSerialize(formValues.macAddress),
        nowGonglv1: formValues.nowGonglv1,
        nowGonglv2: formValues.nowGonglv2,
        oldkw: formValues.oldkw,
        oldkw2: formValues.oldkw2,
        panid: configSerialize(formValues.panId),
        pindao: formValues.channel,
        projectId: formValues.projectId,
        shellNumber: formValues.shellNumber,
        typeId: formValues.typeId
      }
      await save(params)
      this.$message.info('修改智能灯成功')
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
    async projectChange(id) {
      // 先清空已经选择的网关
      this.form.setFieldsValue({
        'groupId': ''
      })
      this.currentGroupOptListRaw = await getGroupListOptByProjectId(id)

      this.groupOpt = this.currentGroupOptListRaw.map(item => {
        return {
          value: item.id,
          label: item.groupName
        }
      })
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
