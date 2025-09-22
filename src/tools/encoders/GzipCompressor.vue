<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">GZip 压缩 / 解压</h1>
      <p class="text-gray-600">对文本进行 GZip 压缩和解压，显示压缩率</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-3 text-sm text-gray-700">
        <label class="inline-flex items-center">
          <input type="radio" value="compress" v-model="mode" class="mr-1" /> 压缩
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="decompress" v-model="mode" class="mr-1" /> 解压
        </label>
      </div>

      <div class="text-sm text-gray-600">
        <span>原文长度: <span class="font-mono">{{ inputBytes }}</span> 字节</span>
        <span class="mx-2">|</span>
        <span v-if="mode === 'compress'">压缩后长度: <span class="font-mono">{{ outputBytes }}</span> 字节</span>
        <span v-else>解压后长度: <span class="font-mono">{{ outputBytes }}</span> 字节</span>
        <span class="mx-2">|</span>
        <span>压缩率: <span class="font-mono">{{ ratioText }}</span></span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输入</label>
        <div class="relative">
          <textarea
            v-model="input"
            @input="transform"
            :placeholder="mode === 'compress' ? '输入原文，将被压缩为 GZip（Base64 展示）' : '输入 GZip 的 Base64 字符串，将被解压为原文'"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(input)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('input')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
        <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输出</label>
        <div class="relative">
          <textarea
            :value="output"
            readonly
            placeholder="转换结果将显示在此"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none bg-gray-50 focus:outline-none border-gray-200"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(output)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('output')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { deflate, inflate } from 'pako'

const mode = ref('compress') // 'compress' | 'decompress'
const input = ref('')
const output = ref('')
const error = ref('')

const inputBytes = computed(() => new TextEncoder().encode(input.value || '').length)
const outputBytes = computed(() => new TextEncoder().encode(output.value || '').length)
const ratioText = computed(() => {
  if (!inputBytes.value) return '—'
  const r = outputBytes.value / inputBytes.value
  return mode.value === 'compress' ? `${(r * 100).toFixed(1)}%` : `${(1 / r).toFixed(2)}x`
})

function u8ToBase64(u8) {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < u8.length; i += chunk) {
    binary += String.fromCharCode.apply(null, u8.subarray(i, i + chunk))
  }
  return btoa(binary)
}

function base64ToU8(b64) {
  const bin = atob(b64)
  const len = bin.length
  const u8 = new Uint8Array(len)
  for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i)
  return u8
}

function compressText(text) {
  const bytes = new TextEncoder().encode(text)
  const gz = deflate(bytes)
  return u8ToBase64(gz)
}

function decompressText(b64) {
  const gz = base64ToU8(b64)
  const out = inflate(gz)
  return new TextDecoder().decode(out)
}

function transform() {
  error.value = ''
  try {
    output.value = mode.value === 'compress' ? compressText(input.value) : decompressText(input.value)
  } catch (e) {
    error.value = e && e.message ? e.message : '转换失败，请检查输入'
    output.value = ''
  }
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function clear(which) {
  if (which === 'input') {
    input.value = ''
    output.value = ''
    error.value = ''
  } else if (which === 'output') {
    output.value = ''
  }
}

watch(mode, () => transform())
</script>


