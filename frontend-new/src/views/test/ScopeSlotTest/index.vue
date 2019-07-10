<template>
  <div>
    <a-tabs defaultActiveKey="template" @change="callback" v-model="activeKey">
      <a-tab-pane tab="template" key="template">
        <template-mode></template-mode>
      </a-tab-pane>
      <a-tab-pane tab="render" key="render">
        <render-mode></render-mode>
      </a-tab-pane>
      <a-tab-pane tab="renderWithJsx" key="renderWithJsx">
        <jsx-mode></jsx-mode>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import TemplateMode from './TemplateMode'
import RenderMode from './RenderMode'
import JsxMode from './JsxMode'
export default {
  name: 'ScopedSlotTest',
  props: {

  },
  components: {TemplateMode, RenderMode, JsxMode},
  // render (h) {
  //   return h('Sub', {
  //     scopedSlots: {
  //       default (obj) {
  //         return h('div', `${obj.text}`)
  //       }
  //     }
  //   })
  //   return (
  //     <Sub>
  //       <template scopedSlots={} slot="default">{ props.text }</template>
  //     </Sub>
  //   )
  // },
  data () {
    return {
      activeKey: 'template'
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    callback (key) {
      console.log(key)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
