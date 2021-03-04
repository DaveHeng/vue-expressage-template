import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import '@/components/vueExpressageTemplate/index'

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
