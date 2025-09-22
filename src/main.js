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
      path: '/formatters/xml',
      name: 'XmlFormatter',
      component: () => import('./tools/formatters/XmlFormatter.vue')
    },
    {
      path: '/generators/hash',
      name: 'HashGenerator',
      component: () => import('./tools/generators/HashGenerator.vue')
    },
    {
      path: '/generators/uuid',
      name: 'UuidGenerator',
      component: () => import('./tools/generators/UuidGenerator.vue')
    },
    {
      path: '/generators/lorem',
      name: 'LoremIpsumGenerator',
      component: () => import('./tools/generators/LoremIpsumGenerator.vue')
    },
    {
      path: '/generators/checksum',
      name: 'ChecksumGenerator',
      component: () => import('./tools/generators/ChecksumGenerator.vue')
    },
    {
      path: '/text/diff',
      name: 'TextDiffViewer',
      component: () => import('./tools/text/TextDiffViewer.vue')
    },
    {
      path: '/text/regex',
      name: 'RegexTester',
      component: () => import('./tools/text/RegexTester.vue')
    },
    {
      path: '/text/inspector',
      name: 'TextInspector',
      component: () => import('./tools/text/TextInspector.vue')
    },
    {
      path: '/graphic/color',
      name: 'ColorPicker',
      component: () => import('./tools/graphic/ColorPicker.vue')
    },
    {
      path: '/graphic/image-compressor',
      name: 'ImageCompressor',
      component: () => import('./tools/graphic/ImageCompressor.vue')
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
