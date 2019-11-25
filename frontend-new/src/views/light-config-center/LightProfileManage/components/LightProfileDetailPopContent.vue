<template>
  <a-form :form="form" :self-update="true">
    <a-row :gutter="12">
      <a-col :span="24">
        <a-form-item label="策略名称" v-bind="formItemLayout">
          <a-input
            v-decorator="['profileName',
                          {rules: [
                             { required: true, message: '策略名称不能为空'}
                           ],
                           initialValue: formValues.profileName}]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="开灯时间" v-bind="formItemLayout">
          <a-time-picker
            v-decorator="['lightOpenTime',
                          {rules: [
                             { required: true, message: '开灯时间不能为空'}
                           ],
                           initialValue: formValues.lightOpenTime}]"
            :allow-clear="false"
            class="full-width"
            :format="TimepickerFormat"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="熄灯时间" v-bind="formItemLayout">
          <a-time-picker
            v-decorator="['lightCloseTime',
                          {rules: [
                             { required: true, message: '熄灯时间不能为空'}
                           ],
                           initialValue: formValues.lightCloseTime}]"
            :allow-clear="false"
            class="full-width"
            :format="TimepickerFormat"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="延迟开灯/分钟" v-bind="formItemLayout">
          <number-slider
            v-decorator="['delayOpenMinutes',
                          {rules: [

                           ],
                           initialValue: formValues.delayOpenMinutes}]"
            :min="-120"
            :max="120"
          ></number-slider>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="延迟关灯/分钟" v-bind="formItemLayout">
          <number-slider
            v-decorator="['delayCloseMinutes',
                          {rules: [

                           ],
                           initialValue: formValues.delayCloseMinutes}]"
            :min="-120"
            :max="120"
          ></number-slider>
        </a-form-item>
      </a-col>
    </a-row>
    <tab-title title="分段时间功率设置" />
    <a-row :gutter="12">
      <a-col :span="12" class="text-center">I路</a-col>
      <a-col :span="12" class="text-center">II路</a-col>
    </a-row>
    <div class="no-margin-divide">
      <a-divider />
    </div>
    <a-row :gutter="12">
      <a-col :span="4" class="text-center">功率(%)</a-col>
      <a-col :span="8" class="text-center">本段结束时间节点</a-col>
      <a-col :span="4" class="text-center">功率(%)</a-col>
      <a-col :span="8" class="text-center">本段结束时间节点</a-col>
    </a-row>
    <div class="no-margin-divide">
      <a-divider />
    </div>
    <a-row :gutter="12">
      <a-col :span="4" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-input-number
            v-decorator="['powerIArray[0]',
                          {rules: [

                           ],
                           initialValue: formValues.powerIArray[0]}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-time-picker
            v-decorator="['timePointI[0]',
                          {rules: [
                             { required: true, message: '时间节点不能为空'}
                           ],
                           initialValue: formValues.timePointI[0]}]"
            :allow-clear="false"
            class="full-width"
            :format="TimepickerFormat"
          />
        </a-form-item>
      </a-col>
      <a-col :span="4" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-input-number
            v-decorator="['powerIIArray[0]',
                          {rules: [

                           ],
                           initialValue: formValues.powerIIArray[0]}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-time-picker
            v-decorator="['timePointII[0]',
                          {rules: [
                             { required: true, message: '时间节点不能为空'}
                           ],
                           initialValue: formValues.timePointII[0]}]"
            :allow-clear="false"
            class="full-width"
            :format="TimepickerFormat"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="4" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-input-number
            v-decorator="['powerIArray[1]',
                          {rules: [

                           ],
                           initialValue: formValues.powerIArray[1]}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-time-picker
            v-decorator="['timePointI[1]',
                          {rules: [
                             { required: true, message: '时间节点不能为空'}
                           ],
                           initialValue: formValues.timePointI[1]}]"
            :allow-clear="false"
            class="full-width"
            :format="TimepickerFormat"
          />
        </a-form-item>
      </a-col>
      <a-col :span="4" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-input-number
            v-decorator="['powerIIArray[1]',
                          {rules: [

                           ],
                           initialValue: formValues.powerIIArray[1]}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-time-picker
            v-decorator="['timePointII[1]',
                          {rules: [
                             { required: true, message: '时间节点不能为空'}
                           ],
                           initialValue: formValues.timePointII[1]}]"
            :allow-clear="false"
            class="full-width"
            :format="TimepickerFormat"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="4" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-input-number
            v-decorator="['powerIArray[2]',
                          {rules: [

                           ],
                           initialValue: formValues.powerIArray[2]}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-time-picker
            v-decorator="['timePointI[2]',
                          {rules: [
                             { required: true, message: '时间节点不能为空'}
                           ],
                           initialValue: formValues.timePointI[2]}]"
            :allow-clear="false"
            class="full-width"
            :format="TimepickerFormat"
          />
        </a-form-item>
      </a-col>
      <a-col :span="4" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-input-number
            v-decorator="['powerIIArray[2]',
                          {rules: [

                           ],
                           initialValue: formValues.powerIIArray[2]}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-time-picker
            v-decorator="['timePointII[2]',
                          {rules: [
                             { required: true, message: '时间节点不能为空'}
                           ],
                           initialValue: formValues.timePointII[2]}]"
            :allow-clear="false"
            class="full-width"
            :format="TimepickerFormat"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="4" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-input-number
            v-decorator="['powerIArray[3]',
                          {rules: [

                           ],
                           initialValue: formValues.powerIArray[3]}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" class="text-center">

      </a-col>
      <a-col :span="4" class="text-center">
        <a-form-item label="" v-bind="formItemLayout_noLabel">
          <a-input-number
            v-decorator="['powerIIArray[3]',
                          {rules: [

                           ],
                           initialValue: formValues.powerIIArray[3]}]"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" class="text-center">

      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { save, add } from '@/service/lightProfileManageService'
