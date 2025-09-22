<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">哈希生成器</h1>
      <p class="text-gray-600">计算文本或文件的 MD5 / SHA1 / SHA256 / SHA512</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-3 text-sm text-gray-700">
        <label class="inline-flex items-center">
          <input type="radio" value="text" v-model="mode" class="mr-1" /> 文本
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="file" v-model="mode" class="mr-1" /> 文件
        </label>
      </div>

      <div class="flex items-center space-x-2 text-sm text-gray-700">
        <label for="algo" class="text-sm font-medium text-gray-700">算法:</label>
        <select id="algo" v-model="algorithm" class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          <option v-for="a in algorithms" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </div>

    <!-- 文本模式 -->
    <div v-if="mode === 'text'" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输入文本</label>
        <div class="relative">
          <textarea
            v-model="textInput"
            @input="hashText"
            placeholder="输入待计算哈希的文本"
            class="w-full h-48 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(textInput)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('text')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">十六进制</label>
          <div class="relative">
            <textarea :value="hexOutput" readonly class="w-full h-28 p-3 border rounded bg-gray-50 font-mono text-sm"></textarea>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
              <button @click="copy(hexOutput)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Base64</label>
          <div class="relative">
            <textarea :value="b64Output" readonly class="w-full h-28 p-3 border rounded bg-gray-50 font-mono text-sm"></textarea>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
              <button @click="copy(b64Output)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件模式 -->
    <div v-else class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">选择文件</label>
        <input type="file" @change="onFile" />
        <p v-if="fileInfo.name" class="text-sm text-gray-600">{{ fileInfo.name }} · {{ humanSize(fileInfo.size) }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">十六进制</label>
          <div class="relative">
            <textarea :value="hexOutput" readonly class="w-full h-28 p-3 border rounded bg-gray-50 font-mono text-sm"></textarea>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
              <button @click="copy(hexOutput)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Base64</label>
          <div class="relative">
            <textarea :value="b64Output" readonly class="w-full h-28 p-3 border rounded bg-gray-50 font-mono text-sm"></textarea>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
              <button @click="copy(b64Output)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CryptoJS from 'crypto-js'

const mode = ref('text')
const algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512']
const algorithm = ref('SHA256')

const textInput = ref('')
const hexOutput = ref('')
const b64Output = ref('')
const error = ref('')
const fileInfo = ref({ name: '', size: 0 })

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

function computeWordArrayHash(wordArray) {
  switch (algorithm.value) {
    case 'MD5': return CryptoJS.MD5(wordArray)
    case 'SHA1': return CryptoJS.SHA1(wordArray)
    case 'SHA256': return CryptoJS.SHA256(wordArray)
    case 'SHA512': return CryptoJS.SHA512(wordArray)
  }
}

function hashText() {
  error.value = ''
  try {
    const wa = CryptoJS.enc.Utf8.parse(textInput.value || '')
    const digest = computeWordArrayHash(wa)
    hexOutput.value = CryptoJS.enc.Hex.stringify(digest)
    b64Output.value = CryptoJS.enc.Base64.stringify(digest)
  } catch (e) {
    error.value = '计算失败'
    hexOutput.value = ''
    b64Output.value = ''
  }
}

function onFile(e) {
  error.value = ''
  hexOutput.value = ''
  b64Output.value = ''
  const f = e.target.files && e.target.files[0]
  if (!f) return
  fileInfo.value = { name: f.name, size: f.size }
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const wa = toWordArrayFromArrayBuffer(reader.result)
      const digest = computeWordArrayHash(wa)
      hexOutput.value = CryptoJS.enc.Hex.stringify(digest)
      b64Output.value = CryptoJS.enc.Base64.stringify(digest)
    } catch (err) {
      error.value = '文件计算失败'
    }
  }
  reader.onerror = () => { error.value = '文件读取失败' }
  reader.readAsArrayBuffer(f)
}

function humanSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes, u = 0
  while (n >= 1024 && u < units.length - 1) { n /= 1024; u++ }
  return `${n.toFixed(2)} ${units[u]}`
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function clear(which) {
  if (which === 'text') { textInput.value = ''; hexOutput.value = ''; b64Output.value = '' }
}

watch([algorithm, mode], () => {
  if (mode.value === 'text') hashText()
})
</script>


