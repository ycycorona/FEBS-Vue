<template>
  <div class="tab-title-wrap" style="">
    <span>{{ title }}</span>
  </div>
</template>
<script>
export default {
  name: 'TabTitle',
  props: {
    title: {
      required: true,
      type: String
    }
  },
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.tab-title-wrap {
  background-color:#F5F7FA;
  padding:5px 10px;
  margin-bottom: 16px
}
</style>
