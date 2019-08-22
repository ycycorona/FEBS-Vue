<template>
  <div class="full-width">
    <a-tabs default-active-key="websiteBlackList" class="full-width-tab" @change="onTabChange">
      <a-tab-pane key="websiteBlackList" tab="网站黑名单">
        <WebSiteBlackList></WebSiteBlackList>
      </a-tab-pane>
      <a-tab-pane key="websiteWhiteList" tab="网站白名单">
        <WebSiteWhiteList></WebSiteWhiteList>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import WebSiteBlackList from './components/WebSiteBlackList/WebSiteBlackList'
import WebSiteWhiteList from './components/WebSiteWhiteList/WebSiteWhiteList'
export default {
  name: 'AppListWrap',
  components: { WebSiteBlackList, WebSiteWhiteList },
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
