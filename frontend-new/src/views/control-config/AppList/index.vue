<template>
  <div class="full-width">
    <a-tabs default-active-key="appBlackList" class="full-width-tab" @change="onTabChange">
      <a-tab-pane key="appBlackList" tab="应用黑名单">
        <app-black-list></app-black-list>
      </a-tab-pane>
      <a-tab-pane key="appWhiteList" tab="应用白名单">
        <app-white-list></app-white-list>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import AppBlackList from './components/AppBlackList/AppBlackList'
import AppWhiteList from './components/AppWhiteList/AppWhiteList'
export default {
  name: 'AppListWrap',
  components: { AppBlackList, AppWhiteList },
  props: {

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
    onTabChange() {

    }

  }
}
</script>

<style lang="less" scoped>

</style>
