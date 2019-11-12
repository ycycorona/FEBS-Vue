export default {
  namespaced: true,
  state: {
    windowInnerHeight: window.innerHeight,
    windowInnerWidth: window.innerWidth,
    gbSpinning: false
  },
  mutations: {
    setWindowInnerHeight(state, val) {
      state.windowInnerHeight = val
    },
    setWindowInnerWidth(state, val) {
      state.windowInnerWidth = val
    },
    setGbSpinning(state, val) {
      state.gbSpinning = val
    }
  }
}
