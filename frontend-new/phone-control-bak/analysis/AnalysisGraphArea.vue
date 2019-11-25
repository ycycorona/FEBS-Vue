<template>
  <a-row :gutter="48" class="analysis-graph-card-wrap">
    <a-col :span="12" :xl="8" style="height: 230px" class="analysis-graph-card">
      <apexchart class="sensitive-word-graph" type="bar" height="100%" :options="columnChartOptions" :series="columnSeries" />
    </a-col>
    <a-col :span="12" :xl="8" class="analysis-graph-card">
      <div class="graph-title">敏感网站拦截次数TOP5</div>
      <div class="record-row-wrap">
        <div v-for="(item, index) in sensitiveSiteRecords" :key="index" class="record-row">
          <span>{{ index+1 }}. {{ item.name }}</span>
          <span class="float-right">
            <a-tag color="#f50" style="width:50px;text-align:center">{{ item.times }}</a-tag>
          </span>
        </div>
      </div>
    </a-col>
    <a-col :span="12" :xl="8" class="analysis-graph-card">
      <div class="graph-title">违规应用拦截次数TOP5</div>
      <div class="record-row-wrap">
        <div v-for="(item, index) in blockApp" :key="index" class="record-row">
          <span>{{ index+1 }}. <a-icon type="android" />{{ item.name }}</span>
          <span class="float-right">
            <a-tag color="#f50" style="width:50px;text-align:center">{{ item.times }}</a-tag>
          </span>
        </div>
      </div>
    </a-col>
    <a-col :span="12" :xl="8" class="analysis-graph-card">
      <apexchart class="expense-ratio-graph" type="donut" height="230" :options="pieOptions" :series="pieSeries" />
    </a-col>
    <a-col :span="12" :xl="8" class="analysis-graph-card">
      <div class="graph-title">网站浏览率TOP5</div>
      <div class="record-row-wrap">
        <div v-for="(item, index) in blockApp" :key="index" class="record-row">
          <span>{{ index+1 }}. <a-icon type="android" />{{ item.name }}</span>
          <span class="float-right">
            <a-tag color="#2db7f5" style="width:50px;text-align:center">{{ item.times }}</a-tag>
          </span>
        </div>
      </div>
    </a-col>
    <a-col :span="12" :xl="8" class="analysis-graph-card">
      <div class="graph-title">应用使用频率TOP5</div>
      <div class="record-row-wrap">
        <div v-for="(item, index) in blockApp" :key="index" class="record-row">
          <span>{{ index+1 }}. <a-icon type="android" />{{ item.name }}</span>
          <span class="float-right">
            <a-tag color="#2db7f5" style="width:50px;text-align:center">{{ item.times }}</a-tag>
          </span>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
const sensitiveSiteRecords = [
  {
    name: 'https://huaban.com/',
    times: 200
  },
  {
    name: 'https://baidu.com/',
    times: 100
  },
  {
    name: 'https://zcool.com.cn/',
    times: 50
  },
  {
    name: 'https://588ku.com/',
    times: 30
  },
  {
    name: 'https://google.com/',
    times: 8
  }
]
const blockApp = [
  {
    name: '抖音',
    times: 200
  },
  {
    name: '饿了么',
    times: 100
  },
  {
    name: '高德地图',
    times: 50
  },
  {
    name: '花瓣',
    times: 30
  },
  {
    name: '飞猪',
    times: 8
  }
]
import { series as columnSeries, chartOptions as columnChartOptions } from './graphConfig/columns'
import { options as pieOptions, series as pieSeries } from './graphConfig/pie'
export default {
  name: 'AnalysisGraphArea',
  components: { },
  props: {
    example: {
      default: false,
      type: Boolean
    }

  },
  data() {
    return {
      pieOptions,
      pieSeries,
      sensitiveSiteRecords,
      blockApp,
      columnSeries,
      columnChartOptions
    }
  },
  computed: {

  },
  watch: {

  },
  beforeCreate() {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
@import (reference) "~@/utils/utils.less";
.float-right {
  float: right;

}
.graph-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  height: 30px;
}
.record-row {
  font-size: 16px;
  .clearfix()
}
.record-row-wrap {
  display: flex;
  flex-direction: column;
  justify-content:  space-between;
  height: 200px;
}
.sensitive-word-graph, .expense-ratio-graph  {
  /deep/ .apexcharts-title-text {
    font-weight: 700
  }
}
.analysis-graph-card {
  margin-bottom: 40px;
}
.analysis-graph-card-wrap {
  margin-top: 20px
}

</style>
