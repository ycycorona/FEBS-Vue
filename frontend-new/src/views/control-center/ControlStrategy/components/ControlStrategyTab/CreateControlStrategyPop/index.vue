<template>
  <a-drawer
    destroy-on-close
    class="create-control-strategy-pop"
    :title="isEditPage ? '策略管理' : '新增管控策略'"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <tab-title title="策略生效条件"></tab-title>
    <a-form :form="formCondition">
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="策略名称" v-bind="formItemLayout">
            <a-input
              v-decorator="['strategyName',
                            {rules: [
                               { required: true, message: '策略名称不能为空'},
                               { max: 20, message: '长度不能超过20个字符'}
                             ],
                             initialValue: formValue.condition.strategyName}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="策略类型" v-bind="formItemLayout">
            <a-select
              v-decorator="['strategyType', {
                rules: [

                ],
                initialValue: formValue.condition.strategyType
              }]"
              placeholder="策略属性"
              @change="onStrategyTypeChange"
            >
              <a-select-option value="长期">长期</a-select-option>
              <a-select-option value="临时">临时</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="日期" v-bind="formItemLayout">
            <a-range-picker
              v-if="!dateRangeDisable"
              v-decorator="['dateRange',
                            {rules: [
                               { required: !dateRangeDisable, type: 'array', message: '日期不能为空'}
                             ],
                             initialValue: formValue.condition.dateRange}]"
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
                           initialValue: [['00:00', '23:59']]}]"
          ></multi-time-range-picker>
        </a-form-item>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="管控区域" v-bind="formItemLayout">
            <a-select
              v-decorator="['controlArea', {
                initialValue: formValue.condition.controlArea
              }]"
              allow-clear
              placeholder="根据策略需要是否填写本条件"
            >
              <a-select-option value="电子围栏1">电子围栏1</a-select-option>
              <a-select-option value="电子围栏2">电子围栏2</a-select-option>
              <a-select-option value="电子围栏3">电子围栏3</a-select-option>
              <a-select-option value="电子围栏4">电子围栏4</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <tab-title title="策略内容"></tab-title>
    <a-form :form="formContent">
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="指令类型" v-bind="formItemLayout">
            <a-select
              v-decorator="['directiveTypes',
                            {rules: [
                               { required: true, type: 'array', message: '指令类型不能为空'}
                             ],
                             initialValue: formValue.content.directiveTypes}]"
              placeholder="请选择指令类型"
              mode="multiple"
              @change="onDirectiveTypesChange"
            >
              <a-select-option value="应用黑名单">应用黑名单</a-select-option>
              <a-select-option value="电子围栏">电子围栏</a-select-option>
              <a-select-option value="禁用摄像头">禁用摄像头</a-select-option>
              <a-select-option value="图片提取">图片提取</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item v-if="isGeoFenceSelector" label="电子围栏" v-bind="formItemLayout">
            <a-select
              v-decorator="['geoFenceConfig',{
                rules: [
                  { required: true, type: 'array', message: '电子围栏不能为空'}
                ],
                initialValue: formValue.content.geoFenceConfig}]"
              placeholder="点击选择电子围栏"
            >
              <a-select-option value="电子围栏1">电子围栏1</a-select-option>
              <a-select-option value="电子围栏2">电子围栏2</a-select-option>
              <a-select-option value="电子围栏3">电子围栏3</a-select-option>
              <a-select-option value="电子围栏4">电子围栏4</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item v-if="isExtractImgs" label="图片提取配置" v-bind="formItemLayout">
            <a-select
              v-decorator="['extractImgsConfig', {rules: [
                { required: true, type: 'array', message: '不能为空'}
              ]}]"
              placeholder="点击选择图片提取配置"
            >
              <a-select-option value="配置1">配置1</a-select-option>
              <a-select-option value="配置2">配置2</a-select-option>
              <a-select-option value="配置3">配置3</a-select-option>
              <a-select-option value="配置4">配置4</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <tab-title title="策略管控人员"></tab-title>
    <a-form :form="formPerson">
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="管控人员" v-bind="formItemLayout">
            <a-input
              v-decorator="['strategyBindPerson',{
                initialValue: formValue.personNum}]"
              read-only
              @click="opUserPicker"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
        <a-button :loading="loading" style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button :disabled="!isCanSaveAndSend" type="primary" :loading="loading" style="margin-right: .8rem" @click="doSubmit">下发</a-button>
      <a-button :disabled="isCanSaveAndSend" type="primary" :loading="loading" class="green-btn" @click="doSubmit">暂存</a-button>
    </div>
    <user-picker-pop
      :value="selectUserId"
      :visible.sync="userPickerPopVisible"
      @success="userPickSuccess"
    ></user-picker-pop>
    <!-- <button @click="testClick">test</button> -->
  </a-drawer>
