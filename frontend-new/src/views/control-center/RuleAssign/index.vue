<!--<template>
  <div>
    <Sub>
      <template slot-scope="props" slot="default">{{props.text}}</template>
    </Sub>
  </div>
</template>-->

<script>
import Sub from './sub'
export default {
  name: 'RuleAssign',
  props: {

  },
  components: {Sub},
  render (h) {
    return h('Sub', {
      scopedSlots: {
        default (obj) {
          return h('div', `${obj.text}`)
        }
      }
    })
    // return (
    //   <Sub>
    //     <template scopedSlots={} slot="default">{ props.text }</template>
    //   </Sub>
    // )
  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
