import Vue from 'vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import BootstrapVue from 'bootstrap-vue'

// plugin
import { LayoutPlugin, NavPlugin, NavbarPlugin  } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(LayoutPlugin)
Vue.use(NavPlugin)
Vue.use(NavbarPlugin)

/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponent = {
  install (Vue) {
    Vue.component('BootstrapVue', BootstrapVue)
    Vue.component('LayoutPlugin', LayoutPlugin)
    Vue.component('NavPlugin', NavPlugin)
    Vue.component('NavbarPlugin', NavbarPlugin)
  }
}

export default GlobalComponent