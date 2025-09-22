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
      path: '/encoders/url',
      name: 'UrlEncoder',
      component: () => import('./tools/encoders/UrlEncoder.vue')
    },
    {
      path: '/encoders/base64',
      name: 'Base64Coder',
      component: () => import('./tools/encoders/Base64Coder.vue')
    },
    {
      path: '/encoders/gzip',
      name: 'GzipCompressor',
      component: () => import('./tools/encoders/GzipCompressor.vue')
    },
    {
      path: '/encoders/jwt',
      name: 'JwtDecoder',
      component: () => import('./tools/encoders/JwtDecoder.vue')
    },
    {
      path: '/formatters/json',
      name: 'JsonFormatter',
      component: () => import('./tools/formatters/JsonFormatter.vue')
    },
    {
      path: '/formatters/sql',
      name: 'SqlFormatter',
      component: () => import('./tools/formatters/SqlFormatter.vue')
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
