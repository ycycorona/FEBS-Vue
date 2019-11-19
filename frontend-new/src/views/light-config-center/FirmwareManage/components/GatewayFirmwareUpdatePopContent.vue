<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="20">
        <a-form-item label="版本号" v-bind="formItemLayout">
          <a-input
            v-decorator="['version',
                          {
                            rules:[{ required: true, message: '版本号不能为空'}],
                            initialValue: formValues.version}]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="固件名称" v-bind="formItemLayout">
          <a-input
            v-decorator="['versionName',
                          {
                            rules:[{ required: true, message: '固件名称不能为空'}],
                            initialValue: formValues.versionName}]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="项目" v-bind="formItemLayout">
          <a-select
            v-decorator="['projectId', {
              rules:[{ required: true, message: '项目不能为空'}],
              initialValue: formValues.projectId,
            }]"
            :options="projectOpt"
            @change="projectChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="网关" v-bind="formItemLayout">
          <a-select
            v-decorator="['gatewayIds', {
              rules:[{ required: true, message: '网关不能为空'}],
              initialValue: formValues.gatewayIds
            }]"
            mode="multiple"
            :options="gatewayOpt"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { gatewayUpdate } from '@/service/firmwareManageService'
import { getListOptByPid } from '@/service/gatewayManageService'
import { configSerialize } from '@/utils/common'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      version: detailData.version,
      versionName: detailData.versionName,
      projectId: '',
      gatewayIds: []
    }
  } else {
    return {
      version: '',
      versionName: '',
      projectId: '',
      gatewayIds: []
    }
  }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'GatewayFirmwareUpdatePopContent',
  components: { },
  props: {
    detailData: {
      type: Object
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    fileType: {
      type: Number
    },
    projectOpt: {
      type: Array
    }
  },
  data() {
    const formValues = this.$props.isEdit
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
    let versionName = ''
    if (this.isEdit && this.detailData) {
      versionName = this.detailData.versionName
    }
    return {
      formItemLayout, formItemLayout_1,
      formValues,
      form: this.$form.createForm(this),
      file: null,
      lastFileName: versionName,
      gatewayOpt: [],
      currentGatewayListRaw: []
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
      await this.update(formValues)
      return true
    },
    async update(formValues) {
      const params = {
        gatewayIds: configSerialize(formValues.gatewayIds),
        projectId: formValues.projectId,
        versionId: formValues.version
      }
      // console.log(params)
      await gatewayUpdate(params)
      this.$message.info('固件下发成功')
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
      // 先清空已经选择的项目
      this.form.setFieldsValue({
        'gatewayIds': []
      })
      this.currentGatewayListRaw = await getListOptByPid(id)

      this.gatewayOpt = this.currentGatewayListRaw.map(item => {
        return {
          value: item.id,
          label: item.gatewayName
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.last-desc {
  font-style: italic
}
</style>
