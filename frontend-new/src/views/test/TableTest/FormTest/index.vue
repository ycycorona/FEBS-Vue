<template>
  <div>
    <a-form :form="form">
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="Name"
      >
        <a-input
          v-decorator="[
            'username',
            {rules: [{ required: true, message: 'Please input your name' }]}
          ]"
          placeholder="name"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="password"
      >
        <a-input
          v-decorator="[
            'password',
            {rules: [{ required: true, message: 'Please input your password' }]}
          ]"
          type="password"
          placeholder="password"
        />
      </a-form-item>
      <a-form-item
        :wrapper-col="formTailLayout.wrapperCol"
      >
        <a-button
          type="primary"
          html-type="submit"
          @click="onSubmit"
        >
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
}
export default {
  name: 'FormTest',
  components: {},
  props: {},
  data() {
    return {
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this)
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  methods: {
    onSubmit() {
      // 获取表单数据
      console.log(this.form.getFieldsValue(['password']))
    }
  }
}
</script>

<style lang="less" scoped>

</style>
