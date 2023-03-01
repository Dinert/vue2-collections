import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const moduleFiles = require.context('./modules', true, /\.js$/)

// 将modules中的文件转换为state模块
const modules = moduleFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = moduleFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})



const store =  new Vuex.Store({
  modules,
  state,
  getters,
  mutations
})

export default store
