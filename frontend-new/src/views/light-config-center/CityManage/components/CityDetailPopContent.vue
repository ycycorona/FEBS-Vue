<template>
  <a-spin :spinning="loading">
    <a-form :form="form">
      <a-row :gutter="12">
        <a-col :span="20">
          <a-form-item label="省份" v-bind="formItemLayout">
            <a-select
              v-decorator="['province',
                            {
                              rules:[{ required: true, message: '省份不能为空'}],
                              initialValue: formValues.province}]"
              :options="provinceOpts"
              placeholder="请选择省份"
              @change="provinceChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="20">
          <a-form-item label="城市" v-bind="formItemLayout">
            <a-select
              v-decorator="['city',
                            {
                              rules:[{ required: true, message: '城市不能为空'}],
                              initialValue: formValues.city}]"
              placeholder="请选择城市"
              :options="cityOpts"
              label-in-value
              @change="cityChange"
            />

          </a-form-item>
        </a-col>
      </a-row>
      <template v-if="currentCityId!==undefined">
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item label="位置" v-bind="formItemLayout_1">
              <position-input
                v-decorator="['position',
                              {rules: [
                                 { required: true, message: '位置不能为空'}
                               ],
                               initialValue: formValues.position}]"
                palceholder="请选择网关位置"
                :readonly="true"
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
      </template>
    </a-form>
  </a-spin>
</template>
<script>
import { BasePosition } from '@/config/LightConstant'
import PointerSelect from '@/components/diyMap/PointerSelect'
import PositionInput from '@/components/diyMap/PositionInput'
import cityData from '@/config/cityData'
const provinceOpts = ((cityData) => {
  const provinceList = []
  for (let i = 1; i < cityData.length; i++) {
    provinceList.push({ value: cityData[i][1][0], label: cityData[i][0][0] })
  }
  return provinceList
})(cityData)
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
function formValueFormater() {
  return {
    province: undefined,
    city: undefined,
    position: BasePosition
  }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'CityDetailPopContent',
  components: { PointerSelect, PositionInput },
  props: {

  },
  data() {
    const formValues = formValueFormater()
    return {
      loading: false,
      formItemLayout, formItemLayout_1,
      formValues,
      form: this.$form.createForm(this),
      provinceOpts,
      currentProvinceId: '',
      currentCityId: '',
      currentCityLabel: '',
      pointerSelectValue: formValues.position
    }
  },
  computed: {
    cityOpts() {
      const currentProvinceId = this.currentProvinceId

      if (currentProvinceId === '') return []

      const cityList = []
      let tmp
      for (let i = 1, length = cityData.length; i < length; i++) {
        if (cityData[i][1][0] === currentProvinceId) {
          tmp = cityData[i][0]
        }
      }
      for (var i = 1, length = tmp.length; i < length; i++) {
        cityList.push({ value: i, label: tmp[i] })
      }
      this.form.setFieldsValue({
        city: undefined
      })
      return cityList
    }
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
      await this.save(formValues)
      return true
    },
    save(formValues) {
      const params = []
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$post('/business/city/addCity', {
          name: '',
          province: '',
          lat: '',
          lng: ''
        }).then(r => {
          this.$message.info('新增城市成功')
          resolve(r.data.data)
        })
          .finally(() => {
            this.loading = false
          })
      })
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
    provinceChange(provinceId) {
      this.currentProvinceId = provinceId
    },
    cityChange(valObj) {
      this.currentCityId = valObj.value
      this.currentCityLabel = valObj.label
    },
    // 智能灯经纬度改变 从地图
    positionChangeFromMap([lng, lat]) {
      this.form.setFieldsValue({ position: [lng, lat] })
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
