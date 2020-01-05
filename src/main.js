/* eslint-disable import/extensions */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import VJsoneditor from 'v-jsoneditor/src/index'

import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'

import VideoPlayer from 'vue-video-player'


import "../static/css/common/index.scss"
import "../static/css/common/icon/iconfont.css"


// 样式
import 'video.js/dist/video-js.css'



Vue.use(VJsoneditor)
Vue.use(VideoPlayer)

Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
