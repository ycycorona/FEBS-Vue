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
                                 { required: true, message: '策略名称不能为空'}
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
                :disabled="readOnly || isEditPage"
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
                :options="fencesOpt"
              >

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
        <template v-if="directiveConfigList"></template>
        <a-row v-for="(configKey, index) in showCommonDirConfigSelector" :key="configKey" :gutter="24">
          <a-col :span="22">
            <a-form-item :label="`${directiveConfigList[configKey].title}配置`" v-bind="bigLabelFormItemLayout">
              <a-select
                v-decorator="[`config[${configKey}]`,{
                  rules: [
                    { required: true, message: '不能为空'}
                  ],
                  initialValue: formValue.content.commonConfig[configKey] ||
                    [directiveConfigList[configKey].opts[0].value] ||
                    []}]"
                :disabled="readOnly || directiveConfigList[configKey].configIsFixed===1"
                placeholder="请选择"
                :mode=" directiveConfigList[configKey].isMulti ? 'multiple' : 'default'"
                :options="directiveConfigList[configKey].opts"
              >
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
        <!-- <a-button @click="testForm">表单值</a-button> -->
      </div>
    </template>
    <user-picker-pop
      :read-only="readOnly"
      model-title="已选择人员"
      :value="selectUserId"
      :visible.sync="userPickerPopVisible"
      @success="userPickSuccess"
    ></user-picker-pop>
  </a-drawer>

</template>

