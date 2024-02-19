import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import draggable from 'vuedraggable'
import './permission'

// 样式
import '@/assets/scss/normal.scss'
import '@/assets/scss/element.scss'
import '@/assets/scss/common/index.scss'
import 'leaflet/dist/leaflet.css'


// icon
import './assets/icons'


// 插件
import './plugins/element-ui'
import './plugins/dinert'
import './plugins/icon'
import 'animate.css'
import './rem'

Vue.component(draggable.name, draggable)

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
