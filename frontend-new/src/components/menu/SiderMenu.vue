<template>
  <a-layout-sider
    v-model="collapsed"
    :class="[theme, 'sider', isMobile ? null : 'shadow', fixSiderbar? 'ant-fixed-sidemenu' : null]"
    width="256px"
    :collapsible="collapsible"
    :trigger="null"
  >
    <div :class="['logo', 'theme', {'collapsed': collapsed}]">
      <router-link to="/" class="router-link-wrap">
        <div style="line-height: 60px;">
          <img src="@/assets/imgs/logo.png" style="width: 42px;">
        </div>
        <div :class="{'collapsed': collapsed}" style="padding: 3px 0 0 10px">
          <h1>智慧照明管理平台</h1>
          <!-- <h1>手机管控系统</h1> -->
        </div>

      </router-link>
    </div>
    <i-menu :theme="theme" :collapsed="collapsed" :menu-data="menuData" class="menu" @select="onSelect" />
  </a-layout-sider>
</template>

<script>
import IMenu from './menu'
import { mapState } from 'vuex'

export default {
  name: 'SiderMenu',
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.setting.isMobile,
      systemName: state => state.setting.systemName,
      fixSiderbar: state => state.setting.fixSiderbar
    })
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
  .router-link-wrap {
    display: flex
  }
  .router-link-wrap  .collapsed {
    display: none
  }
  .menu {
    padding-top: 20px
  }
  .shadow {
    box-shadow: 1px 0 6px rgba(0, 21, 41, .35);
  }
  .sider {
    z-index: 16;
    position: relative;
    overflow-x: hidden;
    &.light {
      background-color: #fff;
    }
    &.dark {
      background-color: #393e46;
    }
    &.ant-fixed-sidemenu {
      position: fixed;
      overflow-y: auto;
      height: 100%;
    }
    .logo.collapsed {
      padding-left: 24px !important;
    }
    .logo {
      height: 59px;
      position: relative;
      // line-height: 59px;
      padding-left: 35px;
      -webkit-transition: all .3s;
      transition: all .3s;
      overflow: hidden;
      &.light {
        background-color: #fff;
        border-bottom: 1px solid #f8f8f8;
      }
      &.dark {
        background-color: #393e46;
        h1 {
          color: #fff;
        }
      }
      h1 {
        font-size: 18px;
        line-height: 60px;
        padding: 0;
        margin: 0
      }
    }
  }
</style>