<script>
const multiConfigDirs = [12]
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
const bigLabelFormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
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
      geoFenceConfig: [],
      commonConfig: []
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
      console,
      formValue: formValueFormater(),
      moment,
      isLoading: false,
      formCondition: this.$form.createForm(this),
      formContent: this.$form.createForm(this),
      formPerson: this.$form.createForm(this),
      selectUser: [], // 选中的人
      selectUserId: [], // 选中的人的id
      formItemLayout,
      bigLabelFormItemLayout,
      dateRangeDisable: true, // 长期策略不需要选日期范围
      isGeoFenceSelector: false,
      isExtractImgs: false,
      userPickerPopVisible: false,
      rawStrategyDetail: null, // 来自服务端的策略详情
      directivesOpt: [],
      fencesOpt: [],
      bannedOutFencesOpt: [],
      bannedInFencesOpt: [],
      directiveConfigList: [],
      showCommonDirConfigSelector: [] // 当前正在选择的 单选的指令选项

    }
  },
  computed: {
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
                directiveTypes: rawStrategyDetail.cmdTypeAndConfig.map(item => item.id),
                commonConfig: [],
                geoFenceConfig: configDeserialize(rawStrategyDetail.electronicFenceIds)
              },
              personNum: rawStrategyDetail.userCount
            }
            rawStrategyDetail.cmdTypeAndConfig.forEach(item => {
              this.formValue.content.commonConfig[item.id] = item.configList[0].id
            })
            // 有电子围栏的时候
            if (rawStrategyDetail.electronicFence.length > 0) {
              this.formValue.content.directiveTypes.push(12)
              this.formValue.content.commonConfig[12] = rawStrategyDetail.electronicFence.map(item => item.id)
            }
            // 临时策略时
            if (rawStrategyDetail.strategyType === 1) {
              this.formValue.condition.dateRange =
                [moment(rawStrategyDetail.startDate), moment(rawStrategyDetail.endDate)]
            }
            this.selectUserId = JSON.parse(rawStrategyDetail.userIds)
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
    this.fencesOpt = await this.getFenceOpt()
    this.directivesOpt = await this.getDirectiveOpt()
    const directiveConfigRaw = await this.getDirectiveConfig(
      this.directivesOpt.filter(item => multiConfigDirs.indexOf(item.value) === -1).map(item => item.value).join(',')
    )
    const directiveConfigList = []
    directiveConfigRaw.forEach(item => {
      directiveConfigList[item.id] = {
        opts: item.configList.map(item => {
          return { value: item.id, label: item.configName }
        }),
        configIsFixed: item.configIsFixed,
        isMulti: false,
        title: item.typeName }
    })
    directiveConfigList[12] = {
      opts: this.fencesOpt,
      configIsFixed: 0,
      isMulti: true,
      title: '电子围栏'
    }
    this.directiveConfigList = directiveConfigList
  },
  methods: {
    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },
    resetPopParams() {
      this.$emit('update:visible', false)
      this.$emit('update:editId', '')
      this.$emit('update:isEditPage', false)
    },
    onClose() {
      this.resetPopParams()
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
      await this.pushStrategy(newEditId)
      if (this.isCanSaveAndSend) {
        this.$message.info('策略保存并下发成功')
      } else {
        this.$message.info('策略暂存成功')
      }

      this.resetPopParams()
      this.$emit('success')
    },
    // 新建策略
    createStrategy() {
      const formConditionValue = this.formCondition.getFieldsValue()
      const formContentValue = this.formContent.getFieldsValue()
      // console.log(formConditionValue, formContentValue)
      const params = {
        configIds: configSerialize(formContentValue.config.reduce((res, value, index) => {
          if (index === 12) {
            return res
          } else {
            return res + ',' + value
          }
        })),
        electronicFenceIds: configSerialize(formContentValue.config[12]),
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
        configIds: formContentValue.config.reduce((res, value, index) => {
          if (index === 12) {
            return res
          } else {
            return res + ',' + value
          }
        }),
        electronicFenceIds: configSerialize(formContentValue.config[12]),
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
      // console.log(params)
      // return Promise.reject()
      return new Promise((resolve, reject) => {
        this.$post('/business/cmd-strategy/addStrategyByModify', params).then(r => {
          resolve(r.data.data)
        })
      })
    },
    // 策略下发
    pushStrategy(newEditId) {
      const params = {
        strategyId: newEditId,
        uids: configSerialize(this.selectUserId)
      }
      return new Promise((resolve, reject) => {
        this.$post('/business/cmd-strategy/pushStrategyByManager', params)
          .then(res => {
            resolve(res)
          })
      })
    },
    // 获取电子围栏选项
    getFenceOpt() {
      return new Promise((resolve, reject) => {
        this.$get('/business/electronic-fence/getElectronicFenceList')
          .then(res => {
            if (res.data.state === 1) {
              const list = res.data.data
              const fenceOpt = list.map(item => {
                return {
                  value: item.id,
                  label: item.fenceName
                }
              })
              const bannedOutFencesOpt = fenceOpt.filter(item => item.rule === 1)
              const bannedInFencesOpt = fenceOpt.filter(item => item.rule === 0)
              this.bannedOutFencesOpt = bannedOutFencesOpt
              this.bannedInFencesOpt = bannedInFencesOpt
              resolve(fenceOpt)
            } else {
              reject('获取数据失败')
            }
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
              // 提出固定配置的指令配置选项
              resolve(res.data.rows/* .filter(item => item.configIsFixed === 0) */)
            } else {
              reject('获取数据失败')
            }
          })
      })
    },
    // 指令选择变动时
    onDirectiveTypesChange(val) {
      // 正常需要选项的指令
      const commonDir = val.filter(item => {
        // console.log(Object.keys(this.directiveConfigList))
        // console.log(item)
        return true
        /* return multiConfigDirs.indexOf(item) === -1  &&
        Object.keys(this.directiveConfigList).findIndex(key => Number(key) === item) !== -1 */
      })
      this.showCommonDirConfigSelector = commonDir
      // console.log(commonDir)
      commonDir.forEach(item => {

      })

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
      this.selectUserId = this.selectUser.map(item => item.db_id)
      this.formPerson.setFieldsValue({ 'strategyBindPerson': `${this.selectUser.length}人` })
    },
    testForm() {
      const val = this.formContent.getFieldsValue()
      console.log(val)
      console.log(val.config.reduce((res, value, index) => {
        if (index === 12) {
          return res
        } else {
          return res + ',' + value
        }
      }))
    }
  }
}
</script>

<style lang="less" scoped>
#dateRange {
  width: 100%
}
</style>
