<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
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
  </a-spin>
</template>
<script>
import NumberSlider from '@/components/input/NumberSlider/NumberSlider'
import TabTitle from '@/components/fragment/TabTitle'
import moment from 'moment'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const formItemLayout_noLabel = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
}
const TimepickerFormat = 'HH:mm:ss'
function momentObjFactory(str = '00:00:00') {
  return moment(str, 'HH:mm:ss')
}
function formValueFormater() {
  return {
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
export default {
  name: 'LightControlStrategy',
  components: { NumberSlider, TabTitle },
  props: {

  },
  data() {
    const formValues = formValueFormater()
    return {
      TimepickerFormat, formItemLayout_noLabel,
      loading: false,
      formItemLayout,
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
  methods: {
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
.no-margin-divide /deep/ .ant-divider-horizontal {
  margin: 5px 0;
}
</style>
