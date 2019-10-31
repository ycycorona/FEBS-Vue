export default {
  namespaced: true,
  state: {
    currentPopContent: null
  },
  mutations: {
    setCurrentPopContent(state, val) {
      state.currentPopContent = val
    }
  }
}
