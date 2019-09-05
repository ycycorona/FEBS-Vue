export default {
  namespaced: true,
  state: {
    windowInnerHeight: window.innerHeight,
    windowInnerWidth: window.innerWidth
  },
  mutations: {
    setWindowInnerHeight(state, val) {
      state.windowInnerHeight = val
    },
    setWindowInnerWidth(state, val) {
      state.windowInnerWidth = val
    }
  }
}
