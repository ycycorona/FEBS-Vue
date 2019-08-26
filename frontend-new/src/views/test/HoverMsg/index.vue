<template>
  <div class="hover-msg">
    <a-popover title="受控设备" trigger="click" class="hover-msg-test-pop" overlay-class-name="blue-title-popover">
      <template slot="content">
        <a-table
          size="small"
          :row-key="record => record.id"
          :columns="columns"
          :scroll="{x: 400}"
          :data-source="dataSource"
          :pagination="false"
          @change="handleTableChange"
        >

        </a-table>
      </template>
      <p slot="default" class="hover-test">hoverTest</p>
    </a-popover>
    <a-form>
      <MultiTimeRangePicker v-model="ranges">

      </MultiTimeRangePicker>
    </a-form>
    <div style="width:100px;height:200px">
      <a-spin :spinning="true"></a-spin>
    </div>
    <!-- <input v-model="arrTest[0]" type="text"> -->
  </div>
</template>

<script>
import MultiTimeRangePicker from '@/components/MultiTimeRangePicker'
export default {
  name: 'HoverMsg',
  components: { MultiTimeRangePicker },
  props: {},
  data() {
    return {
      arrTest: ['123'],
      ranges: [['00:01', '23:57']],
      columns: [
        {
          title: '设备名称',
          dataIndex: 'name'
        },
        {
          title: '型号',
          dataIndex: 'type'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '状态',
          dataIndex: 'status'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      dataSource: [
        {
          id: 0,
          name: 'HUAWEIP20',
          type: 'EML-AL00',
          version: '1.0.0',
          status: '在线'
        }
      ]
    }
  },
  computed: {},
  watch: {
    arrTest(val) {
      console.log(val)
    }
  },
  created() {
  },
  mounted() {
    window.addEventListener('resize', function(e) {

    })
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    event.eventType = 'message'
    window.dispatchEvent(event)
  },
  methods: {
    handleTableChange() {

    },
    onClick() {
      this.arrTest[0] = new Date().valueOf()
      // Vue.set(this.arrTest, 0, new Date().valueOf())
      // console.log(this.arrTest)
    }
  }
}
</script>

<style lang="less" scoped>
.hover-test{
  cursor: pointer;
  &:hover {
    color: chartreuse
  }
}

</style>

<style lang="less">
// .blue-title-popover {
//   .ant-popover-content .ant-popover-arrow {
//     background-color: #349EF6;
//     border-color: #349EF6;
//     // border-left-color: #349EF6;
//   }
//   .ant-popover-inner .ant-popover-title {
//     background-color: #349EF6;
//     color: #fff
//   }
// }

</style>
