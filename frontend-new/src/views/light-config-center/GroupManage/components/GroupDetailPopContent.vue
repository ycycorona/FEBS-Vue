<template>
  <a-form :form="form">
    <a-row :gutter="12">
      <a-col :span="20">
        <a-form-item label="编组名称" v-bind="formItemLayout">
          <a-input
            v-decorator="['groupName',
                          {
                            rules:[{ required: true, message: '编组名称不能为空'}],
                            initialValue: formValues.groupName}]"
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
            v-decorator="['gatewayId', {
              rules:[{ required: true, message: '网关不能为空'}],
              initialValue: formValues.gatewayId
            }]"
            :options="gatewayOpt"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="智能灯模式" v-bind="formItemLayout">
          <a-select
            v-decorator="['profileId', {
              rules:[{ required: true, message: '智能灯模式不能为空'}],
              initialValue: formValues.profileId
            }]"
            :options="lightProfileOpt"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="智能灯类型" v-bind="formItemLayout">
          <a-select
            v-decorator="['lightType', {
              rules:[{ required: true, message: '智能灯模式不能为空'}],
              initialValue: formValues.lightType
            }]"
            :options="lightTypeOpt"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="编组地址" v-bind="formItemLayout">
          <a-input
            v-decorator="['address',
                          {
                            rules:[{ required: true, message: '编组地址不能为空'}],
                            initialValue: formValues.address}]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="20">
        <a-form-item label="备注" v-bind="formItemLayout">
          <a-textarea
            v-decorator="['descr',
                          {rules: [

                           ],
                           initialValue: formValues.descr}]"
            class="text-area"
            :rows="15"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { save, add } from '@/service/groupManageService'
import { getListOptByPid } from '@/service/gatewayManageService'
import { getListOpt as getLightTypeListOpt } from '@/service/lightTypeManageService'
import { getListOpt as getLightProfileListOpt } from '@/service/lightProfileManageService'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
function formValueFormater(detailData = null) {
  if (detailData) {
    return {
      groupName: detailData.groupName,
      projectId: detailData.projectId,
      gatewayId: detailData.gatewayId,
      profileId: detailData.profileId,
      lightType: detailData.lightType,
      address: detailData.address,
      descr: detailData.descr
    }
  } else {
    return {
      groupName: '',
      projectId: '',
      gatewayId: '',
      profileId: '',
      lightType: '',
      address: '',
      descr: ''
    }
  }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
export default {
  name: 'GroupDetailPopContent',
  components: { },
  props: {
    detailData: {
      type: Object
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    projectOpt: {
      type: Array
    },
    readonly: {
      default: false,
      type: Boolean
    },
    editId: {
      default: '',
      type: [String, Number]
    }
  },
  data() {
    const formValues = this.$props.isEdit
      ? formValueFormater(this.$props.detailData) : formValueFormater(null)
    return {
      formItemLayout, formItemLayout_1,
      formValues,
      form: this.$form.createForm(this),
      currentGatewayListRaw: [],
      currentlightTypeOptRaw: [],
      currentlightProfileOptRaw: [],
      gatewayOpt: [],
      lightProfileOpt: [],
      lightTypeOpt: []
    }
  },
  computed: {

  },
  watch: {

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
    getLightProfileListOpt()
      .then(data => {
        this.currentlightProfileOptRaw = data
        this.lightProfileOpt = this.currentlightProfileOptRaw.map(item => {
          return {
            value: item.id,
            label: item.profileName
          }
        })
      })
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
        groupName: formValues.groupName,
        projectId: formValues.projectId,
        gatewayId: formValues.gatewayId,
        profileId: formValues.profileId,
        lightType: formValues.lightType,
        address: formValues.address,
        descr: formValues.address
      }
      await add(params)
      this.$message.info('新增编组成功')
    },
    async save(formValues) {
      const params = {
        id: this.editId,
        groupName: formValues.groupName,
        projectId: formValues.projectId,
        gatewayId: formValues.gatewayId,
        profileId: formValues.profileId,
        lightType: formValues.lightType,
        address: formValues.address,
        descr: formValues.address
      }
      await save(params)
      this.$message.info('修改编组成功')
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
        'gatewayId': ''
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

</style>
