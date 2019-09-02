<template>
  <a-drawer
    destroy-on-close
    class="create-edit-pop"
    :title="isEdit ? '编辑' : '新建'"
    :mask-closable="false"
    width="650"
    placement="right"
    :closable="false"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
    @close="onClose"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="名称" v-bind="formItemLayout">
              <a-input
                v-decorator="['configName',
                              {rules: [
                                 { required: true, message: '名称不能为空'}
                               ],
                               initialValue: formValues.configName}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="提取周期" v-bind="formItemLayout" style="margin-bottom:0!important;font-weight:700">

            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="提取单位" v-bind="formItemLayout">
              <a-select
                v-decorator="['executeTimeType', {
                  rules: [
                    { required: true, message: '提取单位不能为空'}
                  ],
                  initialValue: formValues.executeTimeType
                }]"
                placeholder=""
                @change="executeTimeTypeChange"
              >
                <a-select-option :value="1">周</a-select-option>
                <a-select-option :value="2">月</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="间隔" v-bind="formItemLayout">
              <a-select
                v-decorator="['intervalPeriod', {
                  rules: [
                    { required: true, message: '间隔不能为空'}
                  ],
                  initialValue: formValues.intervalPeriod
                }]"
                placeholder=""
              >
                <span slot="suffixIcon" class="color-unit">{{ currentTimeType===1 ? '个周' : '个月' }}</span>
                <a-select-option v-for="n in 12" :key="n" :value="n-1">{{ n }}</a-select-option>
              </a-select>
            </a-form-item>

          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="日期" v-bind="formItemLayout">
              <a-select
                v-decorator="['executeDaytime', {
                  rules: [
                    { required: true, message: '日期不能为空'}
                  ],
                  initialValue: formValues.executeDaytime
                }]"
                :options="currentDayTimeOpt"
                placeholder=""
              >

              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="文件日期范围" v-bind="formItemLayout">
              <a-select
                v-decorator="['fileExtractScope', {
                  rules: [
                    { required: true, message: '文件日期范围不能为空'}
                  ],
                  initialValue: formValues.fileExtractScope
                }]"
                :options="fileExtractScopeOpt"
                placeholder=""
              >

              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="22">
            <a-form-item label="提取内容" v-bind="formItemLayout">
              <a-select
                v-decorator="['contentValue', {
                  rules: [
                    { required: true, message: '提取内容不能为空'}
                  ],
                  initialValue: formValues.contentValue
                }]"
                mode="multiple"
                :options="contentValueOpt"
                placeholder=""
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="onClose">
        <a-button :loading="loading" style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { WeekOpt, MonthOpt, fileExtractScopeOpt } from '@/utils/params'
import { configSerialize, configDeserialize } from '@/utils/common'
// 对应item的字段
function formValueFormater() {
  return {
    configName: '',
    executeTimeType: 1, // 月还是周
    executeDaytime: 1, // 哪一天执行
    intervalPeriod: 0, // 间隔 0表示每周/月
    contentValue: [],
    fileExtractScope: 7
  }
}

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const formItemLayouWithoutLabel = {
  wrapperCol: { span: 20, offset: 4 }
}

export default {
  name: 'MediaExtractCreateEditPop',
  components: { },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    editId: {
      default: '',
      type: [String, Number]
    },
    contentValueOpt: {
      type: Array

    }
  },
  data() {
    return {
      WeekOpt, MonthOpt, fileExtractScopeOpt,
      currentDayTimeOpt: WeekOpt,
      currentTimeType: 1,
      formValues: formValueFormater(),
      loading: false,
      formItemLayout,
      formItemLayouWithoutLabel,
      rawDetail: null
    }
  },
  computed: {

  },
  watch: {
    visible: {
      immediate: false,
      async handler(newVal) {
        if (newVal) {
          // 显示
          if (this.isEdit) {
            const rawDetail = this.rawDetail = await this.getDetail()
            if (rawDetail.executeTimeType === 1) {
              this.currentDayTimeOpt = WeekOpt
            } else {
              this.currentDayTimeOpt = MonthOpt
            }
            this.formValues.configName = rawDetail.configName
            this.formValues.contentValue = configDeserialize(rawDetail.contentValue)
            this.formValues.executeDaytime = Number(rawDetail.executeDaytime)
            this.formValues.executeTimeType = rawDetail.executeTimeType
            this.formValues.fileExtractScope = Number(rawDetail.fileExtractScope)
            this.formValues.intervalPeriod = rawDetail.intervalPeriod
          }
        } else {
        // 销毁

        }
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  async created() {

  },
  methods: {
    onClose() {
      this.reset()
      this.$emit('close')
    },
    reset() {
      this.currentDayTimeOpt = WeekOpt
      this.currentTimeType = 1
      this.rawDetail = null
      this.formValues = formValueFormater()
      this.form.resetFields()
      this.$emit('update:visible', false)
      this.$emit('update:isEdit', false)
      this.$emit('update:editId', '')
    },
    getDetail() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$get('/business/media-file-config/getDetailById', {
          configId: this.editId
        })
          .then(r => {
            if (r.data.state === 1) {
              resolve(r.data.data)
            } else {
              reject()
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    async handleSubmit() {
      if (!this.validateFields()) {
        return
      }
      const formValues = this.form.getFieldsValue()
      console.log(formValues)
      if (this.isEdit) {
        await this.editSave(this.editId, formValues)
      } else {
        await this.createSave(formValues)
      }
      this.reset()
      this.$emit('success')
    },
    createSave(formValues) {
      const params = {
        configName: formValues.configName,
        contentValue: configSerialize(formValues.contentValue),
        executeDaytime: formValues.executeDaytime,
        executeTimeType: formValues.executeTimeType,
        fileExtractScope: formValues.fileExtractScope,
        intervalPeriod: formValues.intervalPeriod
      }
      console.log(params)
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$post('/business/media-file-config/addMediaFileConfig', params).then(r => {
          this.$message.info('新增媒体文件提取配置成功')
          resolve(r.data.data)
        })
          .finally(() => {
            this.loading = false
          })
      })
    },
    editSave(id, formValues) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$post('/business/media-file-config/updateById', {
          id,
          configName: formValues.configName,
          contentValue: configSerialize(formValues.contentValue),
          executeDaytime: formValues.executeDaytime,
          executeTimeType: formValues.executeTimeType,
          fileExtractScope: formValues.fileExtractScope,
          intervalPeriod: formValues.intervalPeriod
        }).then(r => {
          this.$message.info('修改媒体文件提取配置成功')
          resolve(r.data.data)
        })
          .finally(() => {
            this.loading = false
          })
      })
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
    executeTimeTypeChange(val) {
      this.currentTimeType = val
      if (val === 1) {
        this.currentDayTimeOpt = WeekOpt
      } else {
        this.currentDayTimeOpt = MonthOpt
      }
      this.form.setFieldsValue({
        executeDaytime: 1,
        intervalPeriod: 0
      })
    }
  }
}
</script>

<style lang="less" scoped>
#dateRange {
  width: 100%
}
.for-item {
  position: relative;
}
.del-for-item {
  position: absolute;
  bottom: 0;
  right: 103px;
  transform: translateY(-33px);
}
.ant-divider-horizontal {
  margin: 12px 0;
}
.color-unit {
  color: rgba(0, 0, 0, 0.65);
  font-weight: 700
}
</style>
