<template>
  <a-drawer
    destroy-on-close
    class="create-control-strategy-pop"
    :title="isEditPage ? '策略管理' : '新增管控策略'"
    :mask-closable="readOnly"
    width="650"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-spin size="small" :spinning="isLoading">
      <tab-title title="策略生效条件"></tab-title>
      <a-form :form="formCondition">
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="策略名称" v-bind="formItemLayout">
              <a-input
                v-decorator="['strategyName',
                              {rules: [
                                 { required: true, message: '策略名称不能为空'},
                                 { max: 20, message: '长度不能超过20个字符'}
                               ],
                               initialValue: formValue.condition.strategyName}]"
                :read-only="readOnly"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="策略类型" v-bind="formItemLayout">
              <a-select
                v-decorator="['strategyType', {
                  rules: [

                  ],
                  initialValue: formValue.condition.strategyType
                }]"
                :disabled="readOnly"
                placeholder="策略属性"
                @change="onStrategyTypeChange"
              >
                <a-select-option :value="0">长期</a-select-option>
                <a-select-option :value="1">临时</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="日期" v-bind="formItemLayout">
              <a-range-picker
                v-if="!dateRangeDisable"
                v-decorator="['dateRange',
                              {rules: [
                                 { required: !dateRangeDisable, type: 'array', message: '日期不能为空'}
                               ],
                               initialValue: formValue.condition.dateRange}]"
                :disabled="readOnly"
                :disabled-date="disabledDate"
              >
              </a-range-picker>
              <a-input v-else value="长期" read-only />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-form-item style="margin-bottom:0!important">
            <multi-time-range-picker
              v-decorator="['timeRange',
                            {rules: [
                               { required: true, type: 'array', message: '时间不能为空'}
                             ],
                             initialValue: formValue.condition.timeRange}]"
              :disabled="readOnly"
            ></multi-time-range-picker>
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="管控区域" v-bind="formItemLayout">
              <a-select
                v-decorator="['controlArea', {
                  initialValue: formValue.condition.controlArea
                }]"
                :disabled="readOnly"
                allow-clear
                placeholder="根据策略需要是否填写本条件"
              >
                <a-select-option :value="1">电子围栏1</a-select-option>
                <a-select-option :value="2">电子围栏2</a-select-option>
                <a-select-option :value="3">电子围栏3</a-select-option>
                <a-select-option :value="4">电子围栏4</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <tab-title title="策略内容"></tab-title>
      <a-form :form="formContent">
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="指令类型" v-bind="formItemLayout">
              <a-select
                v-decorator="['directiveTypes',
                              {rules: [
                                 { required: true, type: 'array', message: '指令类型不能为空'}
                               ],
                               initialValue: formValue.content.directiveTypes}]"
                :disabled="readOnly"
                placeholder="请选择指令类型"
                mode="multiple"
                :options="directivesOpt"
                @change="onDirectiveTypesChange"
              >

              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item v-if="isGeoFenceSelector" label="电子围栏" v-bind="formItemLayout">
              <a-select
                v-decorator="['geoFenceConfig',{
                  rules: [
                    { required: true, type: 'array', message: '电子围栏不能为空'}
                  ],
                  initialValue: formValue.content.geoFenceConfig}]"
                :disabled="readOnly"
                placeholder="点击选择电子围栏"
                mode="multiple"
                :options="directiveConfigMap[12]"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item v-if="isExtractImgs" label="图片提取配置" v-bind="formItemLayout">
              <a-select
                v-decorator="['extractImgsConfig', {rules: [
                  { required: true, type: 'array', message: '不能为空'}
                ]}]"
                :disabled="readOnly"
                placeholder="点击选择图片提取配置"
              >
                <a-select-option :value="1">配置1</a-select-option>
                <a-select-option :value="2">配置2</a-select-option>
                <a-select-option :value="3">配置3</a-select-option>
                <a-select-option :value="4">配置4</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <tab-title title="策略管控人员"></tab-title>
      <a-form :form="formPerson">
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="管控人员" v-bind="formItemLayout">
              <a-input
                v-decorator="['strategyBindPerson',{
                  initialValue: formValue.personNum}]"
                :read-only="true"
                @click="opUserPicker"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template v-if="!readOnly">
      <div class="drawer-bootom-button">
        <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
          <a-button style="margin-right: .8rem">取消</a-button>
        </a-popconfirm>
        <a-button :disabled="!isCanSaveAndSend" type="primary" style="margin-right: .8rem" @click="doSubmit">下发</a-button>
        <a-button :disabled="isCanSaveAndSend" type="primary" class="green-btn" @click="doSubmit">暂存</a-button>
      </div>
    </template>
    <user-picker-pop
      :read-only="true"
      model-title="已选择人员"
      :value="selectUserId"
      :visible.sync="userPickerPopVisible"
      @success="userPickSuccess"
    ></user-picker-pop>
  </a-drawer>

