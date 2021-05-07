/*
 * @Descripttion: 
 * @Author: zxy
 * @Date: 2020-07-02 22:47:45
 * @LastEditTime: 2020-12-02 00:36:47
 */ 
// 导入axios
import axios from 'axios'
import echarts from 'echarts'
// 导入moment
import moment from 'moment'
// 导入qs
import qs from 'qs'
// import echarts from 'echarts-gl'
import vcolorpicker from 'vcolorpicker'
import Vue from 'vue'
// 导入antdesign
import '../src/plugins/antdesign.js'
import App from './App.vue'
// 导入全局样式表
import './assets/css/global.less'
import './plugins/antdesign.js'
import './plugins/gridlayout.js'
import router from './router'
import store from './store'



//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
// 把axios挂载的VUE的原型对象上
Vue.prototype.$http = axios

// 把qs挂载到原型对象上
Vue.prototype.$qs = qs
// 定义全局时间戳过滤器
Vue.filter('dateformat', function(input, fmtstring) {
  // 使用momentjs这个日期格式化类库实现日期的格式化功能
  return moment(input).format(fmtstring)
})

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(vcolorpicker)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
