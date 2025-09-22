<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">颜色选择与对比度</h1>
      <p class="text-gray-600">选择前景/背景颜色，查看 HEX / RGB / HSL，并计算 WCAG 对比度</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white border rounded-lg p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-gray-700">前景色 (Text)</div>
          <input type="color" v-model="fgHex" @input="syncFromHex('fg')" />
        </div>
        <div class="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div class="text-gray-500">HEX</div>
            <input v-model="fgHex" @input="syncFromHex('fg')" class="w-full p-2 border rounded font-mono" />
          </div>
          <div>
            <div class="text-gray-500">RGB</div>
            <div class="font-mono">{{ rgbString(fgRgb) }}</div>
          </div>
          <div>
            <div class="text-gray-500">HSL</div>
            <div class="font-mono">{{ hslString(fgHsl) }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-gray-700">背景色 (Background)</div>
          <input type="color" v-model="bgHex" @input="syncFromHex('bg')" />
        </div>
        <div class="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div class="text-gray-500">HEX</div>
            <input v-model="bgHex" @input="syncFromHex('bg')" class="w-full p-2 border rounded font-mono" />
          </div>
          <div>
            <div class="text-gray-500">RGB</div>
            <div class="font-mono">{{ rgbString(bgRgb) }}</div>
          </div>
          <div>
            <div class="text-gray-500">HSL</div>
            <div class="font-mono">{{ hslString(bgHsl) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded-lg">
      <div class="px-4 py-2 border-b text-sm text-gray-500">对比度</div>
      <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div class="text-2xl font-semibold">{{ contrast.toFixed(2) }} : 1</div>
        <div class="space-y-1 text-sm">
          <div>普通文本 AA: <b :class="passAA ? 'text-green-600' : 'text-red-600'">{{ passAA ? '通过' : '不通过' }}</b></div>
          <div>普通文本 AAA: <b :class="passAAA ? 'text-green-600' : 'text-red-600'">{{ passAAA ? '通过' : '不通过' }}</b></div>
          <div>大号文本 AA: <b :class="passAALarge ? 'text-green-600' : 'text-red-600'">{{ passAALarge ? '通过' : '不通过' }}</b></div>
          <div>大号文本 AAA: <b :class="passAAALarge ? 'text-green-600' : 'text-red-600'">{{ passAAALarge ? '通过' : '不通过' }}</b></div>
        </div>
        <div>
          <div class="border rounded p-4" :style="{ backgroundColor: bgHex, color: fgHex }">
            <div class="text-base">普通文本 Aa 文字示例</div>
            <div class="text-2xl font-semibold mt-2">大号文本 Aa</div>
            <div class="text-xs opacity-70 mt-2">HEX {{ fgHex }} on {{ bgHex }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const fgHex = ref('#1f2937') // slate-800
const bgHex = ref('#ffffff')

function clamp01(n) { return Math.min(1, Math.max(0, n)) }

function hexToRgb(hex) {
  const h = hex.replace('#', '').trim()
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    return { r, g, b }
  }
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return { r, g, b }
}

function rgbToHex({ r, g, b }) {
  const to = (n) => n.toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

function rgbToHsl({ r, g, b }) {
  const R = r / 255, G = g / 255, B = b / 255
  const max = Math.max(R, G, B), min = Math.min(R, G, B)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case R: h = (G - B) / d + (G < B ? 6 : 0); break
      case G: h = (B - R) / d + 2; break
      case B: h = (R - G) / d + 4; break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function relativeLuminance({ r, g, b }) {
  const srgb = [r, g, b].map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

const fgRgb = computed(() => hexToRgb(fgHex.value))
const bgRgb = computed(() => hexToRgb(bgHex.value))
const fgHsl = computed(() => rgbToHsl(fgRgb.value))
const bgHsl = computed(() => rgbToHsl(bgRgb.value))

const contrast = computed(() => {
  const L1 = relativeLuminance(fgRgb.value)
  const L2 = relativeLuminance(bgRgb.value)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
})

const passAA = computed(() => contrast.value >= 4.5)
const passAAA = computed(() => contrast.value >= 7)
const passAALarge = computed(() => contrast.value >= 3)
const passAAALarge = computed(() => contrast.value >= 4.5)

function rgbString({ r, g, b }) { return `rgb(${r}, ${g}, ${b})` }
function hslString({ h, s, l }) { return `hsl(${h}, ${s}%, ${l}%)` }

function normalizeHex(hex) {
  let v = hex.trim()
  if (!v.startsWith('#')) v = `#${v}`
  if (/^#([\da-fA-F]{3})$/.test(v)) return v
  if (/^#([\da-fA-F]{6})$/.test(v)) return v
  return '#000000'
}

function syncFromHex(which) {
  if (which === 'fg') fgHex.value = normalizeHex(fgHex.value)
  else bgHex.value = normalizeHex(bgHex.value)
}
</script>


