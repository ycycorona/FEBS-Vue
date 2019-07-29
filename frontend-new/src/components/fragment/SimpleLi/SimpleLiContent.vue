<template>
  <div>
    <span class="bold padding-right">{{ title }}</span><span><slot name="default"></slot></span>
  </div>
</template>

<script>

export default {
  name: 'SimpleLiContent',
  components: { },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {

  },
  methods: {}
}
</script>

<style lang="less" scoped>

</style>
