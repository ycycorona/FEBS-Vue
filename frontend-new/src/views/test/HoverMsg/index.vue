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
  </div>
</template>

<script>

export default {
  name: 'HoverMsg',
  components: { },
  props: {},
  data() {
    return {
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
  watch: {},
  created() {

  },
  mounted() {
    window.addEventListener('resize', function(e) {
      console.log(e)
    })
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    event.eventType = 'message'
    window.dispatchEvent(event)
  },
  methods: {
    handleTableChange() {

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
