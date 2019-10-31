<template>
  <div class="select-range-time">
    <a-row :gutter="0">
      <a-col :span="11" style="text-align:center">
        <a-time-picker
          :disabled="disabled"
          style="width:100%"
          :disabled-hours="getDisabledStartHours"
          :disabled-minutes="getDisabledStartMinutes"
          :disabled-seconds="getDisabledStartSeconds"
          :default-value="moment(startTime, format)"
          :format="format"
          @change="(val,dateStrings)=>changeTime(val,dateStrings,'startTime')"
        />
      </a-col>
      <a-col :span="2" style="text-align:center;">{{ divide }}</a-col>
      <a-col :span="11" style="text-align:center">
        <a-time-picker
          :disabled="disabled"
          style="width:100%"
          :disabled-hours="getDisabledEndHours"
          :disabled-minutes="getDisabledEndMinutes"
          :disabled-seconds="getDisabledEndSeconds"
          :default-value="moment(endTime, format)"
          :format="format"
          @change="(val,dateStrings)=>changeTime(val,dateStrings,'endTime')"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TimeRangePicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    format: {
      type: String,
      default: 'HH:mm'
    },
    divide: {
      type: String,
      default: '至'
    },
    startTimeLimit: {
      type: String,
      default: '00:00:01'
    },
    value: {
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Array

    }
  },
  data() {
    return {
      startTime: this.value[0],
      endTime: this.value[1]
    }
  },
  created() {

  },
  methods: {
    moment,
    changeTime(val, dateStrings, type) {
      if (type === 'startTime') {
        this.startTime = dateStrings
      } else {
        this.endTime = dateStrings
      }
      this.$emit('change', [this.startTime, this.endTime])
    },
    getDisabledEndHours() {
      const hours = []
      const time = this.startTime
      const timeArr = time.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    getDisabledEndMinutes(selectedHour) {
      const time = this.startTime
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    getDisabledEndSeconds(selectedHour, selectedMinute) {
      const time = this.startTime
      const timeArr = time.split(':')
      const seconds = []
      if (selectedHour === parseInt(timeArr[0]) && selectedMinute === parseInt(timeArr[1])) {
        for (let i = 0; i < parseInt(timeArr[2]); i++) {
          seconds.push(i)
        }
      }
      return seconds
    },
    getDisabledStartHours() {
      const hours = []
      const time = this.startTimeLimit
      const timeArr = time.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    getDisabledStartMinutes(selectedHour) {
      const time = this.startTimeLimit
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    getDisabledStartSeconds(selectedHour, selectedMinute) {
      const time = this.startTimeLimit
      const timeArr = time.split(':')
      const seconds = []
      if (selectedHour === parseInt(timeArr[0]) && selectedMinute === parseInt(timeArr[1])) {
        for (let i = 0; i < parseInt(timeArr[2]); i++) {
          seconds.push(i)
        }
      }
      return seconds
    }
  }
}
</script>
