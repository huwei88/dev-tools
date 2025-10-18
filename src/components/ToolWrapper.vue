<template>
  <div class="max-w-7xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- 工具头部 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ title || '欢迎使用 Web DevToys' }}
            </h2>
            <p v-if="description" class="mt-1 text-sm text-gray-600">
              {{ description }}
            </p>
          </div>
          <div v-if="$slots.actions" class="flex items-center space-x-2">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
      
      <!-- 工具内容区域 -->
      <div class="p-6">
        <slot></slot>
      </div>
    </div>
    <!-- 页面底部广告容器（工具页面统一放置） -->
    <div class="mt-4" ref="adsContainer">
      <ins
        v-if="adSlot"
        ref="adInsRef"
        class="adsbygoogle"
        style="display:block; text-align:center;"
        :data-ad-client="adClient"
        :data-ad-slot="adSlot"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const adsContainer = ref(null)
const adInsRef = ref(null)

const adClient = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-4168536134784646'
const adSlot = import.meta.env.VITE_ADSENSE_SLOT || ''

onMounted(() => {
  const ensureScript = () => {
    let script = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    )
    if (!script) {
      script = document.createElement('script')
      script.async = true
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adClient)}`
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }
    return script
  }

  const pushAds = () => {
    if (adInsRef.value) {
      if (import.meta.env.DEV) {
        adInsRef.value.setAttribute('data-adtest', 'on')
      }
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        // 忽略错误，通常为首次加载时容器尚未就绪
      }
    }
  }

  const scriptEl = ensureScript()
  if (scriptEl && !('adsbygoogle' in window)) {
    scriptEl.addEventListener('load', () => pushAds(), { once: true })
  } else {
    pushAds()
  }
})
</script>
