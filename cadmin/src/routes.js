import Default from './components/Default.vue'
import Dashboard from './components/Dashboard.vue'
import Beacon from './components/Beacon.vue'
import Detail from './components/Detail.vue'
import Scanner from './components/Scanner.vue'
import MnReal from './components/Monitor/Real.vue'
import Main from './components/Main.vue'
import MnBeacon from './components/Monitor/Beacon.vue'
import Zone from './components/Zone.vue'
import Maps from './components/Map.vue'
import Monitor from './components/Monitor.vue'
import Stat from './components/Stat.vue'

const routes = [
  {
    path: '/Main',
    component: Main
  },
  {
    path: '/Dashboard',
    component: Dashboard
  },
  {
    path: '/Beacon/:id',
    component: Detail
  },
  {
    path: '/Beacon',
    component: Beacon
  },
  {
    path: '/Scanner/:id',
    component: Detail
  },
  {
    path: '/Scanner',
    component: Scanner
  },
  {
    path: '/Zone',
    component: Zone
  },
  {
    path: '/Map',
    component: Maps
  },
  {
    path: '/Monitor/realtime',
    component: MnReal
  },
  {
    path: '/Monitor/Beacon',
    component: MnBeacon
  },
  {
    path: '/Monitor',
    component: Monitor
  },
  {
    path: '/Stat/:id',
    component: Stat
  },
  {
    path: '/Default',
    component: Default
  },
  { path: '/*', 
    redirect: '/Main'
  }
]

export default routes