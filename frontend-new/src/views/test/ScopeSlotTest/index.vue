<template>
  <div>
    <a-tabs v-model="activeKey" default-active-key="template" @change="callback">
      <a-tab-pane key="template" tab="template">
        <template-mode />
      </a-tab-pane>
      <a-tab-pane key="render" tab="render">
        <render-mode />
      </a-tab-pane>
      <a-tab-pane key="renderWithJsx" tab="renderWithJsx">
        <jsx-mode />
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
  components: { TemplateMode, RenderMode, JsxMode },
  props: {

  },
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
  data() {
    return {
      activeKey: 'template'
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    callback(key) {
      console.log(key)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