</template>

<script>

import cloneDeep from 'lodash/cloneDeep'
import moment from 'moment'
import TabTitle from '@/components/fragment/TabTitle'
import MultiTimeRangePicker from '@/components/MultiTimeRangePicker'
import UserPickerPop from '@/components/UserPickerPop'
import { setTimeout } from 'timers'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
// const formTailLayout = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 8, offset: 4 }
// }
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
      type: [Number, String]
    }
  },
  data() {
    return {
      formValue: {
        condition: {
          strategyName: '',
          strategyType: '长期',
          dateRange: [],
          controlArea: ''

        },
        content: {
          directiveTypes: [],
          geoFenceConfig: ''
        },
        personNum: '0人'
      },
      moment,
      loading: false,
      formCondition: this.$form.createForm(this),
      formContent: this.$form.createForm(this),
      formPerson: this.$form.createForm(this),
      selectUser: [],
      formItemLayout,
      dateRangeDisable: false,
      isGeoFenceSelector: false,
      isExtractImgs: false,
      userPickerPopVisible: false,
      isCanSaveAndSend: true // 是否可以保存并下发
    }
  },
  computed: {
    selectUserId() {
      return this.selectUser.map(item => item.id)
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
        // 显示
          // 如果是编辑页面
          if (this.isEditPage) {
            setTimeout(() => {
              this.formValue = {
                condition: {
                  strategyName: '策略测试',
                  strategyType: '短期',
                  dateRange: [moment('2019-05-01'), moment('2019-08-23')],
                  controlArea: '电子围栏3'

                },
                content: {
                  directiveTypes: ['电子围栏'],
                  geoFenceConfig: '电子围栏3'
                },
                personNum: '1300人'
              }
              this.onDirectiveTypesChange(this.formValue.content.directiveTypes)
            }, 2000)
          }
        } else {
        // 销毁

        }
      }
    }
  },
  created() {

  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    async handleSaveAndSend() {
      let validateFlag = true
      this.formCondition.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
        console.log(fieldsValue)
      })
      this.formContent.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
        console.log(fieldsValue)
      })
      if (!validateFlag) { return }

      this.loading = true

      // await new Promise((r) => {
      //   setTimeout(() => {
      //     this.$message.success('新增菜单成功')
      //     r()
      //   }, 2000)
      // })
      this.loading = false
      // this.$emit('success')
    },
    doSubmit() {
      this.createStrategy()
    },
    createStrategy() {
      this.$post('/business/cmd-strategy/createStrategy', {
        configIds: '1,2,3',
        electronicFenceIds: '1',
        strategyType: 0,
        strategyName: '测试' + Math.round(Math.random() * 100),
        controlZone: 1,
        generatedSource: 1

      }).then(r => {
        console.log(r.data.data)
      })
    },
    getDbData() {
      const initData = {
        condition: {
          strategyName: '策略一',
          strategyType: '长期'
        }
      }
      this.setTimeWrap(() => {
        this.formValue = initData
      })
    },
    onDirectiveTypesChange(val) {
      if (val.find(item => item === '电子围栏')) {
        this.isGeoFenceSelector = true
      } else {
        this.isGeoFenceSelector = false
      }
      if (val.find(item => item === '图片提取')) {
        this.isExtractImgs = true
      } else {
        this.isExtractImgs = false
      }
    },
    // 弹出人员选择器
    opUserPicker() {
      this.userPickerPopVisible = true
    },
    onStrategyTypeChange(val) {
      console.log(val)
      if (val === '长期') {
        this.dateRangeDisable = false
      } else {
        this.dateRangeDisable = true
      }
    },
    userPickSuccess(remote_selectedUser) {
      this.selectUser = cloneDeep(remote_selectedUser)
      this.formPerson.setFieldsValue({ 'strategyBindPerson': `${this.selectUser.length}人` })
      console.log(this.selectUser)
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