</template>

<script>

import cloneDeep from 'lodash/cloneDeep'
import { configDeserialize, configSerialize, timeRangeSerialize, timeRangeDeserialize } from '@/utils/common'
import moment from 'moment'
import TabTitle from '@/components/fragment/TabTitle'
import MultiTimeRangePicker from '@/components/MultiTimeRangePicker'
import UserPickerPop from '@/components/UserPickerPop'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
function formValueFormater() {
  return {
    condition: {
      strategyName: '',
      strategyType: 0,
      dateRange: [],
      controlArea: '',
      timeRange: [['00:01', '23:59']]

    },
    content: {
      directiveTypes: [],
      geoFenceConfig: []
    },
    personNum: '0人'
  }
}
export default {
  name: 'CreateControlStrategyPop',
  components: { TabTitle, MultiTimeRangePicker, UserPickerPop },
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    isEditPage: {
      type: Boolean,
      default: false
    },
    editId: {
      type: [Number, String],
      default: null
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formValue: formValueFormater(),
      moment,
      isLoading: false,
      formCondition: this.$form.createForm(this),
      formContent: this.$form.createForm(this),
      formPerson: this.$form.createForm(this),
      selectUser: [], // 选中的人
      formItemLayout,
      dateRangeDisable: true, // 长期策略不需要选日期范围
      isGeoFenceSelector: false,
      isExtractImgs: false,
      userPickerPopVisible: false,
      rawStrategyDetail: null, // 来自服务端的策略详情
      directivesOpt: [],
      directiveConfigMap: null
    }
  },
  computed: {
    selectUserId() {
      return this.selectUser.map(item => item.db_id)
    },
    // 是否选好了人，可以保存并下发
    isCanSaveAndSend() {
      return this.selectUserId.length > 0 || (this.rawStrategyDetail && this.rawStrategyDetail.isPushed === 1)
    }
  },
  watch: {
    visible: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          // 显示
          // 如果是编辑页面
          if (this.isEditPage) {
            this.isLoading = true
            this.rawStrategyDetail = await this.getStrategyDetail()
            const { rawStrategyDetail } = this
            this.formValue = {
              condition: {
                strategyName: rawStrategyDetail.strategyName,
                strategyType: rawStrategyDetail.strategyType,
                dateRange: [moment(rawStrategyDetail.startDate), moment(rawStrategyDetail.endDate)],
                controlArea: rawStrategyDetail.controlZone,
                timeRange: timeRangeDeserialize(rawStrategyDetail.startEndTime)
              },
              content: {
                directiveTypes: configDeserialize(rawStrategyDetail.configIds),
                geoFenceConfig: configDeserialize(rawStrategyDetail.electronicFenceIds)
              },
              personNum: rawStrategyDetail.userCount
            }
            if (rawStrategyDetail.strategyType === 1) {
              this.formValue.condition.dateRange =
                [moment(rawStrategyDetail.startDate), moment(rawStrategyDetail.endDate)]
            }
            this.onDirectiveTypesChange(this.formValue.content.directiveTypes)
            this.onStrategyTypeChange(this.formValue.condition.strategyType)
            this.isLoading = false
          }
        } else {
        // 销毁
          this.formValue = formValueFormater()
          this.formCondition.resetFields()
          this.formContent.resetFields()
          this.formPerson.resetFields()
          this.selectUser = []
        }
      }
    }
  },
  async created() {
    this.directivesOpt = await this.getDirectiveOpt()
    const directiveConfigRaw = await this.getDirectiveConfig(
      this.directivesOpt.map(item => item.value).join(',')
    )
    const directiveConfigMap = {}
    directiveConfigRaw.forEach(item => {
      directiveConfigMap[item.id] = item.configList.map(item => {
        return { value: item.id, label: item.configName }
      })
    })
    this.directiveConfigMap = directiveConfigMap
  },
  methods: {
    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },
    onClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    getStrategyDetail() {
      return new Promise((resolve, reject) => {
        this.$get('/business/cmd-strategy/getStrategyDetailAndUsers', {
          strategyId: this.editId
        })
          .then((r) => {
            if (r.data.state === 1) {
              resolve(r.data.data)
            } else {
              throw r.data.message
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    validateFields() {
      let validateFlag = true
      this.formCondition.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
      })
      this.formContent.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
      })
      return validateFlag
    },
    async doSubmit() {
      if (!this.validateFields()) { return }
      let newEditId = null
      // 先提交策略
      if (!this.isEditPage) {
        newEditId = await this.createStrategy()
      } else {
        newEditId = await this.saveEditedStrategy()
      }
      // 拿到neweditit用户
      if (this.selectUserId.length > 0) {
        await this.pushStrategy(newEditId)
      }
      this.$emit('success')
    },
    // 新建策略
    createStrategy() {
      const formConditionValue = this.formCondition.getFieldsValue()
      const formContentValue = this.formContent.getFieldsValue()
      // console.log(formConditionValue, formContentValue)
      const params = {
        configIds: configSerialize(formContentValue.directiveTypes),
        electronicFenceIds: configSerialize(formContentValue.geoFenceConfig),
        strategyType: formConditionValue.strategyType,
        strategyName: formConditionValue.strategyName,
        controlZone: formConditionValue.controlArea,
        generatedSource: 1,
        startEndTime: timeRangeSerialize(formConditionValue.timeRange)
      }
      if (params.strategyType === 1) {
        params.startDate = formConditionValue.dateRange[0].format('YYYY-MM-DD')
        params.endDate = formConditionValue.dateRange[1].format('YYYY-MM-DD')
      }
      return new Promise((resolve, reject) => {
        this.$post('/business/cmd-strategy/createStrategy', params).then(r => {
          resolve(r.data.data)
        })
      })
    },
    // 保存编辑过的策略
    saveEditedStrategy() {
      const formConditionValue = this.formCondition.getFieldsValue()
      const formContentValue = this.formContent.getFieldsValue()
      const params = {
        configIds: configSerialize(formContentValue.directiveTypes),
        electronicFenceIds: configSerialize(formContentValue.geoFenceConfig),
        strategyType: formConditionValue.strategyType,
        strategyName: formConditionValue.strategyName,
        controlZone: formConditionValue.controlArea,
        generatedSource: 1,
        startEndTime: timeRangeSerialize(formConditionValue.timeRange)
      }
      if (params.strategyType === 1) {
        params.startDate = formConditionValue.dateRange[0].format('YYYY-MM-DD')
        params.endDate = formConditionValue.dateRange[1].format('YYYY-MM-DD')
      }
      params.id = this.editId
      console.log(params)
      // return new Promise((resolve, reject) => {
      //   this.$post('/business/cmd-strategy/addStrategyByModify', params).then(r => {
      //     resolve(r.data.data)
      //   })
      // })
    },
    // 策略下发
    pushStrategy(newEditId) {
      const params = {
        strategyId: newEditId,
        uids: configSerialize(this.selectUserId)
      }
      console.log(params)
      return new Promise((resolve, reject) => {
        this.$post('/business/cmd-strategy/pushStrategyByManager', params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
      })
    },
    // 获取指令列表
    getDirectiveOpt() {
      return new Promise((resolve, reject) => {
        this.$get('/business/command-config/getCmdTypeList')
          .then(res => {
            if (res.data.state === 1) {
              const list = res.data.data
              const directivesOpt = list.map(item => {
                return {
                  value: item.id,
                  label: item.typeName
                }
              })
              resolve(directivesOpt)
            } else {
              reject('获取数据失败')
            }
          })
      })
    },
    // 获取各指令配置项
    getDirectiveConfig(typeIds) {
      return new Promise((resolve, reject) => {
        this.$get('/business/command-config/getConfigListByTypeId', {
          typeIds
        })
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.rows)
            } else {
              reject('获取数据失败')
            }
          })
      })
    },
    // 指令选择变动时
    onDirectiveTypesChange(val) {
      if (val.find(item => item === 12)) {
        // 电子围栏配置
        this.isGeoFenceSelector = true
      } else {
        this.isGeoFenceSelector = false
      }
      // if (val.find(item => item === 4)) {
      //   this.isExtractImgs = true
      // } else {
      //   this.isExtractImgs = false
      // }
    },
    // 弹出人员选择器
    opUserPicker() {
      this.userPickerPopVisible = true
    },
    // 策略类型变动时
    onStrategyTypeChange(val) {
      if (val === 0) {
        this.dateRangeDisable = true
      } else {
        this.dateRangeDisable = false
      }
    },
    // 用户选择成功
    userPickSuccess(remote_selectedUser) {
      this.selectUser = cloneDeep(remote_selectedUser)
      this.formPerson.setFieldsValue({ 'strategyBindPerson': `${this.selectUser.length}人` })
    },
    testClick() {
      setTimeout(() => {
        this.formValue.condition.strategyName = '123'
      }, 2000)
    },
    setTimeWrap(callback, time = 2000) {
      setTimeout(callback, 2000)
    }
  }
}
</script>

<style lang="less" scoped>
#dateRange {
  width: 100%
}
</style>
