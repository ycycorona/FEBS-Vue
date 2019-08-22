<template>
  <div class="sensitive-words-config full-width">
    <div class="add-btn-wrap">
      <span class="left-text">敏感词配置</span>
    </div>
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="18">
          <a-form-item label="" v-bind="formItemLayout">
            <a-alert
              style="margin:10px 0"
              message="请输入敏感词，敏感词之间用“中文”分号隔开"
              type="info"
              show-icon
            />
            <a-textarea
              v-decorator="['sensitiveWordsInput',
                            {rules: [
                               { required: true, message: '敏感词不能为空'}
                             ],
                             initialValue: initSensitiveWords}]"
              class="text-area"
              placeholder="请输入"
              :rows="15"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-popconfirm title="确定保存？" ok-text="确定" cancel-text="取消" @confirm="handleSubmit">
        <a-button type="primary" :loading="loading">提交</a-button>
      </a-popconfirm>
    </a-form>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
export default {
  name: 'ElectricFenceList',
  components: { },
  props: {},
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout,
      loading: false,
      initSensitiveWords: ''
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.fetch()
  },
  methods: {
    async handleSubmit() {
      let validateFlag = true
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
      })
      if (!validateFlag) { return }

      this.loading = true
      const words = this.form.getFieldValue('sensitiveWordsInput')
      await this.save(words)
      await this.fetch()
    },
    save(words) {
      return new Promise((resolve, reject) => {
        this.$post('/business/sensitive-words/addSensitiveWords', {
          words
        }).then(r => {
          this.$message.info('保存敏感词成功')
          resolve(r.data.data)
        })
          .finally(() => {
            this.loading = false
          })
      })
    },
    fetch() {
      // 显示loading
      this.loading = true
      this.$post('/business/sensitive-words/getAllSensitiveWords').then((r) => {
        const data = r.data
        if (data.state === 1) {
          this.initSensitiveWords = data.data
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/utils/utils.less";
.add-btn-wrap {
  .clearfix();
  .left-text{
    float: left;
    color: #4E4E4E;
    font-size: 18px;
    font-weight: 700
  }
  .right-btn{
    float: right;
  }
  margin-bottom: 5px
}
.text-area {
  background-color: #EEEEEE;
}
</style>
