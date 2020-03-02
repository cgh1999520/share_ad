// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import SaveVuex from './libs/SaveVuex'
import router from './router'
import './common/common.less'
import 'iview/dist/styles/iview.css'
import Iview from 'iview'
import config from './config/index'
import './directives/index'
import store from './store/index'
import VueAMap from 'vue-amap'
import CustomImg from './components/custom-img'
import QRCode from 'qrcodejs2'

Vue.config.productionTip = false
Vue.use(VueAMap)
Vue.use(Iview)
Vue.prototype.$config = config
Vue.prototype.$qrCode = QRCode
// 全局登录提醒
Vue.prototype.$login_call = function (cb) {
  Iview.Modal.confirm({
    title: '温馨提示:',
    content: '该功能需要登录后才可使用!',
    okText: '去登录',
    onOk: () => {
      console.log('登录了')
      cb()
    }
  })
}
// 自定义组件，全局注册
Vue.component(CustomImg.name, CustomImg)
// 保存 vuex记录
SaveVuex(store)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
