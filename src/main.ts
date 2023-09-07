import './assets/index.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import ChartsView from '@/views/ChartsView.vue'
import * as Sentry from '@sentry/vue'
import { HttpClient } from '@sentry/integrations'

const routes = [
  { path: '/', component: LandingView },
  { path: '/charts', component: ChartsView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

const app = createApp({})
Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_URI,
  trackComponents: true,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router)
    }),
    new Sentry.Replay(),
    new HttpClient()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})
app.use(router)

app.mount('#app')
