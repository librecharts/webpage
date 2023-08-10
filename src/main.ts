import './assets/index.css'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import ChartsView from '@/views/ChartsView.vue'

const routes = [
  { path: '/', component: LandingView },
  { path: '/charts', component: ChartsView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

const app = createApp({})
app.use(router)

app.mount('#app')
