import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import setting from './modules/setting'
import globalState from './modules/globalState'
import contact from './modules/contact'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    setting,
    globalState,
    contact
  }
})
