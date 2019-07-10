<template>
  <child-com msg="template">
    <span slot-scope="props">
      {{props.text}}
    </span>
  </child-com>
</template>

<script>
import ChildCom from './ChildCom'
export default {
  name: 'TemplateMode',
  props: {

  },
  components: {ChildCom},
  data () {
    return {
      activeKey: null
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    callback (key) {
      console.log(key)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
