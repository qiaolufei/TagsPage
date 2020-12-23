import Vue from 'vue'
import App from './App'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import qs from 'qs'
import '../static/reset.css'
import VueDND from 'awe-dnd'

Vue.use(VueDND)
Vue.use(elementUI)
Vue.prototype.$qs = qs // 可全局调用 this.$qs

Vue.config.productionTip = false
var _hmt
_hmt = _hmt || []
window._hmt = _hmt;

(function () {
  var hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?4d45276a3b47c5074ad2406201db860a'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
})()

router.beforeEach((to, from, next) => {
  if (_hmt) {
    if (to.path) {
      _hmt.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
