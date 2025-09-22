<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Base64 编码 / 解码</h1>
      <p class="text-gray-600">文本与文件的 Base64 转换（本地完成，安全私密）</p>
    </div>

    <div class="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center space-x-3 text-sm text-gray-700">
        <label class="inline-flex items-center">
          <input type="radio" value="text" v-model="tab" class="mr-1" /> 文本模式
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="file" v-model="tab" class="mr-1" /> 文件模式
        </label>
      </div>

      <div class="flex items-center space-x-3 text-sm text-gray-700" v-if="tab === 'text'">
        <label class="inline-flex items-center">
          <input type="radio" value="encode" v-model="mode" class="mr-1" /> 编码
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="decode" v-model="mode" class="mr-1" /> 解码
        </label>
      </div>
      <div class="flex items-center space-x-3 text-sm text-gray-700" v-else>
        <label class="inline-flex items-center">
          <input type="radio" value="encode" v-model="mode" class="mr-1" /> 文件 → Base64
        </label>
        <label class="inline-flex items-center">
          <input type="radio" value="decode" v-model="mode" class="mr-1" /> Base64 → 文件
        </label>
      </div>
    </div>

    <!-- 文本模式 -->
    <div v-if="tab === 'text'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输入</label>
        <div class="relative">
          <textarea
            v-model="textInput"
            @input="transformText"
            :placeholder="mode === 'encode' ? '输入原文，将被编码为 Base64' : '输入 Base64 字符串，将被解码为原文'"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(textInput)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('textInput')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
        <p v-if="textError" class="text-xs text-red-600">{{ textError }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">输出</label>
        <div class="relative">
          <textarea
            :value="textOutput"
            readonly
            placeholder="转换结果将显示在此"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none bg-gray-50 focus:outline-none border-gray-200"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(textOutput)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('textOutput')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件模式：编码 -->
    <div v-if="tab === 'file' && mode === 'encode'" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">选择文件</label>
        <input type="file" @change="onFileSelected" />
      </div>

      <div v-if="fileName" class="text-sm text-gray-600">
        文件: <span class="font-medium">{{ fileName }}</span>
        <span class="ml-2">类型: {{ fileType || '未知' }}</span>
        <span class="ml-2">大小: {{ humanSize(fileSize) }}</span>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Base64 输出</label>
        <div class="relative">
          <textarea
            :value="fileBase64"
            readonly
            placeholder="文件的 Base64 字符串"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none bg-gray-50 focus:outline-none border-gray-200"
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            <button @click="copy(fileBase64)" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">复制</button>
            <button @click="clear('fileBase64')" class="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">清空</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件模式：解码 -->
    <div v-if="tab === 'file' && mode === 'decode'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Base64 输入</label>
          <textarea
            v-model="fileBase64Input"
            placeholder="在此粘贴文件的 Base64 字符串（不含 data: 前缀）"
            class="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          ></textarea>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">文件信息</label>
          <div class="grid grid-cols-1 gap-3">
            <input v-model="downloadName" placeholder="文件名（如 output.bin 或 image.png）" class="p-2 border rounded" />
            <input v-model="downloadMime" placeholder="MIME 类型（可选，如 application/octet-stream 或 image/png）" class="p-2 border rounded" />
            <button @click="makeDownload()" class="inline-flex items-center px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50">生成下载链接</button>
            <a v-if="downloadUrl" :href="downloadUrl" :download="downloadName || 'download.bin'" class="text-blue-600 text-sm underline">点击下载解码后的文件</a>
          </div>
        </div>
      </div>
      <p v-if="fileError" class="text-xs text-red-600">{{ fileError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const tab = ref('text') // 'text' | 'file'
const mode = ref('encode') // 'encode' | 'decode'

// 文本模式
const textInput = ref('')
const textOutput = ref('')
const textError = ref('')

// 文件模式 - 编码
const fileName = ref('')
const fileType = ref('')
const fileSize = ref(0)
const fileBase64 = ref('')

// 文件模式 - 解码
const fileBase64Input = ref('')
const fileError = ref('')
const downloadName = ref('')
const downloadMime = ref('')
const downloadUrl = ref('')

function humanSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let u = 0
  while (n >= 1024 && u < units.length - 1) { n /= 1024; u++ }
  return `${n.toFixed(2)} ${units[u]}`
}

function base64EncodeString(str) {
  // 处理 Unicode：先 UTF-8 编码再 btoa
  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch (e) {
    // 某些极端字符可能失败，降级尝试
    const encoder = new TextEncoder()
    const bytes = encoder.encode(str)
    let binary = ''
    const chunk = 0x8000
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
    }
    return btoa(binary)
  }
}

function base64DecodeToString(b64) {
  try {
    return decodeURIComponent(escape(atob(b64)))
  } catch (e) {
    // 降级：按二进制再 UTF-8 解码
    const bin = atob(b64)
    const len = bin.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i)
    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  }
}

function transformText() {
  textError.value = ''
  try {
    textOutput.value = mode.value === 'encode' ? base64EncodeString(textInput.value) : base64DecodeToString(textInput.value)
  } catch (e) {
    textError.value = e && e.message ? e.message : '转换失败，请检查输入'
    textOutput.value = ''
  }
}

function onFileSelected(event) {
  fileBase64.value = ''
  const f = event.target.files && event.target.files[0]
  if (!f) return
  fileName.value = f.name
  fileType.value = f.type
  fileSize.value = f.size

  const reader = new FileReader()
  reader.onload = () => {
    const result = String(reader.result || '')
    // data:[mime];base64,xxxx
    const idx = result.indexOf(',')
    fileBase64.value = idx >= 0 ? result.slice(idx + 1) : result
  }
  reader.onerror = () => {
    fileBase64.value = ''
  }
  reader.readAsDataURL(f)
}

function makeDownload() {
  fileError.value = ''
  downloadUrl.value = ''
  try {
    const bin = atob((fileBase64Input.value || '').trim())
    const len = bin.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i)
    const mime = (downloadMime.value || 'application/octet-stream').trim()
    const blob = new Blob([bytes], { type: mime })
    if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = URL.createObjectURL(blob)
  } catch (e) {
    fileError.value = 'Base64 无法解码，请检查内容是否有效'
  }
}

function copy(text) {
  if (!text) return
  navigator.clipboard.writeText(String(text)).catch(() => {})
}

function clear(which) {
  if (which === 'textInput') {
    textInput.value = ''
    textOutput.value = ''
    textError.value = ''
  } else if (which === 'textOutput') {
    textOutput.value = ''
  } else if (which === 'fileBase64') {
    fileBase64.value = ''
    fileName.value = ''
    fileType.value = ''
    fileSize.value = 0
  }
}

watch([tab, mode], () => {
  if (tab.value === 'text') transformText()
})
</script>


