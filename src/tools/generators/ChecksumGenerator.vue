<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">文件校验 (Checksum)</h1>
      <p class="text-gray-600">上传文件，计算多种算法的校验值</p>
    </div>

    <div class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">选择文件</label>
        <input type="file" @change="onFile" />
        <p v-if="fileInfo.name" class="text-sm text-gray-600">{{ fileInfo.name }} · {{ humanSize(fileInfo.size) }}</p>
      </div>

      <div class="bg-white border rounded-lg overflow-hidden">
        <div class="px-4 py-2 border-b text-sm text-gray-500">结果</div>
        <div class="divide-y">
          <div v-for="row in rows" :key="row.algo" class="flex items-center justify-between px-4 py-3">
            <div class="text-sm text-gray-700 w-24">{{ row.algo }}</div>
            <div class="flex-1">
              <div class="font-mono text-xs break-all text-gray-900">{{ row.value || '—' }}</div>
            </div>
            <div class="w-20 text-right">
              <button @click="copy(row.value)" :disabled="!row.value" class="text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50">复制</button>
            </div>
          </div>
          <div v-if="!rows.length" class="px-4 py-6 text-center text-sm text-gray-400">尚未选择文件</div>
        </div>
      </div>

      <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

const algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512']
const fileInfo = ref({ name: '', size: 0 })
const rows = ref([])
const error = ref('')

function humanSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes, u = 0
  while (n >= 1024 && u < units.length - 1) { n /= 1024; u++ }
  return `${n.toFixed(2)} ${units[u]}`
}

function toWordArrayFromArrayBuffer(ab) {
  const u8 = new Uint8Array(ab)
  const words = []
  for (let i = 0; i < u8.length; i += 4) {
    words.push(
      (u8[i] << 24) | ((u8[i + 1] || 0) << 16) | ((u8[i + 2] || 0) << 8) | (u8[i + 3] || 0)
    )
  }
  return CryptoJS.lib.WordArray.create(words, u8.length)
}

function compute(algo, wordArray) {
  switch (algo) {
    case 'MD5': return CryptoJS.MD5(wordArray)
    case 'SHA1': return CryptoJS.SHA1(wordArray)
    case 'SHA256': return CryptoJS.SHA256(wordArray)
    case 'SHA512': return CryptoJS.SHA512(wordArray)
  }
}

function onFile(e) {
  error.value = ''
  rows.value = []
  const f = e.target.files && e.target.files[0]
  if (!f) return
  fileInfo.value = { name: f.name, size: f.size }
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const wa = toWordArrayFromArrayBuffer(reader.result)
      rows.value = algorithms.map((algo) => {
        const digest = compute(algo, wa)
        return { algo, value: CryptoJS.enc.Hex.stringify(digest) }
      })
    } catch (e) {
      error.value = '计算失败'
    }
  }
  reader.onerror = () => { error.value = '文件读取失败' }
  reader.readAsArrayBuffer(f)
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}
</script>


