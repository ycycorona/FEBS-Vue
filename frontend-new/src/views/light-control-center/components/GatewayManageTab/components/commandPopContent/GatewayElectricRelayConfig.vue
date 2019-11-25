<template>
  <a-spin :spinning="loading">
    <a-form :form="form" :self-update="true">
      <a-row :gutter="12">
        <a-col :span="2" class="text-center">
          <span class="all-switch-text">启用/禁用</span>
          <a-switch v-model="switchAll" :disabled="readonly" @change="allSwitchChange"></a-switch>
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
              v-model="currentSwitchList[index]"
              :disabled="readonly"
              @change="switchChange(arguments[0], index)"
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
                             initialValue: formValues.name[index]}]"
              :disabled="!currentSwitchList[index]"
              :readonly="readonly"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4" class="text-center">
          <a-form-item label="回路模式" v-bind="formItemLayout_noLabel">
            <a-select
              v-decorator="[
                `type[${index}]`, {
                  initialValue: formValues.type[index]
                }
              ]"
              :class="{'readonly': readonly}"
              :disabled="!currentSwitchList[index] || readonly"
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
                             initialValue: formValues.openTime[index]}]"
              :class="{'readonly': readonly}"
              :disabled="!currentSwitchList[index] || readonly"
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
                             initialValue: formValues.closeTime[index]}]"
              :class="{'readonly': readonly}"
              :disabled="!currentSwitchList[index] || readonly"
              :allow-clear="false"
              class="full-width"
              :format="TimepickerFormat"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script>
import { createArrayFromNum } from '@/utils/common'
// import TabTitle from '@/components/fragment/TabTitle'
import DebouncedInput from '@/components/input/DebouncedInput/DebouncedInput'
import moment from 'moment'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const formItemLayout_noLabel = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
}
let number = 2
const TimepickerFormat = 'HH:mm:ss'
function momentObjFactory(str = '00:00:00') {
  return moment(str, 'HH:mm:ss')
}
function formValueFormater(detailData, number) {
  return {
    name: createArrayFromNum(number, ''),
    switch: createArrayFromNum(number, false),
    type: createArrayFromNum(number, 0), // 回复开关模式 定时和经纬度
    openTime: createArrayFromNum(number, momentObjFactory),
    closeTime: createArrayFromNum(number, momentObjFactory)
  }
}
export default {
  name: 'GatewayElectricRelayConfig',
  components: { /* TabTitle, */ DebouncedInput },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object
    },
    editId: {
      type: [String, Number]
    }
  },
  data() {
    number = 16
    const formValues = this.$props.detailData
      ? formValueFormater(this.$props.detailData, number) : formValueFormater(null, number)
    this.formValues = formValues
    return {
      number,
      TimepickerFormat, formItemLayout_noLabel,
      loading: false,
      formItemLayout,

      form: this.$form.createForm(this),
      currentSwitchList: formValues.switch,
      switchAll: false
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
    },
    switchChange(checked, index) {
      if (!checked) {
        this.switchAll = false
      }

      // this.formValues.switch[index] = checked
      // console.log(checked, index)
      // this.currentSwitchList[index] = checked
    },
    allSwitchChange(checked) {
      for (let i = 0; i < this.currentSwitchList.length; i++) {
        this.currentSwitchList[i] = checked
      }
    }
  }
}
</script>

<style lang="less" scoped>
.no-margin-divide /deep/ .ant-divider-horizontal {
  margin: 5px 0;
}
.all-switch-text {
  position: absolute;
  top: -20px
}
</style>
