<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">JWT 解码器</h1>
      <p class="text-gray-600">解析 JWT（不验证签名），展示 Header / Payload / Signature</p>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">JWT 字符串</label>
      <div class="relative">
        <textarea
          v-model="token"
          @input="decodeJwt"
          placeholder="粘贴形如 header.payload.signature 的 JWT 字符串"
          class="w-full h-32 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
        ></textarea>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
          <button @click="clear()" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
        </div>
      </div>
      <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">Header</label>
          <button @click="copy(headerText)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
        </div>
        <pre class="w-full h-64 p-4 border rounded-lg bg-gray-50 overflow-auto text-sm"><code>{{ headerText }}</code></pre>
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">Payload</label>
          <button @click="copy(payloadText)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
        </div>
        <pre class="w-full h-64 p-4 border rounded-lg bg-gray-50 overflow-auto text-sm"><code>{{ payloadText }}</code></pre>
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">Signature</label>
          <button @click="copy(signature)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
        </div>
        <pre class="w-full h-64 p-4 border rounded-lg bg-gray-50 overflow-auto text-sm break-all"><code>{{ signature }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const token = ref('')
const error = ref('')
const headerText = ref('')
const payloadText = ref('')
const signature = ref('')

function base64UrlDecode(str) {
  // base64url -> base64
  const pad = (s) => s + '='.repeat((4 - (s.length % 4)) % 4)
  const b64 = pad(str.replace(/-/g, '+').replace(/_/g, '/'))
  try {
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    const dec = new TextDecoder()
    return dec.decode(bytes)
  } catch (e) {
    // 退化到非 UTF-8 场景
    try {
      return decodeURIComponent(escape(atob(b64)))
    } catch (e2) {
      throw e2
    }
  }
}

function decodePart(part) {
  const text = base64UrlDecode(part)
  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    // 非 JSON 的负载（少见）直接返回文本
    return text
  }
}

function decodeJwt() {
  error.value = ''
  headerText.value = ''
  payloadText.value = ''
  signature.value = ''
  const s = (token.value || '').trim()
  if (!s) return
  const parts = s.split('.')
  if (parts.length !== 3) {
    error.value = 'JWT 应包含三段：header.payload.signature'
    return
  }
  try {
    headerText.value = decodePart(parts[0])
    payloadText.value = decodePart(parts[1])
    signature.value = parts[2]
  } catch (e) {
    error.value = '解析失败，请检查 JWT 是否有效'
  }
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function clear() {
  token.value = ''
  headerText.value = ''
  payloadText.value = ''
  signature.value = ''
  error.value = ''
}
</script>