import NumberSlider from '@/components/input/NumberSlider/NumberSlider'
import TabTitle from '@/components/fragment/TabTitle'
import moment from 'moment'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
const formItemLayout_noLabel = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
const TimepickerFormat = 'HH:mm:ss'
function momentObjFactory(str = '00:00:00') {
  return moment(str, 'HH:mm:ss')
}
function momentFomatter(momentObj) {
  return momentObj ? momentObj.format('HH:mm:ss') : ''
}
function formValueFormater(detailData = null) {
  if (detailData) {
    const d = detailData
    return {
      profileName: d.profileName,
      lightOpenTime: momentObjFactory(d.onTime),
      lightCloseTime: momentObjFactory(d.offTime),
      delayOpenMinutes: d.offset4on,
      delayCloseMinutes: d.offset4off,
      powerIArray: [d.v1, d.v2, d.v3, d.v4],
      powerIIArray: [d.v21, d.v22, d.v23, d.v24],
      timePointI: [momentObjFactory(d.t1), momentObjFactory(d.t2), momentObjFactory(d.t3)],
      timePointII: [momentObjFactory(d.t21), momentObjFactory(d.t22), momentObjFactory(d.t23)]
    }
  } else {
    return {
      profileName: '',
      lightOpenTime: momentObjFactory(),
      lightCloseTime: momentObjFactory(),
      delayOpenMinutes: 0,
      delayCloseMinutes: 0,
      powerIArray: [50, 50, 50, 50],
      powerIIArray: [50, 50, 50, 50],
      timePointI: [momentObjFactory(), momentObjFactory(), momentObjFactory()],
      timePointII: [momentObjFactory(), momentObjFactory(), momentObjFactory()]
    }
  }
}

export default {
  name: 'LightProfileDetailPopContent',
  components: { NumberSlider, TabTitle },
  props: {
    detailData: {
      type: Object
    },
    isEdit: {
      default: false,
      type: Boolean
    }
  },
  data() {
    const formValues = this.$props.isEdit
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
    return {
      formItemLayout, formItemLayout_1, formItemLayout_noLabel,
      TimepickerFormat,
      formValues,
      form: this.$form.createForm(this)
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.$store.commit('contact/setCurrentPopContent', this)
  },
  mounted() {

  },
  methods: {
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
        offTime: momentFomatter(formValues.lightCloseTime),
        onTime: momentFomatter(formValues.lightOpenTime),
        profileName: formValues.profileName,
        offset4off: formValues.delayCloseMinutes,
        offset4on: formValues.delayOpenMinutes,
        t1: momentFomatter(formValues.timePointI[0]),
        t2: momentFomatter(formValues.timePointI[1]),
        t3: momentFomatter(formValues.timePointI[2]),
        t21: momentFomatter(formValues.timePointII[0]),
        t22: momentFomatter(formValues.timePointII[1]),
        t23: momentFomatter(formValues.timePointII[2]),
        v1: formValues.powerIArray[0],
        v2: formValues.powerIArray[1],
        v3: formValues.powerIArray[2],
        v4: formValues.powerIArray[3],
        v21: formValues.powerIIArray[0],
        v22: formValues.powerIIArray[1],
        v23: formValues.powerIIArray[2],
        v24: formValues.powerIIArray[3]
      }
      // console.log(params)
      // return
      await add(params)
      this.$message.info('新增开关灯策略成功')
    },
    async save(formValues) {
      const params = {
        id: this.detailData.id,
        offTime: momentFomatter(formValues.lightCloseTime),
        onTime: momentFomatter(formValues.lightOpenTime),
        profileName: formValues.profileName,
        offset4off: formValues.delayCloseMinutes,
        offset4on: formValues.delayOpenMinutes,
        t1: momentFomatter(formValues.timePointI[0]),
        t2: momentFomatter(formValues.timePointI[1]),
        t3: momentFomatter(formValues.timePointI[2]),
        t21: momentFomatter(formValues.timePointII[0]),
        t22: momentFomatter(formValues.timePointII[1]),
        t23: momentFomatter(formValues.timePointII[2]),
        v1: formValues.powerIArray[0],
        v2: formValues.powerIArray[1],
        v3: formValues.powerIArray[2],
        v4: formValues.powerIArray[3],
        v21: formValues.powerIIArray[0],
        v22: formValues.powerIIArray[1],
        v23: formValues.powerIIArray[2],
        v24: formValues.powerIIArray[3]
      }
      await save(params)
      this.$message.info('修改开关等策略成功')
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
