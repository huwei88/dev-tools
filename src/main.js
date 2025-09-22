import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/encoders/html',
      name: 'HtmlEncoder',
      component: () => import('./tools/encoders/HtmlEncoder.vue')
    },
    {
      path: '/converters/json-yaml',
      name: 'JsonYamlConverter',
      component: () => import('./tools/converters/JsonYamlConverter.vue')
    },
    {
      path: '/converters/number-base',
      name: 'NumberBaseConverter',
      component: () => import('./tools/converters/NumberBaseConverter.vue')
    },
    {
      path: '/converters/timestamp',
      name: 'TimestampConverter',
      component: () => import('./tools/converters/TimestampConverter.vue')
    },
    {
      path: '/converters/cron',
      name: 'CronParser',
      component: () => import('./tools/converters/CronParser.vue')
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
