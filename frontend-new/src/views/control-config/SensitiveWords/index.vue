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
                            ]}]"
              class="text-area"
              placeholder="请输入"
              :rows="15"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
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
      formItemLayout,
      loading: false
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {

  },
  methods: {
    async handleSubmit() {
      let validateFlag = true
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          validateFlag = false
        }
        console.log(fieldsValue)
      })
      if (!validateFlag) { return }

      this.loading = true

      await new Promise((r) => {
        setTimeout(() => {
          this.$message.success('敏感词保存成功')
          r()
        }, 2000)
      })
      this.loading = false
      this.$emit('success')
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
