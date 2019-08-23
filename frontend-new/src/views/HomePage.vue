<template>
  <div :class="[multipage === true ? 'multi-page':'single-page', 'not-menu-page', 'home-page']">
    <!-- <a-row :gutter="8" class="head-info">
      <a-card class="head-info-card">
        <a-col :span="12">
          <div class="head-info-avatar">
            <img alt="头像" :src="avatar">
          </div>
          <div class="head-info-count">
            <div class="head-info-welcome">
              {{ welcomeMessage }}
            </div>
            <div class="head-info-desc">
              <p>{{ user.deptName ? user.deptName : '暂无部门' }} | {{ user.roleName ? user.roleName : '暂无角色' }}</p>
            </div>
            <div class="head-info-time">上次登录时间：{{ user.lastLoginTime ? user.lastLoginTime : '第一次访问系统' }}</div>
          </div>
        </a-col>
        <a-col :span="12">
          <div>
            <a-row class="more-info">
              <a-col :span="4" />
              <a-col :span="4" />
              <a-col :span="4" />
              <a-col :span="4">
                <head-info title="今日IP" :content="todayIp" :center="false" :bordered="false" />
              </a-col>
              <a-col :span="4">
                <head-info title="今日访问" :content="todayVisitCount" :center="false" :bordered="false" />
              </a-col>
              <a-col :span="4">
                <head-info title="总访问量" :content="totalVisitCount" :center="false" />
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-card>
    </a-row>
    <a-row :gutter="8" class="count-info">
      <a-col :span="12" class="visit-count-wrapper">
        <a-card class="visit-count">
          <apexchart ref="count" type="bar" height="300" :options="chartOptions" :series="series" />
        </a-card>
      </a-col>
      <a-col :span="12" class="project-wrapper">
        <a-card title="进行中的项目" class="project-card">
          <a slot="extra" href="https://github.com/wuyouzhuguli?tab=repositories" target="_blank">所有项目</a>
          <table>
            <tr>
              <td>
                <div class="project-avatar-wrapper">
                  <a-avatar class="project-avatar">{{ projects[0].avatar }}</a-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[0].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[0].des }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="project-avatar-wrapper">
                  <a-avatar class="project-avatar">{{ projects[1].avatar }}</a-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[1].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[1].des }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="project-avatar-wrapper">
                  <a-avatar class="project-avatar">{{ projects[2].avatar }}</a-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[2].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[2].des }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="project-avatar-wrapper">
                  <a-avatar class="project-avatar">{{ projects[3].avatar }}</a-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[3].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[3].des }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="project-avatar-wrapper">
                  <a-avatar class="project-avatar">{{ projects[4].avatar }}</a-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[4].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[4].des }}</p>
                  </div>
                </div>
              </td>
              <td />
            </tr>
          </table>
        </a-card>
      </a-col>
    </a-row> -->
    <a-row :gutter="24">
      <a-col :span="19">
        <div class="head-status-wrap home-card-wrap">
          <div>
            <span>管控人数</span>
          </div>
          <div>
            <span>设备总数</span>
          </div>
          <div>
            <span>在线设备</span>
          </div>
          <div>
            <span>离线设备</span>
          </div>
          <div>
            <span>未处理报警</span>
          </div>
        </div>
        <div class="home-card-wrap home-map-wrap">
          <div class="map-render-area">
            map
          </div>
        </div>
      </a-col>
      <a-col :span="5">
        <a-card title="审计分析" :bordered="false" style="width: 100%;height: 500px;">
          <a slot="extra" href="#">更多>></a>
          <div class="alarm-list-wrap">

          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top: 24px">
      <a-col :span="24">
        <a-card title="审计分析" :bordered="false" style="width: 100%">
          <a slot="extra" href="#">更多>></a>
          <p>Card content</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'HomePage',

  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      multipage: state => state.setting.multipage,
      user: state => state.account.user
    }),
    avatar() {
      return `/static/avatar/${this.user.avatar}`
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="less">
  .home-page {
    background: transparent;
    padding: 0;
    border: none;
    .home-card-wrap {
      background: #fff;
      padding: 16px 32px;
      height: 100px;
    }
    .head-status-wrap {

      display: flex;
      &>div{
        flex: 1 0 auto
      }
    }
    .home-map-wrap {
      height: 376px;
      margin-top: 24px
    }
    .alarm-list-wrap {

    }
  }
</style>
