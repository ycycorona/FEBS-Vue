<template>
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
            @change="cityChange"
          />

        </a-form-item>
      </a-col>
    </a-row>
    <template v-if="currentCity!==undefined">
      <a-row :gutter="12">
        <a-col :span="24">
          <a-form-item label="位置" v-bind="formItemLayout_1">
            <position-input
              v-decorator="['position',
                            {rules: [
                               { required: true, message: '位置不能为空'}
                             ],
                             initialValue: formValues.position}]"
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
</template>
<script>
import { BasePosition } from '@/config/LightConstant'
import PointerSelect from '@/components/diyMap/PointerSelect'
import PositionInput from '@/components/diyMap/PositionInput'
import cityData from '@/config/cityData'
import { save as saveCity, add as addCity } from '@/service/cityManageService'
/* const cityTool = {
  getArray(val) {
    return val.split('--')
  },
  getId(val) {
    return Number(this.getArray(val)[0])
  },
  getName(val) {
    return this.getArray(val)[1]
  }
} */
const provinceOpts = ((cityData) => {
  const provinceList = []
  for (let i = 1; i < cityData.length; i++) {
    provinceList.push({ value: cityData[i][0][0], label: cityData[i][0][0] })
  }
  return provinceList
})(cityData)
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      province: detailData.province,
      city: detailData.name,
      position: [detailData.lng, detailData.lat]
    }
  } else {
    return {
      province: undefined,
      name: undefined,
      position: BasePosition
    }
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
      loading: false,
      formItemLayout, formItemLayout_1,
      formValues,
      form: this.$form.createForm(this),
      provinceOpts,
      currentProvince: '',
      currentCity: '',
      pointerSelectValue: formValues.position
    }
  },
  computed: {
    cityOpts() {
      const currentProvince = this.currentProvince

      if (currentProvince === '') return []

      const cityList = []
      let tmp
      for (let i = 1, length = cityData.length; i < length; i++) {
        if (cityData[i][0][0] === currentProvince) {
          tmp = cityData[i][0]
        }
      }
      for (let i = 1, length = tmp.length; i < length; i++) {
        cityList.push({ value: tmp[i], label: tmp[i] })
      }

      return cityList
    }
  },
  watch: {

  },
  created() {
    this.$store.commit('contact/setCurrentPopContent', this)
  },
  mounted() {
    if (this.isEdit) {
      this.provinceChange(this.form.getFieldValue('province'), false)
    }
  },
  methods: {
    // async test() {
    //   console.log('start')
    //   await this.testPro()
    //     .finally(() => {
    //       console.log('finally')
    //     })
    //   console.log('end')
    // },
    // testPro() {
    //   return new Promise((res, rej) => {
    //     console.log('testPro start')
    //     rej()
    //   })
    // },
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
        name: formValues.city,
        province: formValues.province,
        lat: formValues.position[1],
        lng: formValues.position[0]
      }
      await addCity(params)
      this.$message.info('新增城市成功')
    },
    async save(formValues) {
      const params = {
        name: formValues.city,
        province: formValues.province,
        lat: formValues.position[1],
        lng: formValues.position[0],
        id: this.detailData.id
      }
      await saveCity(params)
      this.$message.info('修改城市成功')
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
    provinceChange(province, clearCity = true) {
      this.currentProvince = province
      if (clearCity) {
        this.form.setFieldsValue({
          city: undefined
        })
      }
    },
    cityChange(city) {
      this.currentCity = city
      this.$refs['positonSelect'].updatePointerByCityName(city)
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
