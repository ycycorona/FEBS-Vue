<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="24">
          <a-form-item label="智能灯位置" v-bind="formItemLayout">
            <position-input
              v-decorator="['lightPosition',
                            {rules: [
                               { required: true, message: '智能灯位置不能为空'}
                             ],
                             initialValue: formValues.lightPosition}]"
              palceholder="请选择智能灯位置"
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
  </a-spin>
</template>
<script>
import { BasePosition } from '@/config/LightConstant'
import moment from 'moment'
import PointerSelect from '@/components/diyMap/PointerSelect'
import PositionInput from '@/components/diyMap/PositionInput'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const formItemLayout_1 = {
  labelCol: { span: 0 },
  wrapperCol: { offset: 5, span: 19 }
}
function formValueFormater() {
  return {
    lightPosition: BasePosition
  }
}
export default {
  name: 'LightPosition',
  components: { PointerSelect, PositionInput },
  props: {

  },
  data() {
    const formValues = formValueFormater()
    return {
      BasePosition,
      moment,
      loading: false,
      formItemLayout, formItemLayout_1,
      formValues,
      form: this.$form.createForm(this),
      pointerSelectValue: formValues.lightPosition
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
    getLocalDate() {
      this.form.setFieldsValue({ 'sysDateTime': moment(new Date()) })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
