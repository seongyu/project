require("./assets/custom.css")

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import axios from 'axios'

// import global components
import GlobalComponent from './GlobalComponent.js'

Vue.use(VueRouter)
Vue.use(GlobalComponent)
Vue.config.productionTip = false

// import & config router
import routes from './routes'

const router = new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'active'
})

Vue.prototype.$http = axios
Vue.prototype.$apiUrl = "http://localhost:8511";

new Vue({
  el : "#app",
  router,
  render (h) { return h(App) }
})